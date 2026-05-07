"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Alert, MetricValues, Reading, SiteSummary, DashboardModel } from "./types";
import { sites } from "./mock-data";

// Small random walk around a value, clamped to [min, max]
function drift(value: number, min: number, max: number, step = 0.3): number {
  const next = value + (Math.random() - 0.48) * step; // slight upward bias for drama
  return Math.round(Math.min(max, Math.max(min, next)) * 100) / 100;
}

function simulateMetrics(prev: MetricValues): MetricValues {
  return {
    temp: drift(prev.temp, 8, 22, 0.3),
    ph: drift(prev.ph, 6.2, 8.5, 0.08),
    do: drift(prev.do, 5, 12, 0.2),
    ec: drift(prev.ec, 150, 400, 8),
    nitrate: drift(prev.nitrate, 0.5, 6, 0.15),
    turbidity: drift(prev.turbidity, 1, 35, 1.2),
    tds: drift(prev.tds, 80, 320, 5),
    orp: drift(prev.orp, 180, 480, 6),
    chl_a: drift(prev.chl_a, 0.5, 12, 0.4),
    bod: drift(prev.bod, 0.5, 6, 0.2),
  };
}

function resolveStatus(metrics: MetricValues): "healthy" | "warning" | "critical" {
  const issues: boolean[] = [
    metrics.ph < 6.8 || metrics.ph > 7.8,
    metrics.do < 7.0,
    metrics.nitrate > 4.0,
    metrics.turbidity > 25,
    metrics.bod > 5,
    metrics.ec > 300,
  ];
  const count = issues.filter(Boolean).length;
  if (count >= 3) return "critical";
  if (count >= 1) return "warning";
  return "healthy";
}

function computeRisk(metrics: MetricValues): { score: number; level: "low" | "medium" | "high"; anomaly: boolean; explanation: string } {
  let score = 20;
  const reasons: string[] = [];

  if (metrics.ph < 6.8 || metrics.ph > 7.8) { score += 15; reasons.push("pH out of range"); }
  if (metrics.do < 7.0) { score += 18; reasons.push("low dissolved oxygen"); }
  if (metrics.nitrate > 4.0) { score += 15; reasons.push("elevated nitrate"); }
  if (metrics.turbidity > 25) { score += 12; reasons.push("high turbidity"); }
  if (metrics.bod > 4.5) { score += 10; reasons.push("elevated BOD"); }
  if (metrics.ec > 300) { score += 8; reasons.push("high conductivity"); }
  if (metrics.orp < 250) { score += 7; reasons.push("declining ORP"); }

  score = Math.min(100, Math.round(score + (Math.random() - 0.5) * 6));
  const level = score >= 75 ? "high" : score >= 45 ? "medium" : "low";
  const anomaly = score >= 60;
  const explanation = reasons.length > 0
    ? reasons.slice(0, 3).join(", ") + "."
    : "All metrics within expected range.";

  return { score, level, anomaly, explanation };
}

// Build initial state from mock data
function buildInitialState() {
  const now = new Date();
  const history: Record<string, Reading[]> = {};

  for (const site of sites) {
    const readings: Reading[] = [];
    // Generate 10 historical points
    const baseMetrics: MetricValues = site.id === "site-tidal-reach"
      ? { temp: 15.1, ph: 6.7, do: 6.8, ec: 322, nitrate: 4.6, turbidity: 26.4, tds: 248, orp: 252, chl_a: 8.9, bod: 4.6 }
      : site.id === "site-upland-source"
        ? { temp: 10.5, ph: 7.4, do: 9.5, ec: 188, nitrate: 1.2, turbidity: 3.9, tds: 119, orp: 402, chl_a: 1.3, bod: 1.0 }
        : { temp: 14.2, ph: 7.3, do: 8.4, ec: 251, nitrate: 2.3, turbidity: 10.5, tds: 164, orp: 330, chl_a: 3.8, bod: 2.1 };

    let metrics = { ...baseMetrics };
    for (let i = 9; i >= 0; i--) {
      const t = new Date(now.getTime() - i * 3000);
      metrics = simulateMetrics(metrics);
      readings.push({
        id: `${site.id}-${i}`,
        siteId: site.id,
        timestamp: t.toISOString(),
        metrics: { ...metrics },
        qualityFlag: Math.random() > 0.9 ? "suspect" : "good",
      });
    }
    history[site.id] = readings;
  }

  return history;
}

