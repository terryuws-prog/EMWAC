"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { SectionHeader } from "@/components/section-header";
import { MetricLineChart } from "@/features/charts/metric-line-chart";
import { useT } from "@/lib/i18n";

interface SeriesEntry {
  siteId: string;
  siteName: string;
  points: Array<{ timestamp: string; value: number }>;
}

interface AnalyticsModel {
  phSeries: SeriesEntry[];
  nitrateSeries: SeriesEntry[];
}

export function AnalyticsView({
  model,
}: {
  model: AnalyticsModel;
}) {
  const [mode, setMode] = useState<"ph" | "nitrate">("ph");
  const series = mode === "ph" ? model.phSeries : model.nitrateSeries;
  const t = useT();

  return (
    <AppShell title={t("nav.analytics")}>
      <div className="page-grid">
        <section className="page-panel">
          <SectionHeader
            title="Multi-site trend comparison"
            description="Switch between pH and nitrate to compare the current mock telemetry set."
          />

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              className={`rounded-full px-4 py-2 text-sm ${mode === "ph" ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-700"}`}
              onClick={() => setMode("ph")}
            >
              pH
            </button>
            <button
              type="button"
              className={`rounded-full px-4 py-2 text-sm ${mode === "nitrate" ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-700"}`}
              onClick={() => setMode("nitrate")}
            >
              Nitrate
            </button>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-2">
            {series.map((entry) => (
              <div key={entry.siteId} className="rounded-2xl border border-slate-200 p-4">
                <h3 className="text-lg font-semibold">{entry.siteName}</h3>
                <MetricLineChart title={`${entry.siteName} ${mode}`} series={entry.points} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
