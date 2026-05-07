"use client";

import { useState } from "react";
import Link from "next/link";
import { SectionHeader } from "@/components/section-header";
import { StatCard } from "@/components/stat-card";
import { StatusPill } from "@/components/status-pill";
import { formatTimestamp } from "@/lib/formatters";
import { useT } from "@/lib/i18n";
import { METRIC_META, type DashboardModel, type MetricKey, type Reading, type SiteSummary } from "@/features/monitoring/types";
import { AppShell } from "@/components/app-shell";
import { SiteMap } from "@/features/map/site-map";
import { MultiSiteChart } from "@/features/charts/multi-site-chart";
import { getMetricSeries } from "@/features/monitoring/repository";

interface DashboardProps extends DashboardModel {
  history?: Record<string, Reading[]>;
}

const ALL_METRICS = Object.keys(METRIC_META) as MetricKey[];

/* -- Threshold cell color -- */
function cellColor(key: MetricKey, val: number) {
  const { min, max } = METRIC_META[key];
  if (val < min || val > max) return "bg-rose-50 text-rose-800 font-semibold";
  const range = max - min;
  if (range > 0 && (val > max - range * 0.15 || val < min + range * 0.15)) return "bg-amber-50 text-amber-800";
  return "";
}

/* -- Single reading table row -- */
function ReadingRow({ site }: { site: SiteSummary }) {
  const m = site.latestReading.metrics;
  return (
    <tr className="border-b border-slate-100 text-sm hover:bg-slate-50/60">
      <td className="sticky left-0 bg-white py-2.5 pr-3 z-10">
        <Link href={`/sites/${site.id}`} className="font-medium text-teal-700 hover:underline">{site.name}</Link>
        <p className="text-[11px] text-slate-400">{site.river}</p>
      </td>
      <td className="py-2.5 px-2"><StatusPill value={site.status} /></td>
      {ALL_METRICS.map((key) => (
        <td key={key} className={`py-2.5 px-2 text-center whitespace-nowrap rounded ${cellColor(key, m[key])}`}>
          {m[key]}
        </td>
      ))}
      <td className="py-2.5 px-2 text-center">
        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-bold ${
          site.latestRisk.riskScore >= 75 ? "bg-rose-100 text-rose-800" :
          site.latestRisk.riskScore >= 50 ? "bg-amber-100 text-amber-800" :
          "bg-emerald-100 text-emerald-800"
        }`}>{site.latestRisk.riskScore}</span>
      </td>
      <td className="py-2.5 px-2 text-xs text-slate-400 whitespace-nowrap">{site.latestReading.timestamp.slice(11, 16)}</td>
    </tr>
  );
}

/* -- Chart group keys for translation -- */
const CHART_GROUP_KEYS = [
  { labelKey: "chart.waterChemistry", metrics: ["ph", "do", "ec", "orp"] as MetricKey[] },
  { labelKey: "chart.nutrientsOrganic", metrics: ["nitrate", "bod", "chl_a"] as MetricKey[] },
  { labelKey: "chart.physical", metrics: ["temp", "turbidity", "tds"] as MetricKey[] },
];

/* ====================================== */

export function DashboardView({
  summary,
  siteSummaries,
  updatedAt,
  history,
}: DashboardProps) {
  const [chartGroup, setChartGroup] = useState(0);
  const activeMetrics = CHART_GROUP_KEYS[chartGroup].metrics;
  const t = useT();

  // Build chart series from live history or fall back to static repo
  function getChartSeries(siteId: string, metric: MetricKey) {
    if (history?.[siteId]) {
      return history[siteId].map((r) => ({ timestamp: r.timestamp, value: r.metrics[metric] }));
    }
    return getMetricSeries(siteId, metric);
  }

  return (
    <AppShell title={t("nav.dashboard")}>
      <div className="page-grid">

        {/* -- Row 1: Live banner -- */}
        <div className="flex items-center justify-between rounded-xl border border-teal-200 bg-teal-50 px-5 py-3">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-500 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-teal-600" />
            </span>
            <span className="text-sm font-medium text-teal-800">
              {t("live.realTimeMonitoring")} — {t("live.sensorsPerStation")}
            </span>
          </div>
          <span className="text-sm text-teal-600">
            {t("live.lastUpdate")}: {formatTimestamp(updatedAt)}
          </span>
        </div>

        {/* -- Row 2: KPI cards -- */}
        <section className="grid gap-3 grid-cols-2 md:grid-cols-5">
          <StatCard label={t("kpi.totalSites")} value={summary.totalSites} helper={t("kpi.helper.monitoringStations")} />
          <StatCard label={t("kpi.healthy")} value={summary.healthySites} helper={t("kpi.helper.allMetricsNormal")} />
          <StatCard label={t("kpi.warning")} value={summary.warningSites} helper={t("kpi.helper.needsAttention")} />
          <StatCard label={t("kpi.offline")} value={summary.offlineSites} helper={t("kpi.helper.noDataReceived")} />
          <StatCard label={t("kpi.activeAlerts")} value={summary.activeAlerts} helper={t("kpi.helper.unresolved")} />
        </section>

        {/* -- Row 3: Map + Site status overview -- */}
        <section className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
          <div className="page-panel">
            <SectionHeader title={t("section.networkMap")} description={t("desc.clickMarkers")} />
            <div className="mt-4"><SiteMap sites={siteSummaries} /></div>
          </div>

          <div className="page-panel">
            <SectionHeader title={t("section.siteOverview")} description={t("desc.currentStatus")} />
            <div className="mt-4 space-y-3">
              {siteSummaries.map((site) => (
                <Link href={`/sites/${site.id}`} key={site.id}
                  className="flex items-center justify-between rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50">
                  <div>
                    <h3 className="font-semibold">{site.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">{site.river} · {site.region}</p>
                  </div>
                  <StatusPill value={site.status} />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* -- Row 4: Full readings table -- */}
        <section className="page-panel">
          <SectionHeader
            title={`${t("section.latestReadings")} — ${t("live.sensorsPerStation")}`}
            description={t("desc.latestReadings")}
          />
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead>
                <tr className="border-b-2 border-slate-200 text-[11px] uppercase tracking-wider text-slate-500">
                  <th className="sticky left-0 bg-white py-2 pr-3 z-10">{t("table.site")}</th>
                  <th className="py-2 px-2">{t("table.status")}</th>
                  {ALL_METRICS.map((key) => (
                    <th key={key} className="py-2 px-2 text-center whitespace-nowrap">
                      {METRIC_META[key].label}
                      {METRIC_META[key].unit && <span className="block font-normal text-slate-400">{METRIC_META[key].unit}</span>}
                    </th>
                  ))}
                  <th className="py-2 px-2 text-center">{t("table.risk")}</th>
                  <th className="py-2 px-2 text-center">{t("table.time")}</th>
                </tr>
              </thead>
              <tbody>
                {siteSummaries.map((site) => <ReadingRow key={site.id} site={site} />)}
              </tbody>
            </table>
          </div>
        </section>

        {/* -- Row 5: Trend charts -- */}
        <section className="page-panel">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <SectionHeader title={t("section.sensorTrends")} description={t("desc.chartOverlay")} />
            <div className="flex gap-2">
              {CHART_GROUP_KEYS.map((g, i) => (
                <button key={g.labelKey} type="button"
                  className={`rounded-full px-4 py-2 text-sm transition ${i === chartGroup ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                  onClick={() => setChartGroup(i)}
                >
                  {t(g.labelKey)}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {activeMetrics.map((metric) => (
              <div key={metric} className="rounded-xl border border-slate-200 p-4">
                <h3 className="mb-1 text-sm font-semibold text-slate-700">
                  {METRIC_META[metric].label}
                  {METRIC_META[metric].unit && <span className="ml-1 font-normal text-slate-400">({METRIC_META[metric].unit})</span>}
                </h3>
                <MultiSiteChart
                  title={METRIC_META[metric].label}
                  unit={METRIC_META[metric].unit}
                  range={[METRIC_META[metric].min, METRIC_META[metric].max]}
                  series={siteSummaries.map((site) => ({
                    siteName: site.name,
                    points: getChartSeries(site.id, metric),
                  }))}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Bottom spacer */}

      </div>
    </AppShell>
  );
}
