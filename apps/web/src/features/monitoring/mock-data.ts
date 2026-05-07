import type { Alert, AlgorithmResult, Reading, Site } from "./types";

export const sites: Site[] = [
  {
    id: "site-black-covert",
    name: "Black Covert",
    code: "BC01",
    river: "Ystwyth",
    region: "Aberystwyth",
    status: "warning",
    latitude: 52.3339,
    longitude: -3.9531,
    lastSeenAt: "2026-03-28T12:00:00Z",
  },
  {
    id: "site-tidal-reach",
    name: "Tidal Reach",
    code: "TR02",
    river: "Rheidol",
    region: "Aberystwyth",
    status: "critical",
    latitude: 52.4152,
    longitude: -4.0821,
    lastSeenAt: "2026-03-28T11:58:00Z",
  },
  {
    id: "site-upland-source",
    name: "Upland Source",
    code: "US03",
    river: "Clarach",
    region: "Ceredigion",
    status: "offline",
    latitude: 52.4555,
    longitude: -4.0604,
    lastSeenAt: "2026-03-28T10:42:00Z",
  },
];

export const readings: Reading[] = [
  // Black Covert — 3 readings
  {
    id: "r1", siteId: "site-black-covert", timestamp: "2026-03-28T10:00:00Z", qualityFlag: "good",
    metrics: { temp: 13.7, ph: 7.1, do: 8.9, ec: 238, nitrate: 2.0, turbidity: 8.2, tds: 155, orp: 345, chl_a: 3.1, bod: 1.8 },
  },
  {
    id: "r2", siteId: "site-black-covert", timestamp: "2026-03-28T11:00:00Z", qualityFlag: "good",
    metrics: { temp: 13.9, ph: 7.2, do: 8.7, ec: 241, nitrate: 2.1, turbidity: 9.0, tds: 158, orp: 338, chl_a: 3.4, bod: 1.9 },
  },
  {
    id: "r3", siteId: "site-black-covert", timestamp: "2026-03-28T12:00:00Z", qualityFlag: "good",
    metrics: { temp: 14.2, ph: 7.3, do: 8.4, ec: 251, nitrate: 2.3, turbidity: 10.5, tds: 164, orp: 330, chl_a: 3.8, bod: 2.1 },
  },
  // Tidal Reach — 3 readings
  {
    id: "r4", siteId: "site-tidal-reach", timestamp: "2026-03-28T10:00:00Z", qualityFlag: "good",
    metrics: { temp: 14.6, ph: 7.0, do: 7.8, ec: 280, nitrate: 3.8, turbidity: 18.3, tds: 210, orp: 285, chl_a: 6.2, bod: 3.5 },
  },
  {
    id: "r5", siteId: "site-tidal-reach", timestamp: "2026-03-28T11:00:00Z", qualityFlag: "suspect",
    metrics: { temp: 14.8, ph: 6.8, do: 7.1, ec: 305, nitrate: 4.2, turbidity: 22.1, tds: 235, orp: 268, chl_a: 7.5, bod: 4.0 },
  },
  {
    id: "r6", siteId: "site-tidal-reach", timestamp: "2026-03-28T11:58:00Z", qualityFlag: "suspect",
    metrics: { temp: 15.1, ph: 6.7, do: 6.8, ec: 322, nitrate: 4.6, turbidity: 26.4, tds: 248, orp: 252, chl_a: 8.9, bod: 4.6 },
  },
  // Upland Source — 3 readings
  {
    id: "r7", siteId: "site-upland-source", timestamp: "2026-03-28T08:00:00Z", qualityFlag: "good",
    metrics: { temp: 10.4, ph: 7.5, do: 9.6, ec: 190, nitrate: 1.1, turbidity: 3.5, tds: 120, orp: 410, chl_a: 1.2, bod: 0.9 },
  },
  {
    id: "r8", siteId: "site-upland-source", timestamp: "2026-03-28T09:00:00Z", qualityFlag: "good",
    metrics: { temp: 10.5, ph: 7.4, do: 9.5, ec: 188, nitrate: 1.2, turbidity: 3.8, tds: 118, orp: 405, chl_a: 1.3, bod: 0.9 },
  },
  {
    id: "r9", siteId: "site-upland-source", timestamp: "2026-03-28T10:42:00Z", qualityFlag: "missing",
    metrics: { temp: 10.5, ph: 7.4, do: 9.5, ec: 188, nitrate: 1.2, turbidity: 3.9, tds: 119, orp: 402, chl_a: 1.3, bod: 1.0 },
  },
];

export const alerts: Alert[] = [
  {
    id: "a1",
    siteId: "site-tidal-reach",
    severity: "high",
    type: "threshold",
    title: "Nitrate above operational threshold",
    message: "Nitrate has remained above 4.0 mg/L for the past hour.",
    status: "active",
    triggeredAt: "2026-03-28T11:10:00Z",
  },
  {
    id: "a2",
    siteId: "site-upland-source",
    severity: "medium",
    type: "offline",
    title: "Station reporting gap",
    message: "No fresh telemetry has been received for over 60 minutes.",
    status: "active",
    triggeredAt: "2026-03-28T11:45:00Z",
  },
  {
    id: "a3",
    siteId: "site-tidal-reach",
    severity: "high",
    type: "threshold",
    title: "Turbidity exceeds safe limit",
    message: "Turbidity reading 26.4 NTU exceeds the 25 NTU threshold.",
    status: "active",
    triggeredAt: "2026-03-28T11:58:00Z",
  },
  {
    id: "a4",
    siteId: "site-tidal-reach",
    severity: "medium",
    type: "algorithm",
    title: "BOD trending upward",
    message: "BOD has increased steadily over the last 3 readings, now at 4.6 mg/L.",
    status: "active",
    triggeredAt: "2026-03-28T11:55:00Z",
  },
];

export const algorithmResults: AlgorithmResult[] = [
  {
    id: "g1",
    siteId: "site-black-covert",
    timestamp: "2026-03-28T12:00:00Z",
    riskScore: 56,
    riskLevel: "medium",
    anomalyDetected: true,
    explanation: "Conductivity is drifting upward while dissolved oxygen is trending downward. Turbidity also rising.",
    confidence: 0.74,
  },
  {
    id: "g2",
    siteId: "site-tidal-reach",
    timestamp: "2026-03-28T11:58:00Z",
    riskScore: 88,
    riskLevel: "high",
    anomalyDetected: true,
    explanation: "Elevated nitrate, turbidity, and BOD coincide with low DO and declining ORP — possible organic pollution event.",
    confidence: 0.91,
  },
  {
    id: "g3",
    siteId: "site-upland-source",
    timestamp: "2026-03-28T10:42:00Z",
    riskScore: 63,
    riskLevel: "medium",
    anomalyDetected: false,
    explanation: "Biochemical metrics are stable, but the telemetry feed is stale.",
    confidence: 0.67,
  },
];
