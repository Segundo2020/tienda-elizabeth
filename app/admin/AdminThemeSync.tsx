"use client";

import { useEffect } from "react";
import type { AdminThemeId } from "@/lib/theme";

/**
 * Aplica la apariencia del panel admin (independiente de la tienda).
 * Al salir del admin restaura la preferencia de la visitante (localStorage 'theme').
 */
export function AdminThemeSync({ mode }: { mode: AdminThemeId }) {
  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const dark = mode === "dark" || (mode === "system" && media.matches);
      root.classList.toggle("dark", dark);
    };
    apply();
    if (mode === "system") media.addEventListener("change", apply);

    return () => {
      media.removeEventListener("change", apply);
      let visitorDark = false;
      try {
        visitorDark = localStorage.getItem("theme") === "dark";
      } catch {}
      root.classList.toggle("dark", visitorDark);
    };
  }, [mode]);

  return null;
}
