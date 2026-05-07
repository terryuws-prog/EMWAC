export type SiteStatus = "healthy" | "warning" | "critical" | "offline";
export type AlertSeverity = "low" | "medium" | "high";
export type MetricKey = "temp" | "ph" | "do" | "ec" | "nitrate" | "turbidity" | "tds" | "orp" | "chl_a" | "bod";

export const METRIC_META: Record<MetricKey, { label: string; unit: string; min: number; max: number }> = {
  temp:      { label: "Temp",     unit: "°C",    min: 5,   max: 20   },
  ph:        { label: "pH",       unit: "",      min: 6.8, max: 7.8  },
  do:        { label: "DO",       unit: "mg/L",  min: 7.0, max: 10.5 },
  ec:        { label: "EC",       unit: "μS/cm", min: 0,   max: 300  },
  nitrate:   { label: "Nitrate",  unit: "mg/L",  min: 0,   max: 4.0  },
  turbidity: { label: "Turbidity",unit: "NTU",   min: 0,   max: 25   },
  tds:       { label: "TDS",      unit: "mg/L",  min: 0,   max: 500  },
  orp:       { label: "ORP",      unit: "mV",    min: 200, max: 500  },
  chl_a:     { label: "Chl-a",   unit: "μg/L",  min: 0,   max: 10   },
  bod:       { label: "BOD",      unit: "mg/L",  min: 0,   max: 5    },
};

export interface Site {
  id: string;
  name: string;
  code: string;
  river: string;
  region: string;
  status: SiteStatus;
  latitude: number;
  longitude: number;
  lastSeenAt: string;
}

export interface MetricValues {
  temp: number;
  ph: number;
  do: number;
  ec: number;
  nitrate: number;
  turbidity: number;
  tds: number;
  orp: number;
  chl_a: number;
  bod: number;
}

export interface Reading {
  id: string;
  siteId: string;
  timestamp: string;
  metrics: MetricValues;
  qualityFlag: "good" | "suspect" | "missing";
}

export interface Alert {
  id: string;
  siteId: string;
  severity: AlertSeverity;
  type: "threshold" | "stale-data" | "offline" | "algorithm";
  title: string;
  message: string;
  status: "active" | "acknowledged" | "resolved";
  triggeredAt: string;
}

export interface AlgorithmResult {
  id: string;
  siteId: string;
  timestamp: string;
  riskScore: number;
  riskLevel: "low" | "medium" | "high";
  anomalyDetected: boolean;
  explanation: string;
  confidence: number;
}

export interface SiteSummary {
  id: string;
  name: string;
  river: string;
  region: string;
  status: SiteStatus;
  latestReading: Reading;
  latestRisk: AlgorithmResult;
}

export interface DashboardModel {
  summary: {
    totalSites: number;
    healthySites: number;
    warningSites: number;
    offlineSites: number;
    activeAlerts: number;
  };
  siteSummaries: SiteSummary[];
  activeAlerts: Alert[];
  rankedRisks: AlgorithmResult[];
  updatedAt: string;
}

export interface SiteDetailModel {
  site: Site;
  history: Reading[];
  latestReading: Reading;
  latestRisk: AlgorithmResult;
  alerts: Alert[];
}
