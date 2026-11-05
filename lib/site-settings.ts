import { cache } from "react";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";
import { DEFAULT_SETTINGS, sanitizeSettings, type SiteSettings } from "@/lib/theme";

/**
 * Lee la apariencia (1 query por request, deduplicada con cache()).
 * Si la DB falla o la tabla todavía no existe, devuelve el tema por defecto:
 * la tienda nunca se cae por la apariencia.
 */
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  try {
    const row = await db.query.siteSettings.findFirst({ where: eq(siteSettings.id, 1) });
    return sanitizeSettings(row);
  } catch (err) {
    console.error("[site-settings] usando tema por defecto:", (err as Error).message);
    return DEFAULT_SETTINGS;
  }
});
