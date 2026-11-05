// Sistema de apariencia: fuente única de verdad para temas, fuentes y formas.
// Se usa en el servidor (layout, server action) y en el cliente (formulario admin).

export const THEME_IDS = ["calido", "noche", "minimal", "rosa", "salvia"] as const;
export const FONT_PAIR_IDS = ["elegante", "moderno", "clasico"] as const;
export const RADIUS_IDS = ["recto", "suave", "redondeado"] as const;
export const ADMIN_THEME_IDS = ["light", "dark", "system"] as const;

export type ThemeId = (typeof THEME_IDS)[number];
export type FontPairId = (typeof FONT_PAIR_IDS)[number];
export type RadiusId = (typeof RADIUS_IDS)[number];
export type AdminThemeId = (typeof ADMIN_THEME_IDS)[number];

export type Palette = {
  bg: string; bgWarm: string; text: string; muted: string;
  accent: string; accentHover: string; onAccent: string;
  border: string; card: string; success: string;
};

export type SiteSettings = {
  theme: ThemeId;
  accent: string | null;
  bg: string | null;
  textColor: string | null;
  fontPair: FontPairId;
  radius: RadiusId;
  adminTheme: AdminThemeId;
};

export const DEFAULT_SETTINGS: SiteSettings = {
  theme: "calido",
  accent: null,
  bg: null,
  textColor: null,
  fontPair: "elegante",
  radius: "recto",
  adminTheme: "light",
};

export const THEMES: Record<ThemeId, { label: string; description: string; light: Palette; dark: Palette }> = {
  calido: {
    label: "Cálido",
    description: "Crema y dorado. El diseño original de Elizabeth.",
    light: { bg: "#faf9f7", bgWarm: "#f5f0eb", text: "#1a1a1a", muted: "#6b6560", accent: "#8b6914", accentHover: "#6b5010", onAccent: "#ffffff", border: "#e8e3de", card: "#ffffff", success: "#2d6a4f" },
    dark: { bg: "#171717", bgWarm: "#1f1f1f", text: "#fafafa", muted: "#a3a3a3", accent: "#c9a23f", accentHover: "#e0bb5c", onAccent: "#1a1a1a", border: "#333333", card: "#262626", success: "#52b788" },
  },
  noche: {
    label: "Noche",
    description: "Fondo oscuro con detalles dorados. Siempre oscuro.",
    light: { bg: "#121110", bgWarm: "#1c1a17", text: "#f3efe8", muted: "#a69f94", accent: "#d4af37", accentHover: "#e6c35c", onAccent: "#121110", border: "#2e2a25", card: "#1c1a17", success: "#74c69d" },
    dark: { bg: "#121110", bgWarm: "#1c1a17", text: "#f3efe8", muted: "#a69f94", accent: "#d4af37", accentHover: "#e6c35c", onAccent: "#121110", border: "#2e2a25", card: "#1c1a17", success: "#74c69d" },
  },
  minimal: {
    label: "Minimal",
    description: "Blanco y negro, sin color. Deja todo el protagonismo a las fotos.",
    light: { bg: "#ffffff", bgWarm: "#f4f4f4", text: "#111111", muted: "#666666", accent: "#111111", accentHover: "#333333", onAccent: "#ffffff", border: "#e5e5e5", card: "#ffffff", success: "#2d6a4f" },
    dark: { bg: "#0f0f0f", bgWarm: "#1a1a1a", text: "#f5f5f5", muted: "#a3a3a3", accent: "#f5f5f5", accentHover: "#d4d4d4", onAccent: "#111111", border: "#2a2a2a", card: "#1a1a1a", success: "#52b788" },
  },
  rosa: {
    label: "Rosa empolvado",
    description: "Rosados suaves con acento frambuesa.",
    light: { bg: "#fdf8f8", bgWarm: "#f8eeee", text: "#2b1d22", muted: "#7a6168", accent: "#a8456b", accentHover: "#8a3456", onAccent: "#ffffff", border: "#efdfe2", card: "#ffffff", success: "#2d6a4f" },
    dark: { bg: "#1a1416", bgWarm: "#241b1e", text: "#f8eef1", muted: "#b59ca4", accent: "#e38aab", accentHover: "#f0a8c2", onAccent: "#1a1416", border: "#3a2c31", card: "#241b1e", success: "#74c69d" },
  },
  salvia: {
    label: "Salvia",
    description: "Verdes naturales y tonos tierra.",
    light: { bg: "#f7f8f5", bgWarm: "#eef1ea", text: "#1f2a22", muted: "#5f6b62", accent: "#4a6b52", accentHover: "#3a5541", onAccent: "#ffffff", border: "#dfe5dc", card: "#ffffff", success: "#2d6a4f" },
    dark: { bg: "#141815", bgWarm: "#1c221d", text: "#eef2ec", muted: "#9faba2", accent: "#8fb89a", accentHover: "#a8cbb1", onAccent: "#141815", border: "#2c352e", card: "#1c221d", success: "#74c69d" },
  },
};

