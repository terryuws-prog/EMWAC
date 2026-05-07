import { alerts, algorithmResults, readings, sites } from "./mock-data";
import type {
  AlgorithmResult,
  DashboardModel,
  MetricKey,
  Reading,
  Site,
  SiteDetailModel,
  SiteSummary,
} from "./types";

function latestReadingForSite(siteId: string): Reading {
  return readings
    .filter((reading) => reading.siteId === siteId)
    .sort((left, right) => right.timestamp.localeCompare(left.timestamp))[0];
}

function latestRiskForSite(siteId: string): AlgorithmResult {
  return algorithmResults
    .filter((result) => result.siteId === siteId)
    .sort((left, right) => right.timestamp.localeCompare(left.timestamp))[0];
}

function summarizeSite(site: Site): SiteSummary {
  return {
    id: site.id,
    name: site.name,
    river: site.river,
    region: site.region,
    status: site.status,
    latestReading: latestReadingForSite(site.id),
    latestRisk: latestRiskForSite(site.id),
  };
}

export function getDashboardModel(): DashboardModel {
  const siteSummaries = getSitesModel();

  return {
    summary: {
      totalSites: sites.length,
      healthySites: sites.filter((site) => site.status === "healthy").length,
      warningSites: sites.filter((site) => site.status === "warning" || site.status === "critical").length,
      offlineSites: sites.filter((site) => site.status === "offline").length,
      activeAlerts: alerts.filter((alert) => alert.status === "active").length,
    },
    siteSummaries,
    activeAlerts: alerts.filter((alert) => alert.status === "active"),
    rankedRisks: [...algorithmResults].sort((left, right) => right.riskScore - left.riskScore),
    updatedAt: siteSummaries
      .map((summary) => summary.latestReading.timestamp)
      .sort((left, right) => right.localeCompare(left))[0],
  };
}

export function getSitesModel(): SiteSummary[] {
  return sites
    .map(summarizeSite)
    .sort((left, right) => right.latestRisk.riskScore - left.latestRisk.riskScore);
}

export function getSiteDetailModel(siteId: string): SiteDetailModel | null {
  const site = sites.find((entry) => entry.id === siteId);

  if (!site) {
    return null;
  }

  const history = readings
    .filter((reading) => reading.siteId === siteId)
    .sort((left, right) => left.timestamp.localeCompare(right.timestamp));

  return {
    site,
    history,
    latestReading: history[history.length - 1],
    latestRisk: latestRiskForSite(siteId),
    alerts: alerts.filter((alert) => alert.siteId === siteId),
  };
}

export function getMetricSeries(siteId: string, metric: MetricKey) {
  return readings
    .filter((reading) => reading.siteId === siteId)
    .sort((left, right) => left.timestamp.localeCompare(right.timestamp))
    .map((reading) => ({
      timestamp: reading.timestamp,
      value: reading.metrics[metric],
    }));
}

export function getAnalyticsModel() {
  return {
    sites: getSitesModel(),
    phSeries: sites.map((site) => ({
      siteId: site.id,
      siteName: site.name,
      points: getMetricSeries(site.id, "ph"),
    })),
    nitrateSeries: sites.map((site) => ({
      siteId: site.id,
      siteName: site.name,
      points: getMetricSeries(site.id, "nitrate"),
    })),
  };
}

export function getIntelligenceModel() {
  return {
    rankedRisks: [...algorithmResults].sort((left, right) => right.riskScore - left.riskScore),
    anomalyEvents: algorithmResults.filter((result) => result.anomalyDetected),
  };
}

export function getAlertsModel() {
  return [...alerts].sort((left, right) => right.triggeredAt.localeCompare(left.triggeredAt));
}

export function getReportsModel() {
  return [
    {
      id: "report-001",
      title: "Weekly Site Health Snapshot",
      period: "2026-03-21 to 2026-03-28",
      summary: "Tidal Reach remains the highest priority station due to elevated nitrate and conductivity.",
    },
  ];
}

export function getSettingsModel() {
  return {
    refreshWindowMinutes: 5,
    thresholds: {
      ph: { min: 6.8, max: 7.8 },
      nitrate: { min: 0, max: 4.0 },
      do: { min: 7.0, max: 10.5 },
    },
  };
}
