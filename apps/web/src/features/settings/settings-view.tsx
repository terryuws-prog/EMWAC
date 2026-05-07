"use client";

import { AppShell } from "@/components/app-shell";
import { SectionHeader } from "@/components/section-header";
import { useT } from "@/lib/i18n";

interface SettingsModel {
  refreshWindowMinutes: number;
  thresholds: {
    ph: { min: number; max: number };
    nitrate: { min: number; max: number };
    do: { min: number; max: number };
  };
}

export function SettingsView({
  settings,
}: {
  settings: SettingsModel;
}) {
  const t = useT();
  return (
    <AppShell title={t("nav.settings")}>
      <section className="page-panel">
        <SectionHeader
          title="MVP operational defaults"
          description="Display-only configuration surfaces for refresh cadence and threshold presets."
        />
        <dl className="mt-6 grid gap-3 text-sm text-slate-700">
          <div className="flex justify-between">
            <dt>Refresh window</dt>
            <dd>{settings.refreshWindowMinutes} minutes</dd>
          </div>
          <div className="flex justify-between">
            <dt>pH range</dt>
            <dd>
              {settings.thresholds.ph.min} to {settings.thresholds.ph.max}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt>Nitrate max</dt>
            <dd>{settings.thresholds.nitrate.max} mg/L</dd>
          </div>
          <div className="flex justify-between">
            <dt>DO minimum</dt>
            <dd>{settings.thresholds.do.min} mg/L</dd>
          </div>
        </dl>
      </section>
    </AppShell>
  );
}
