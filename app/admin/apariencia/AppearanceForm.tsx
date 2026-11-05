"use client";

import { useActionState, useState } from "react";
import {
  THEMES, THEME_IDS, FONT_PAIRS, FONT_PAIR_IDS, RADII, RADIUS_IDS, ADMIN_THEMES, ADMIN_THEME_IDS,
  MIN_TEXT_CONTRAST, contrastRatio, normalizeHex,
  type SiteSettings, type ThemeId,
} from "@/lib/theme";
import { updateAppearance, type AppearanceState } from "./actions";

const initialState: AppearanceState = { ok: false, message: null };

const sectionClass = "bg-white border border-neutral-200 p-6 md:p-8";
const titleClass = "text-xs uppercase tracking-widest text-neutral-500 mb-5";

function optionClass(selected: boolean) {
  return `block cursor-pointer border p-4 transition-colors ${
    selected ? "border-neutral-900 bg-neutral-50" : "border-neutral-200 hover:border-neutral-400"
  }`;
}

function ColorField({
  name, label, value, fallback, onChange,
}: {
  name: string; label: string; value: string; fallback: string; onChange: (v: string) => void;
}) {
  const valid = value === "" || normalizeHex(value) !== null;
  return (
    <div>
      <label htmlFor={name} className="block text-sm text-neutral-700 mb-2">{label}</label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          aria-label={`${label} (selector)`}
          value={normalizeHex(value) ?? fallback}
          onChange={(e) => onChange(e.target.value)}
          className="w-11 h-11 p-0 border border-neutral-300 cursor-pointer bg-transparent"
        />
        <input
          id={name}
          name={name}
          type="text"
          inputMode="text"
          maxLength={7}
          placeholder={fallback}
          value={value}
          onChange={(e) => onChange(e.target.value.trim())}
          aria-invalid={!valid}
          className="w-32 px-3 py-2 border border-neutral-300 text-sm font-mono bg-white focus:outline-none focus:border-neutral-900"
        />
        {value && (
          <button type="button" onClick={() => onChange("")} className="text-xs text-neutral-500 underline">
            Usar el del tema
          </button>
        )}
      </div>
      {!valid && <p className="text-xs text-red-600 mt-1">Formato #rrggbb, por ejemplo #8b6914.</p>}
    </div>
  );
}

export function AppearanceForm({ initial }: { initial: SiteSettings }) {
  const [state, formAction, isPending] = useActionState(updateAppearance, initialState);

  const [theme, setTheme] = useState<ThemeId>(initial.theme);
  const [fontPair, setFontPair] = useState(initial.fontPair);
  const [radius, setRadius] = useState(initial.radius);
  const [adminTheme, setAdminTheme] = useState(initial.adminTheme);
  const [useCustom, setUseCustom] = useState(!!(initial.accent || initial.bg || initial.textColor));
  const [accent, setAccent] = useState(initial.accent ?? "");
  const [bg, setBg] = useState(initial.bg ?? "");
  const [textColor, setTextColor] = useState(initial.textColor ?? "");

  const base = THEMES[theme].light;
  const effBg = normalizeHex(bg) ?? base.bg;
  const effText = normalizeHex(textColor) ?? base.text;
  const effAccent = normalizeHex(accent) ?? base.accent;
  const ratio = contrastRatio(effText, effBg);
  const contrastOk = ratio >= MIN_TEXT_CONTRAST;

  return (
    <form action={formAction} className="space-y-8">
      {/* TEMA */}
      <section className={sectionClass}>
        <h2 className={titleClass}>Tema de la tienda</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {THEME_IDS.map((id) => {
            const t = THEMES[id];
            return (
              <label key={id} className={optionClass(theme === id)}>
                <input type="radio" name="theme" value={id} checked={theme === id} onChange={() => setTheme(id)} className="sr-only" />
                <div className="flex gap-1.5 mb-3" aria-hidden="true">
                  {[t.light.bg, t.light.bgWarm, t.light.text, t.light.accent].map((c, i) => (
                    <span key={i} className="w-7 h-7 rounded-full border border-neutral-200" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <div className="text-sm font-medium text-neutral-900">{t.label}</div>
                <div className="text-xs text-neutral-500 mt-1">{t.description}</div>
              </label>
            );
          })}
        </div>
        <p className="text-xs text-neutral-500 mt-4">
          Las clientas pueden seguir cambiando a modo oscuro con el botón de la tienda; cada tema tiene su versión oscura.
        </p>
      </section>

      {/* COLORES PERSONALIZADOS */}
      <section className={sectionClass}>
        <h2 className={titleClass}>Colores personalizados</h2>
        <label className="flex items-center gap-3 text-sm text-neutral-700 cursor-pointer">
          <input type="checkbox" name="useCustom" checked={useCustom} onChange={(e) => setUseCustom(e.target.checked)} className="w-4 h-4" />
          Usar mis propios colores encima del tema
        </label>

        {useCustom && (
          <div className="mt-6 grid md:grid-cols-[1fr_260px] gap-8">
            <div className="space-y-5">
              <ColorField name="accent" label="Acento (botones y detalles)" value={accent} fallback={base.accent} onChange={setAccent} />
              <ColorField name="bg" label="Fondo" value={bg} fallback={base.bg} onChange={setBg} />
              <ColorField name="textColor" label="Texto" value={textColor} fallback={base.text} onChange={setTextColor} />
              <p className="text-xs text-neutral-500">El fondo y el texto se aplican en modo claro. El acento se aplica en los dos modos.</p>
            </div>

            <div>
              <div className="border border-neutral-200 p-5" style={{ backgroundColor: effBg, color: effText }}>
                <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: effAccent }}>Vista rápida</div>
                <div className="text-lg mb-2">Vestido bordado</div>
                <div className="text-sm mb-4">$63.000</div>
                <span className="inline-block px-4 py-2 text-[11px] uppercase tracking-widest" style={{ backgroundColor: effAccent, color: contrastRatio(effAccent, "#ffffff") >= contrastRatio(effAccent, "#1a1a1a") ? "#ffffff" : "#1a1a1a" }}>
                  Agregar al carrito
                </span>
              </div>
              <p className={`text-xs mt-3 ${contrastOk ? "text-green-600" : "text-red-600"}`} role="status">
                Contraste del texto: {ratio.toFixed(1)}:1 {contrastOk ? "· se lee bien" : `· muy bajo, mínimo ${MIN_TEXT_CONTRAST}:1`}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* FUENTES Y FORMAS */}
      <section className={sectionClass}>
        <h2 className={titleClass}>Fuentes</h2>
        <div className="grid sm:grid-cols-3 gap-3 mb-8">
          {FONT_PAIR_IDS.map((id) => (
            <label key={id} className={optionClass(fontPair === id)}>
              <input type="radio" name="fontPair" value={id} checked={fontPair === id} onChange={() => setFontPair(id)} className="sr-only" />
              <div className="text-sm font-medium text-neutral-900">{FONT_PAIRS[id].label}</div>
              <div className="text-xs text-neutral-500 mt-1">{FONT_PAIRS[id].description}</div>
            </label>
          ))}
        </div>

        <h2 className={titleClass}>Bordes</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {RADIUS_IDS.map((id) => (
            <label key={id} className={optionClass(radius === id)}>
              <input type="radio" name="radius" value={id} checked={radius === id} onChange={() => setRadius(id)} className="sr-only" />
              <span className="block w-12 h-8 border-2 border-neutral-900 mb-3" style={{ borderRadius: RADII[id].value }} aria-hidden="true" />
              <div className="text-sm font-medium text-neutral-900">{RADII[id].label}</div>
            </label>
          ))}
        </div>
      </section>

      {/* PANEL ADMIN */}
      <section className={sectionClass}>
        <h2 className={titleClass}>Apariencia de este panel</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {ADMIN_THEME_IDS.map((id) => (
            <label key={id} className={optionClass(adminTheme === id)}>
              <input type="radio" name="adminTheme" value={id} checked={adminTheme === id} onChange={() => setAdminTheme(id)} className="sr-only" />
              <div className="text-sm font-medium text-neutral-900">{ADMIN_THEMES[id].label}</div>
            </label>
          ))}
        </div>
        <p className="text-xs text-neutral-500 mt-4">No cambia nada de la tienda; solo cómo ves vos el admin.</p>
      </section>

      {/* ACCIONES */}
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          name="intent"
          value="save"
          disabled={isPending || (useCustom && !contrastOk)}
          className="px-6 py-3 bg-neutral-900 text-white text-xs uppercase tracking-widest hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Guardando..." : "Guardar apariencia"}
        </button>
        <button
          type="submit"
          name="intent"
          value="reset"
          disabled={isPending}
          onClick={(e) => {
            if (!confirm("¿Volver a la apariencia original de Elizabeth?")) e.preventDefault();
          }}
          className="px-6 py-3 border border-neutral-300 text-xs uppercase tracking-widest text-neutral-700 hover:border-neutral-900 disabled:opacity-50"
        >
          Restablecer
        </button>
        {state.message && (
          <p className={`text-sm ${state.ok ? "text-green-600" : "text-red-600"}`} role={state.ok ? "status" : "alert"}>
            {state.message}
          </p>
        )}
        {state.ok && (
          <a href="/" target="_blank" rel="noopener noreferrer" className="text-sm text-neutral-700 underline">
            Ver la tienda
          </a>
        )}
      </div>
    </form>
  );
}