export const FONT_PAIRS: Record<FontPairId, { label: string; description: string }> = {
  elegante: { label: "Elegante", description: "Títulos Playfair Display, texto Inter." },
  moderno: { label: "Moderno", description: "Títulos Montserrat, texto Inter." },
  clasico: { label: "Clásico", description: "Títulos Cormorant Garamond, texto Lora." },
};

export const RADII: Record<RadiusId, { label: string; value: string }> = {
  recto: { label: "Rectos", value: "0px" },
  suave: { label: "Suaves", value: "6px" },
  redondeado: { label: "Redondeados", value: "14px" },
};

export const ADMIN_THEMES: Record<AdminThemeId, { label: string }> = {
  light: { label: "Claro" },
  dark: { label: "Oscuro" },
  system: { label: "Según el dispositivo" },
};

// ---------- Validación ----------
const HEX_RE = /^#[0-9a-f]{6}$/;

export function normalizeHex(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim().toLowerCase();
  return HEX_RE.test(s) ? s : null;
}

export function isOneOf<T extends readonly string[]>(list: T, v: unknown): v is T[number] {
  return typeof v === "string" && (list as readonly string[]).includes(v);
}

/** Normaliza datos que vienen de la DB: cualquier valor inválido vuelve al default. */
export function sanitizeSettings(raw: Partial<Record<keyof SiteSettings, unknown>> | null | undefined): SiteSettings {
  if (!raw) return DEFAULT_SETTINGS;
  return {
    theme: isOneOf(THEME_IDS, raw.theme) ? raw.theme : DEFAULT_SETTINGS.theme,
    accent: normalizeHex(raw.accent),
    bg: normalizeHex(raw.bg),
    textColor: normalizeHex(raw.textColor),
    fontPair: isOneOf(FONT_PAIR_IDS, raw.fontPair) ? raw.fontPair : DEFAULT_SETTINGS.fontPair,
    radius: isOneOf(RADIUS_IDS, raw.radius) ? raw.radius : DEFAULT_SETTINGS.radius,
    adminTheme: isOneOf(ADMIN_THEME_IDS, raw.adminTheme) ? raw.adminTheme : DEFAULT_SETTINGS.adminTheme,
  };
}

// ---------- Contraste (WCAG 2.x) ----------
function luminance(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
}

export function contrastRatio(a: string, b: string): number {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

/** Blanco o casi negro, el que mejor se lea sobre el color dado. */
export function readableOn(hex: string): string {
  return contrastRatio(hex, "#ffffff") >= contrastRatio(hex, "#1a1a1a") ? "#ffffff" : "#1a1a1a";
}

export const MIN_TEXT_CONTRAST = 4.5;

// ---------- CSS ----------
function vars(p: Palette): string {
  return [
    `--eliz-bg:${p.bg}`, `--eliz-bg-warm:${p.bgWarm}`, `--eliz-text:${p.text}`, `--eliz-muted:${p.muted}`,
    `--eliz-accent:${p.accent}`, `--eliz-accent-hover:${p.accentHover}`, `--eliz-on-accent:${p.onAccent}`,
    `--eliz-border:${p.border}`, `--eliz-card:${p.card}`, `--eliz-success:${p.success}`,
  ].join(";");
}

/** CSS de todos los temas. Estático: solo usa valores definidos en este archivo. */
export const THEMES_CSS = THEME_IDS.map(
  (id) =>
    `html[data-theme="${id}"]{${vars(THEMES[id].light)}}` +
    `html[data-theme="${id}"].dark{${vars(THEMES[id].dark)}}`
).join("");

/**
 * CSS de colores personalizados. SOLO interpola valores que pasaron normalizeHex
 * (formato #rrggbb), así que no es posible inyectar CSS.
 */
export function customColorsCss(s: SiteSettings): string {
  const accent = normalizeHex(s.accent);
  const bg = normalizeHex(s.bg);
  const text = normalizeHex(s.textColor);
  let css = "";

  if (accent) {
    const hover = `color-mix(in srgb, ${accent} 80%, #000)`;
    css += `html[data-theme],html[data-theme].dark{--eliz-accent:${accent};--eliz-accent-hover:${hover};--eliz-on-accent:${readableOn(accent)}}`;
  }
  // Fondo y texto personalizados aplican al modo claro; el modo oscuro usa la paleta del tema.
  const light: string[] = [];
  if (bg) light.push(`--eliz-bg:${bg}`, `--eliz-bg-warm:color-mix(in srgb, ${bg} 94%, #8a7a6a)`);
  if (text) light.push(`--eliz-text:${text}`, `--eliz-muted:color-mix(in srgb, ${text} 62%, ${bg ?? "#ffffff"})`);
  if (light.length) css += `html[data-theme]:not(.dark){${light.join(";")}}`;

  return css;
}
