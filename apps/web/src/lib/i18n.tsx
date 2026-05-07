"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

/* ── Supported locales ── */
export type Locale = "en" | "cy";

/* ── Translation dictionary ── */
const translations: Record<Locale, Record<string, string>> = {
  en: {
    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.sites": "Sites",
    "nav.analytics": "Analytics",
    "nav.intelligence": "Intelligence",
    "nav.alerts": "Alerts",
    "nav.reports": "Reports",
    "nav.settings": "Settings",

    // KPI / stat cards
    "kpi.totalSites": "Total sites",
    "kpi.healthy": "Healthy",
    "kpi.warning": "Warning",
    "kpi.offline": "Offline",
    "kpi.activeAlerts": "Active alerts",

    // KPI helpers
    "kpi.helper.monitoringStations": "Monitoring stations",
    "kpi.helper.allMetricsNormal": "All metrics normal",
    "kpi.helper.needsAttention": "Needs attention",
    "kpi.helper.noDataReceived": "No data received",
    "kpi.helper.unresolved": "Unresolved",

    // Section headers
    "section.networkMap": "Network map",
    "section.siteOverview": "Site overview",
    "section.sensorTrends": "Sensor trends",
    "section.latestReadings": "Latest readings",

    // Section descriptions
    "desc.clickMarkers": "Click markers for site details.",
    "desc.currentStatus": "Current status of each monitoring station.",
    "desc.chartOverlay": "Each chart overlays all stations for easy comparison.",
    "desc.latestReadings":
      "Scroll horizontally to view all metrics. Cells are color-coded by threshold proximity.",

    // Live banner
    "live.realTimeMonitoring": "Real-time monitoring",
    "live.sensorsPerStation": "10 sensors per station",
    "live.lastUpdate": "Last update",

    // Chart group tabs
    "chart.waterChemistry": "Water Chemistry",
    "chart.nutrientsOrganic": "Nutrients & Organic",
    "chart.physical": "Physical",

    // Table headers
    "table.site": "Site",
    "table.status": "Status",
    "table.risk": "Risk",
    "table.time": "Time",

    // Home / landing page
    "home.platform": "EMWAC Platform",
    "home.headline": "Environmental monitoring, clarified.",
    "home.subtitle":
      "Surface operational context, site health, and explainable intelligence without waiting for the live ingestion layer.",
    "home.openDashboard": "Open Dashboard",
    "home.browseSites": "Browse Sites",
    "home.sites": "Sites",
    "home.activeAlerts": "Active alerts",
    "home.highestRisk": "Highest risk",
  },

  cy: {
    // Navigation
    "nav.dashboard": "Dangosfwrdd",
    "nav.sites": "Safleoedd",
    "nav.analytics": "Dadansoddeg",
    "nav.intelligence": "Deallusrwydd",
    "nav.alerts": "Rhybuddion",
    "nav.reports": "Adroddiadau",
    "nav.settings": "Gosodiadau",

    // KPI / stat cards
    "kpi.totalSites": "Cyfanswm safleoedd",
    "kpi.healthy": "Iach",
    "kpi.warning": "Rhybudd",
    "kpi.offline": "All-lein",
    "kpi.activeAlerts": "Rhybuddion gweithredol",

    // KPI helpers
    "kpi.helper.monitoringStations": "Gorsafoedd monitro",
    "kpi.helper.allMetricsNormal": "Pob metrig yn normal",
    "kpi.helper.needsAttention": "Angen sylw",
    "kpi.helper.noDataReceived": "Dim data wedi'i dderbyn",
    "kpi.helper.unresolved": "Heb ei ddatrys",

    // Section headers
    "section.networkMap": "Map rhwydwaith",
    "section.siteOverview": "Trosolwg safle",
    "section.sensorTrends": "Tueddiadau synhwyrydd",
    "section.latestReadings": "Darlleniadau diweddaraf",

    // Section descriptions
    "desc.clickMarkers": "Cliciwch farcwyr am fanylion safle.",
    "desc.currentStatus": "Statws presennol pob gorsaf fonitro.",
    "desc.chartOverlay":
      "Mae pob siart yn gorgyffrwdd pob gorsaf ar gyfer cymhariaeth hawdd.",
    "desc.latestReadings":
      "Sgroliwch yn llorweddol i weld pob metrig. Mae celloedd wedi'u codio yn ol lliw yn ol agosrwydd trothwy.",

    // Live banner
    "live.realTimeMonitoring": "Monitro amser real",
    "live.sensorsPerStation": "10 synhwyrydd fesul gorsaf",
    "live.lastUpdate": "Diweddariad diwethaf",

    // Chart group tabs
    "chart.waterChemistry": "Cemeg Dŵr",
    "chart.nutrientsOrganic": "Maetholion ac Organig",
    "chart.physical": "Ffisegol",

    // Table headers
    "table.site": "Safle",
    "table.status": "Statws",
    "table.risk": "Risg",
    "table.time": "Amser",

    // Home / landing page
    "home.platform": "Platfform EMWAC",
    "home.headline": "Monitro amgylcheddol, wedi'i egluro.",
    "home.subtitle":
      "Cyd-destun gweithredol, iechyd safle, a deallusrwydd esboniadwy heb aros am yr haen fewnbwn byw.",
    "home.openDashboard": "Agor Dangosfwrdd",
    "home.browseSites": "Pori Safleoedd",
    "home.sites": "Safleoedd",
    "home.activeAlerts": "Rhybuddion gweithredol",
    "home.highestRisk": "Risg uchaf",
  },
};

/* ── Context ── */
interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextValue>({
  locale: "en",
  setLocale: () => {},
  t: (key) => key,
});

/* ── Provider ── */
export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");

  const t = useCallback(
    (key: string): string => translations[locale][key] ?? key,
    [locale],
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

/* ── Hooks ── */
export function useT() {
  const { t } = useContext(I18nContext);
  return t;
}

export function useLocale() {
  const { locale, setLocale } = useContext(I18nContext);
  return { locale, setLocale };
}

/* ── Language toggle component ── */
export function LanguageToggle() {
  const { locale, setLocale } = useLocale();

  return (
    <button
      type="button"
      onClick={() => setLocale(locale === "en" ? "cy" : "en")}
      className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:border-slate-400 hover:text-slate-900"
      aria-label="Toggle language"
    >
      <span className={locale === "en" ? "font-bold text-slate-900" : ""}>
        EN
      </span>
      <span className="text-slate-300">|</span>
      <span className={locale === "cy" ? "font-bold text-slate-900" : ""}>
        CY
      </span>
    </button>
  );
}
