import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Playfair_Display, Montserrat, Cormorant_Garamond, Lora } from "next/font/google";
import { ThemeToggle } from "@/app/components/ThemeToggle";
import { getSiteSettings } from "@/lib/site-settings";
import { THEMES_CSS, RADII, customColorsCss } from "@/lib/theme";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", weight: ["300", "400", "500", "600"], display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", weight: ["400", "500", "600", "700"], style: ["normal", "italic"], display: "swap" });
// Fuentes alternativas: preload false → el navegador solo las descarga si el tema las usa
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", weight: ["400", "500", "600"], style: ["normal", "italic"], display: "swap", preload: false });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], variable: "--font-cormorant", weight: ["400", "500", "600", "700"], style: ["normal", "italic"], display: "swap", preload: false });
const lora = Lora({ subsets: ["latin"], variable: "--font-lora", weight: ["400", "500", "600"], style: ["normal", "italic"], display: "swap", preload: false });

// La apariencia sale de la DB: todas las páginas se renderizan por request
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Elizabeth — Ropa Femenina",
  description: "Ropa femenina con estilo y calidad. Desde Río Gallegos, Santa Cruz. Atención personalizada por WhatsApp.",
};

const themeScript = `
try {
  if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.classList.add('dark');
  }
} catch (e) {}
`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  const fontVars = [inter, playfair, montserrat, cormorant, lora].map((f) => f.variable).join(" ");
  const css = `${THEMES_CSS}${customColorsCss(settings)}:root{--eliz-radius:${RADII[settings.radius].value}}`;

  return (
    <html
      lang="es"
      suppressHydrationWarning
      data-theme={settings.theme}
      data-font={settings.fontPair}
      className={fontVars}
    >
      <head>
        {/* Valores validados en lib/theme.ts (enums y hex #rrggbb), sin texto libre */}
        <style id="eliz-theme" dangerouslySetInnerHTML={{ __html: css }} />
      </head>
      <body>
        <Script id="theme-init" strategy="beforeInteractive">
          {themeScript}
        </Script>
        {children}
        <ThemeToggle />
      </body>
    </html>
  );
}
