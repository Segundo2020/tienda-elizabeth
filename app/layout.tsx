import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { ThemeToggle } from "./components/ThemeToggle";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Elizabeth | Catálogo",
  description: "Catálogo de ropa Elizabeth",
};

const themeScript = `
try {
  const t = localStorage.getItem('theme');
  const sys = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (t === 'dark' || (!t && sys)) {
    document.documentElement.classList.add('dark');
  }
} catch (e) {}
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={geist.className}>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {children}
        <ThemeToggle />
      </body>
    </html>
  );
}
