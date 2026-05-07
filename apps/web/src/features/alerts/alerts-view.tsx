"use client";

import { AppShell } from "@/components/app-shell";
import { SectionHeader } from "@/components/section-header";
import { StatusPill } from "@/components/status-pill";
import { sites } from "@/features/monitoring/mock-data";
import type { Alert } from "@/features/monitoring/types";
import { useT } from "@/lib/i18n";

export function AlertsView({
  alerts,
}: {
  alerts: Alert[];
}) {
  const t = useT();
  return (
    <AppShell title={t("nav.alerts")}>
      <section className="page-panel">
        <SectionHeader
          title="Active and recent alerts"
          description="Threshold, stale-data, and offline signals for the MVP stations."
        />
        <div className="mt-6 space-y-4">
          {alerts.map((alert) => (
            <article key={alert.id} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{alert.title}</h3>
                  <p className="text-sm text-slate-600">
                    {sites.find((site) => site.id === alert.siteId)?.name ?? alert.siteId}
                  </p>
                </div>
                <StatusPill value={alert.severity} />
              </div>
              <p className="mt-2 text-sm text-slate-600">{alert.message}</p>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
