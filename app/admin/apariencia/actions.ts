"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";
import { createClient } from "@/lib/supabase/server";
import {
  THEME_IDS, FONT_PAIR_IDS, RADIUS_IDS, ADMIN_THEME_IDS, THEMES, DEFAULT_SETTINGS,
  MIN_TEXT_CONTRAST, contrastRatio, isOneOf, normalizeHex, type SiteSettings,
} from "@/lib/theme";

export type AppearanceState = { ok: boolean; message: string | null };

export async function updateAppearance(
  _prev: AppearanceState,
  formData: FormData
): Promise<AppearanceState> {
  // Defensa en profundidad: el middleware protege /admin, pero la action se verifica sola
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Tu sesión venció. Volvé a iniciar sesión." };

  const intent = formData.get("intent");
  let next: SiteSettings;

  if (intent === "reset") {
    next = DEFAULT_SETTINGS;
  } else {
    const theme = formData.get("theme");
    const fontPair = formData.get("fontPair");
    const radius = formData.get("radius");
    const adminTheme = formData.get("adminTheme");

    if (!isOneOf(THEME_IDS, theme)) return { ok: false, message: "Elegí un tema de la lista." };
    if (!isOneOf(FONT_PAIR_IDS, fontPair)) return { ok: false, message: "Elegí un estilo de fuentes de la lista." };
    if (!isOneOf(RADIUS_IDS, radius)) return { ok: false, message: "Elegí un tipo de bordes de la lista." };
    if (!isOneOf(ADMIN_THEME_IDS, adminTheme)) return { ok: false, message: "Elegí una apariencia para el panel." };

    const useCustom = formData.get("useCustom") === "on";
    const fields = { accent: "color de acento", bg: "color de fondo", textColor: "color de texto" } as const;
    const custom: Record<keyof typeof fields, string | null> = { accent: null, bg: null, textColor: null };

    if (useCustom) {
      for (const key of Object.keys(fields) as (keyof typeof fields)[]) {
        const raw = formData.get(key);
        if (raw === null || raw === "") continue;
        const hex = normalizeHex(raw);
        if (!hex) return { ok: false, message: `El ${fields[key]} tiene que tener el formato #rrggbb.` };
        custom[key] = hex;
      }

      const base = THEMES[theme].light;
      const bg = custom.bg ?? base.bg;
      const text = custom.textColor ?? base.text;
      const ratio = contrastRatio(text, bg);
      if ((custom.bg || custom.textColor) && ratio < MIN_TEXT_CONTRAST) {
        return {
          ok: false,
          message: `El texto no se lee bien sobre ese fondo (contraste ${ratio.toFixed(1)}:1, mínimo ${MIN_TEXT_CONTRAST}:1). Elegí colores con más diferencia.`,
        };
      }
      if (custom.accent && contrastRatio(custom.accent, bg) < 3) {
        return { ok: false, message: "El color de acento casi no se distingue del fondo. Elegí uno más oscuro o más claro." };
      }
    }

    next = { theme, fontPair, radius, adminTheme, ...custom };
  }

  try {
    const values = { ...next, updatedAt: new Date() };
    await db
      .insert(siteSettings)
      .values({ id: 1, ...values })
      .onConflictDoUpdate({ target: siteSettings.id, set: values });
  } catch (err) {
    console.error("[updateAppearance]", user.id, (err as Error).message);
    return { ok: false, message: "No se pudo guardar. Revisá que la tabla site_settings exista y probá de nuevo." };
  }

  revalidatePath("/", "layout");
  return { ok: true, message: intent === "reset" ? "Apariencia restablecida." : "Apariencia guardada." };
}
