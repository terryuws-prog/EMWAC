"use client";

import { AppShell } from "@/components/app-shell";
import { SectionHeader } from "@/components/section-header";
import { StatusPill } from "@/components/status-pill";
import { sites } from "@/features/monitoring/mock-data";
import type { AlgorithmResult } from "@/features/monitoring/types";
import { useT } from "@/lib/i18n";

interface IntelligenceModel {
  rankedRisks: AlgorithmResult[];
  anomalyEvents: AlgorithmResult[];
}

export function IntelligenceView({
  model,
}: {
  model: IntelligenceModel;
}) {
  const t = useT();
  return (
    <AppShell title={t("nav.intelligence")}>
      <div className="page-grid xl:grid-cols-[1.1fr_0.9fr]">
        <section className="page-panel">
          <SectionHeader
            title="Ranked risk overview"
            description="Review current model output ordered by risk score."
          />
          <div className="mt-6 space-y-4">
            {model.rankedRisks.map((item) => {
              const site = sites.find((entry) => entry.id === item.siteId);

              return (
                <article key={item.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{site?.name ?? item.siteId}</h3>
                      <p className="text-sm text-slate-600">{item.explanation}</p>
                    </div>
                    <StatusPill value={item.riskLevel} />
                  </div>
                  <p className="mt-3 text-sm font-medium text-slate-700">Risk score {item.riskScore}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="page-panel">
          <SectionHeader
            title="Anomaly events"
            description="Events currently flagged by the rules-and-score layer."
          />
          <div className="mt-6 space-y-4">
            {model.anomalyEvents.map((event) => (
              <article key={event.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{sites.find((entry) => entry.id === event.siteId)?.name ?? event.siteId}</h3>
                  <StatusPill value={event.riskLevel} />
                </div>
                <p className="mt-2 text-sm text-slate-600">{event.explanation}</p>
                <p className="mt-2 text-sm text-slate-500">Confidence {Math.round(event.confidence * 100)}%</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
