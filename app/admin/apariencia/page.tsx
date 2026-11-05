export const dynamic = "force-dynamic";

import { getSiteSettings } from "@/lib/site-settings";
import { AppearanceForm } from "./AppearanceForm";

export default async function AparienciaPage() {
  const settings = await getSiteSettings();

  return (
    <div className="max-w-4xl">
      <div className="mb-10">
        <h1 className="text-3xl font-light text-neutral-900">Apariencia</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Elegí cómo se ve la tienda para tus clientas y cómo se ve este panel.
        </p>
      </div>
      <AppearanceForm initial={settings} />
    </div>
  );
}
