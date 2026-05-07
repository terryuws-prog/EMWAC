import { AppShell } from "@/components/app-shell";
import { SectionHeader } from "@/components/section-header";
import { StatCard } from "@/components/stat-card";
import { StatusPill } from "@/components/status-pill";
import { MetricLineChart } from "@/features/charts/metric-line-chart";
import { getMetricSeries } from "@/features/monitoring/repository";
import { METRIC_META, type MetricKey, type SiteDetailModel } from "@/features/monitoring/types";

const ALL_METRICS = Object.keys(METRIC_META) as MetricKey[];

export function SiteDetailView({
  detail,
}: {
  detail: SiteDetailModel;
}) {
  const m = detail.latestReading.metrics;

  return (
    <AppShell title={detail.site.name}>
      <div className="page-grid">
        {/* All 10 metric cards */}
        <section className="grid gap-3 grid-cols-2 md:grid-cols-5 xl:grid-cols-10">
          {ALL_METRICS.map((key) => (
            <StatCard
              key={key}
              label={METRIC_META[key].label}
              value={m[key]}
              helper={METRIC_META[key].unit || "—"}
            />
          ))}
        </section>

        {/* Risk score card */}
        <section className="grid gap-4 md:grid-cols-2">
          <StatCard label="Risk score" value={detail.latestRisk.riskScore} helper={detail.latestRisk.explanation} />
          <StatCard label="Data quality" value={detail.latestReading.qualityFlag} helper={`Timestamp: ${detail.latestReading.timestamp.slice(0, 16).replace("T", " ")}`} />
        </section>

        {/* Trend charts — 5 per row */}
        <section className="page-panel">
          <SectionHeader title="Trend review" description="All 10 sensor metrics over recent readings." />
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {ALL_METRICS.map((key) => (
              <div key={key} className="rounded-xl border border-slate-200 p-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                  {METRIC_META[key].label}
                  {METRIC_META[key].unit && <span className="ml-1 font-normal text-slate-400">({METRIC_META[key].unit})</span>}
                </h3>
                <MetricLineChart title={METRIC_META[key].label} series={getMetricSeries(detail.site.id, key)} />
              </div>
            ))}
          </div>
        </section>

        {/* Context + Alerts */}
        <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <div className="page-panel">
            <SectionHeader title="Live context" description="Operational metadata and explainable intelligence." />
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Current status</p>
                  <p className="font-semibold">{detail.site.river} · {detail.site.region}</p>
                </div>
                <StatusPill value={detail.site.status} />
              </div>
              <article className="rounded-2xl border border-slate-200 p-4">
                <p className="text-sm text-slate-500">Algorithm summary</p>
                <p className="mt-2 text-sm text-slate-700">{detail.latestRisk.explanation}</p>
                <div className="mt-3 h-2 w-full rounded-full bg-slate-100">
                  <div className={`h-2 rounded-full ${
                    detail.latestRisk.riskLevel === "high" ? "bg-rose-500" :
                    detail.latestRisk.riskLevel === "medium" ? "bg-amber-500" : "bg-emerald-500"
                  }`} style={{ width: `${detail.latestRisk.riskScore}%` }} />
                </div>
              </article>
            </div>
          </div>

          <div className="page-panel">
            <SectionHeader title="Alerts" />
            <div className="mt-6 space-y-3">
              {detail.alerts.length === 0 ? (
                <p className="text-sm text-slate-500">No active alerts for this station.</p>
              ) : detail.alerts.map((alert) => (
                <article key={alert.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{alert.title}</h3>
                    <StatusPill value={alert.severity} />
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{alert.message}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