export function useLiveData(): { model: DashboardModel; tick: number } {
  const historyRef = useRef(buildInitialState());
  const [tick, setTick] = useState(0);

  const step = useCallback(() => {
    const now = new Date();
    const history = historyRef.current;

    for (const site of sites) {
      const readings = history[site.id];
      const lastMetrics = readings[readings.length - 1].metrics;
      const newMetrics = simulateMetrics(lastMetrics);

      readings.push({
        id: `${site.id}-${now.getTime()}`,
        siteId: site.id,
        timestamp: now.toISOString(),
        metrics: newMetrics,
        qualityFlag: Math.random() > 0.92 ? "suspect" : "good",
      });

      // Keep last 20 readings
      if (readings.length > 20) readings.shift();
    }

    setTick((t) => t + 1);
  }, []);

  useEffect(() => {
    const id = setInterval(step, 3000);
    return () => clearInterval(id);
  }, [step]);

  // Build model from current state
  const history = historyRef.current;
  const siteSummaries: SiteSummary[] = sites.map((site) => {
    const readings = history[site.id];
    const latest = readings[readings.length - 1];
    const status: "healthy" | "warning" | "critical" | "offline" =
      site.id === "site-upland-source" && Math.random() > 0.7
        ? "offline"
        : resolveStatus(latest.metrics);
    const risk = computeRisk(latest.metrics);

    return {
      id: site.id,
      name: site.name,
      river: site.river,
      region: site.region,
      status,
      latestReading: latest,
      latestRisk: {
        id: `risk-${site.id}`,
        siteId: site.id,
        timestamp: latest.timestamp,
        riskScore: risk.score,
        riskLevel: risk.level,
        anomalyDetected: risk.anomaly,
        explanation: risk.explanation,
        confidence: 0.7 + Math.random() * 0.25,
      },
    };
  }).sort((a, b) => b.latestRisk.riskScore - a.latestRisk.riskScore);

  const activeAlerts: Alert[] = siteSummaries
    .filter((s) => s.status === "critical" || s.status === "warning")
    .flatMap((s) => {
      const alerts: Alert[] = [];
      const m = s.latestReading.metrics;
      if (m.nitrate > 4.0) alerts.push({ id: `alert-nit-${s.id}`, siteId: s.id, severity: "high", type: "threshold", title: "Nitrate above threshold", message: `Nitrate at ${m.nitrate} mg/L exceeds 4.0 limit.`, status: "active", triggeredAt: s.latestReading.timestamp });
      if (m.turbidity > 25) alerts.push({ id: `alert-turb-${s.id}`, siteId: s.id, severity: "high", type: "threshold", title: "Turbidity exceeds safe limit", message: `Turbidity at ${m.turbidity} NTU exceeds 25 NTU threshold.`, status: "active", triggeredAt: s.latestReading.timestamp });
      if (m.do < 7.0) alerts.push({ id: `alert-do-${s.id}`, siteId: s.id, severity: "medium", type: "threshold", title: "Low dissolved oxygen", message: `DO at ${m.do} mg/L is below 7.0 minimum.`, status: "active", triggeredAt: s.latestReading.timestamp });
      return alerts;
    });

  const rankedRisks = siteSummaries.map((s) => s.latestRisk).sort((a, b) => b.riskScore - a.riskScore);

  const model: DashboardModel = {
    summary: {
      totalSites: sites.length,
      healthySites: siteSummaries.filter((s) => s.status === "healthy").length,
      warningSites: siteSummaries.filter((s) => s.status === "warning" || s.status === "critical").length,
      offlineSites: siteSummaries.filter((s) => s.status === "offline").length,
      activeAlerts: activeAlerts.length,
    },
    siteSummaries,
    activeAlerts,
    rankedRisks,
    updatedAt: new Date().toISOString(),
  };

  // Attach history for charts
  (model as DashboardModel & { history: Record<string, Reading[]> }).history = history;

  return { model, tick };
}
