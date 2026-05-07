# EMWAC Platform MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a deployable EMWAC web MVP that presents mock real-time water-quality monitoring data across Home, Dashboard, Sites, Site Detail, Analytics, Intelligence, Alerts, Reports, and Settings pages.

**Architecture:** Use a single Next.js App Router frontend in `apps/web` backed by a typed mock repository so we can ship the full product shape before wiring live data. Keep page files thin, concentrate view-model logic in `src/features/monitoring/repository.ts`, and compose the UI from small feature views plus a reusable platform shell.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS, Vitest, Testing Library, Playwright, ECharts, MapLibre

---

## Scope Note

This plan only covers the EMWAC MVP frontend platform. Do not add device onboarding, ingestion management, API design, database persistence, or model-training pipelines in this plan. Those need separate plans later.

## File Structure

### Root Workspace

- Create: `package.json`
  Responsibility: workspace-level scripts for dev, build, lint, test, and e2e commands.
- Create: `pnpm-workspace.yaml`
  Responsibility: define the `apps/*` workspace layout.
- Modify or Create: `README.md`
  Responsibility: local development, test, and deploy instructions.

### Frontend App

- Create: `apps/web/package.json`
  Responsibility: app dependencies and app-local scripts.
- Create: `apps/web/next.config.ts`
  Responsibility: Next.js config.
- Create: `apps/web/vitest.config.ts`
  Responsibility: unit and component test config.
- Create: `apps/web/playwright.config.ts`
  Responsibility: browser smoke test config.
- Create: `apps/web/src/test/setup.ts`
  Responsibility: global test setup for Vitest and Testing Library.

### App Router

- Create: `apps/web/src/app/layout.tsx`
  Responsibility: global HTML shell, fonts, metadata, and global CSS import.
- Create: `apps/web/src/app/globals.css`
  Responsibility: design tokens, shared utility classes, and page surface styling.
- Create: `apps/web/src/app/page.tsx`
  Responsibility: public Home route.
- Create: `apps/web/src/app/(platform)/layout.tsx`
  Responsibility: platform shell wrapper for signed-in product routes.
- Create: `apps/web/src/app/(platform)/dashboard/page.tsx`
  Responsibility: dashboard route.
- Create: `apps/web/src/app/(platform)/sites/page.tsx`
  Responsibility: site list route.
- Create: `apps/web/src/app/(platform)/sites/[siteId]/page.tsx`
  Responsibility: individual site route.
- Create: `apps/web/src/app/(platform)/analytics/page.tsx`
  Responsibility: analytics route.
- Create: `apps/web/src/app/(platform)/intelligence/page.tsx`
  Responsibility: intelligence route.
- Create: `apps/web/src/app/(platform)/alerts/page.tsx`
  Responsibility: alerts route.
- Create: `apps/web/src/app/(platform)/reports/page.tsx`
  Responsibility: reports route.
- Create: `apps/web/src/app/(platform)/settings/page.tsx`
  Responsibility: settings route.

### Shared UI

- Create: `apps/web/src/lib/navigation.ts`
  Responsibility: top-level navigation labels and hrefs.
- Create: `apps/web/src/lib/formatters.ts`
  Responsibility: consistent formatting for dates, values, and percentages.
- Create: `apps/web/src/components/app-shell.tsx`
  Responsibility: sidebar and topbar layout.
- Create: `apps/web/src/components/section-header.tsx`
  Responsibility: reusable section title and helper text block.
- Create: `apps/web/src/components/stat-card.tsx`
  Responsibility: reusable KPI card.
- Create: `apps/web/src/components/status-pill.tsx`
  Responsibility: site, alert, and risk state labels.

### Monitoring Domain

- Create: `apps/web/src/features/monitoring/types.ts`
  Responsibility: domain types and view-model contracts.
- Create: `apps/web/src/features/monitoring/mock-data.ts`
  Responsibility: mock sites, readings, alerts, algorithm results, reports, and thresholds.
- Create: `apps/web/src/features/monitoring/repository.ts`
  Responsibility: typed selectors and page-ready view models.
- Create: `apps/web/src/features/monitoring/repository.test.ts`
  Responsibility: repository behavior tests.

### Feature Views

- Create: `apps/web/src/features/home/home-view.tsx`
- Create: `apps/web/src/features/dashboard/dashboard-view.tsx`
- Create: `apps/web/src/features/sites/sites-view.tsx`
- Create: `apps/web/src/features/sites/site-detail-view.tsx`
- Create: `apps/web/src/features/analytics/analytics-view.tsx`
- Create: `apps/web/src/features/intelligence/intelligence-view.tsx`
- Create: `apps/web/src/features/alerts/alerts-view.tsx`
- Create: `apps/web/src/features/reports/reports-view.tsx`
- Create: `apps/web/src/features/settings/settings-view.tsx`
  Responsibility: feature-specific page rendering with typed props.

### Visualization

- Create: `apps/web/src/features/map/site-map.tsx`
  Responsibility: interactive site map.
- Create: `apps/web/src/features/charts/metric-line-chart.tsx`
  Responsibility: reusable time-series chart.

### Tests

- Create: `apps/web/src/app/page.test.tsx`
- Create: `apps/web/src/components/app-shell.test.tsx`
- Create: `apps/web/src/features/home/home-view.test.tsx`
- Create: `apps/web/src/features/dashboard/dashboard-view.test.tsx`
- Create: `apps/web/src/features/sites/sites-view.test.tsx`
- Create: `apps/web/src/features/sites/site-detail-view.test.tsx`
- Create: `apps/web/src/features/analytics/analytics-view.test.tsx`
- Create: `apps/web/src/features/intelligence/intelligence-view.test.tsx`
- Create: `apps/web/src/features/alerts/alerts-view.test.tsx`
- Create: `apps/web/tests/navigation.spec.ts`
  Responsibility: smoke coverage for rendering, navigation, and main content.

## Task 1: Scaffold the Workspace and Frontend App

**Files:**
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `apps/web/package.json`
- Create: `apps/web/next.config.ts`
- Create: `apps/web/vitest.config.ts`
- Create: `apps/web/playwright.config.ts`
- Create: `apps/web/src/test/setup.ts`
- Create: `apps/web/src/app/layout.tsx`
- Create: `apps/web/src/app/globals.css`
- Create: `apps/web/src/app/page.tsx`
- Test: `apps/web/src/app/page.test.tsx`

- [ ] **Step 1: Initialize the workspace and app scaffold**

Run:

```bash
pnpm create next-app apps/web --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm
```

Then replace the root workspace files with:

```json
{
  "name": "emwac",
  "private": true,
  "packageManager": "pnpm@10",
  "scripts": {
    "dev": "pnpm --filter @emwac/web dev",
    "build": "pnpm --filter @emwac/web build",
    "lint": "pnpm --filter @emwac/web lint",
    "test": "pnpm --filter @emwac/web test",
    "e2e": "pnpm --filter @emwac/web e2e"
  }
}
```

```yaml
packages:
  - apps/*
```

- [ ] **Step 2: Install test dependencies and add app scripts**

Run:

```bash
pnpm --filter @emwac/web add -D vitest @testing-library/react @testing-library/jest-dom jsdom @vitejs/plugin-react playwright
```

Update `apps/web/package.json` scripts to include:

```json
{
  "name": "@emwac/web",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest",
    "e2e": "playwright test"
  }
}
```

- [ ] **Step 3: Write the failing home route test**

Create `apps/web/src/app/page.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import HomePage from "./page";

describe("HomePage", () => {
  it("renders the EMWAC hero and entry CTA", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", {
        name: /environmental monitoring, clarified/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: /open dashboard/i }),
    ).toHaveAttribute("href", "/dashboard");
  });
});
```

- [ ] **Step 4: Run the test to verify it fails**

Run:

```bash
pnpm --filter @emwac/web test -- src/app/page.test.tsx
```

Expected: FAIL because the generated page does not contain the required heading or CTA.

- [ ] **Step 5: Write the minimal app shell and homepage**

Create `apps/web/vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

Create `apps/web/src/test/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

Create `apps/web/src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EMWAC Platform",
  description: "Environmental monitoring platform MVP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

Create `apps/web/src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg: #f3f6f4;
  --ink: #10231d;
  --panel: #ffffff;
  --line: #d9e4dc;
  --accent: #0f766e;
  --accent-strong: #115e59;
  --warn: #b45309;
  --danger: #b91c1c;
}

body {
  margin: 0;
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(15, 118, 110, 0.18), transparent 32%),
    linear-gradient(180deg, #f7faf8 0%, var(--bg) 100%);
  color: var(--ink);
}
```

Create `apps/web/src/app/page.tsx`:

```tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center gap-10 px-6 py-16">
      <div className="max-w-3xl space-y-6">
        <p className="text-sm uppercase tracking-[0.25em] text-teal-700">
          EMWAC Platform MVP
        </p>
        <h1 className="text-5xl font-semibold leading-tight">
          Environmental monitoring, clarified.
        </h1>
        <p className="max-w-2xl text-lg text-slate-700">
          Review site health, water quality trends, and explainable algorithm
          signals in one operational workspace.
        </p>
      </div>

      <div className="flex gap-4">
        <Link
          href="/dashboard"
          className="rounded-full bg-teal-700 px-6 py-3 text-white transition hover:bg-teal-800"
        >
          Open Dashboard
        </Link>
        <Link
          href="/sites"
          className="rounded-full border border-slate-300 bg-white px-6 py-3 text-slate-900 transition hover:border-slate-500"
        >
          Browse Sites
        </Link>
      </div>
    </main>
  );
}
```

- [ ] **Step 6: Run the test to verify it passes**

Run:

```bash
pnpm --filter @emwac/web test -- src/app/page.test.tsx
```

Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add package.json pnpm-workspace.yaml apps/web
git commit -m "feat: scaffold EMWAC web workspace"
```

## Task 2: Create Typed Monitoring Models and the Mock Repository

**Files:**
- Create: `apps/web/src/features/monitoring/types.ts`
- Create: `apps/web/src/features/monitoring/mock-data.ts`
- Create: `apps/web/src/features/monitoring/repository.ts`
- Test: `apps/web/src/features/monitoring/repository.test.ts`

- [ ] **Step 1: Write the failing repository tests**

Create `apps/web/src/features/monitoring/repository.test.ts`:

```ts
import {
  getDashboardModel,
  getSiteDetailModel,
  getSitesModel,
} from "./repository";

describe("monitoring repository", () => {
  it("builds dashboard summary counts", () => {
    const model = getDashboardModel();

    expect(model.summary.totalSites).toBe(3);
    expect(model.summary.warningSites).toBe(1);
    expect(model.summary.offlineSites).toBe(1);
    expect(model.summary.activeAlerts).toBe(2);
  });

  it("returns site summaries sorted by operational urgency", () => {
    const model = getSitesModel();

    expect(model[0].status).toBe("critical");
    expect(model[0].name).toBe("Tidal Reach");
  });

  it("returns full detail for a valid site id", () => {
    const detail = getSiteDetailModel("site-black-covert");

    expect(detail?.site.name).toBe("Black Covert");
    expect(detail?.history.length).toBeGreaterThan(2);
    expect(detail?.latestReading.metrics.ph).toBeCloseTo(7.3);
  });

  it("returns null for an unknown site id", () => {
    expect(getSiteDetailModel("missing-site")).toBeNull();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
pnpm --filter @emwac/web test -- src/features/monitoring/repository.test.ts
```

Expected: FAIL with module-not-found errors for `./repository`.

- [ ] **Step 3: Define the domain contracts**

Create `apps/web/src/features/monitoring/types.ts`:

```ts
export type SiteStatus = "healthy" | "warning" | "critical" | "offline";
export type AlertSeverity = "low" | "medium" | "high";
export type MetricKey = "temp" | "ph" | "do" | "ec" | "nitrate";

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
```

- [ ] **Step 4: Add mock monitoring data**

Create `apps/web/src/features/monitoring/mock-data.ts`:

```ts
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
  {
    id: "r1",
    siteId: "site-black-covert",
    timestamp: "2026-03-28T10:00:00Z",
    qualityFlag: "good",
    metrics: { temp: 13.7, ph: 7.1, do: 8.9, ec: 238, nitrate: 2.0 },
  },
  {
    id: "r2",
    siteId: "site-black-covert",
    timestamp: "2026-03-28T11:00:00Z",
    qualityFlag: "good",
    metrics: { temp: 13.9, ph: 7.2, do: 8.7, ec: 241, nitrate: 2.1 },
  },
  {
    id: "r3",
    siteId: "site-black-covert",
    timestamp: "2026-03-28T12:00:00Z",
    qualityFlag: "good",
    metrics: { temp: 14.2, ph: 7.3, do: 8.4, ec: 251, nitrate: 2.3 },
  },
  {
    id: "r4",
    siteId: "site-tidal-reach",
    timestamp: "2026-03-28T10:00:00Z",
    qualityFlag: "good",
    metrics: { temp: 14.6, ph: 7.0, do: 7.8, ec: 280, nitrate: 3.8 },
  },
  {
    id: "r5",
    siteId: "site-tidal-reach",
    timestamp: "2026-03-28T11:00:00Z",
    qualityFlag: "suspect",
    metrics: { temp: 14.8, ph: 6.8, do: 7.1, ec: 305, nitrate: 4.2 },
  },
  {
    id: "r6",
    siteId: "site-tidal-reach",
    timestamp: "2026-03-28T11:58:00Z",
    qualityFlag: "suspect",
    metrics: { temp: 15.1, ph: 6.7, do: 6.8, ec: 322, nitrate: 4.6 },
  },
  {
    id: "r7",
    siteId: "site-upland-source",
    timestamp: "2026-03-28T08:00:00Z",
    qualityFlag: "good",
    metrics: { temp: 10.4, ph: 7.5, do: 9.6, ec: 190, nitrate: 1.1 },
  },
  {
    id: "r8",
    siteId: "site-upland-source",
    timestamp: "2026-03-28T09:00:00Z",
    qualityFlag: "good",
    metrics: { temp: 10.5, ph: 7.4, do: 9.5, ec: 188, nitrate: 1.2 },
  },
  {
    id: "r9",
    siteId: "site-upland-source",
    timestamp: "2026-03-28T10:42:00Z",
    qualityFlag: "missing",
    metrics: { temp: 10.5, ph: 7.4, do: 9.5, ec: 188, nitrate: 1.2 },
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
];

export const algorithmResults: AlgorithmResult[] = [
  {
    id: "g1",
    siteId: "site-black-covert",
    timestamp: "2026-03-28T12:00:00Z",
    riskScore: 56,
    riskLevel: "medium",
    anomalyDetected: true,
    explanation: "Conductivity is drifting upward while dissolved oxygen is trending downward.",
    confidence: 0.74,
  },
  {
    id: "g2",
    siteId: "site-tidal-reach",
    timestamp: "2026-03-28T11:58:00Z",
    riskScore: 88,
    riskLevel: "high",
    anomalyDetected: true,
    explanation: "Elevated nitrate and conductivity coincide with low dissolved oxygen.",
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
```

- [ ] **Step 5: Implement the repository**

Create `apps/web/src/features/monitoring/repository.ts`:

```ts
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
```

- [ ] **Step 6: Run the repository tests**

Run:

```bash
pnpm --filter @emwac/web test -- src/features/monitoring/repository.test.ts
```

Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add apps/web/src/features/monitoring
git commit -m "feat: add EMWAC mock monitoring repository"
```

## Task 3: Build the Shared Shell and UI Primitives

**Files:**
- Create: `apps/web/src/lib/navigation.ts`
- Create: `apps/web/src/lib/formatters.ts`
- Create: `apps/web/src/components/app-shell.tsx`
- Create: `apps/web/src/components/section-header.tsx`
- Create: `apps/web/src/components/stat-card.tsx`
- Create: `apps/web/src/components/status-pill.tsx`
- Create: `apps/web/src/app/(platform)/layout.tsx`
- Modify: `apps/web/src/app/globals.css`
- Test: `apps/web/src/components/app-shell.test.tsx`

- [ ] **Step 1: Write the failing shell test**

Create `apps/web/src/components/app-shell.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { AppShell } from "./app-shell";

describe("AppShell", () => {
  it("renders navigation items and a page title", () => {
    render(
      <AppShell title="Dashboard">
        <div>Child content</div>
      </AppShell>,
    );

    expect(screen.getByRole("link", { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /sites/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByText("Child content")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
pnpm --filter @emwac/web test -- src/components/app-shell.test.tsx
```

Expected: FAIL with module-not-found errors for `app-shell`.

- [ ] **Step 3: Create navigation and formatting helpers**

Create `apps/web/src/lib/navigation.ts`:

```ts
export const navigation = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/sites", label: "Sites" },
  { href: "/analytics", label: "Analytics" },
  { href: "/intelligence", label: "Intelligence" },
  { href: "/alerts", label: "Alerts" },
  { href: "/reports", label: "Reports" },
  { href: "/settings", label: "Settings" },
];
```

Create `apps/web/src/lib/formatters.ts`:

```ts
export function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatMetric(value: number, digits = 1) {
  return value.toFixed(digits);
}

export function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}
```

- [ ] **Step 4: Implement the shell and primitives**

Create `apps/web/src/components/section-header.tsx`:

```tsx
export function SectionHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="space-y-1">
      <h2 className="text-2xl font-semibold text-slate-950">{title}</h2>
      {description ? <p className="text-sm text-slate-600">{description}</p> : null}
    </div>
  );
}
```

Create `apps/web/src/components/status-pill.tsx`:

```tsx
const toneClasses = {
  healthy: "bg-emerald-50 text-emerald-800",
  warning: "bg-amber-50 text-amber-800",
  critical: "bg-rose-50 text-rose-800",
  offline: "bg-slate-200 text-slate-700",
  low: "bg-emerald-50 text-emerald-800",
  medium: "bg-amber-50 text-amber-800",
  high: "bg-rose-50 text-rose-800",
};

export function StatusPill({
  value,
}: {
  value: keyof typeof toneClasses;
}) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${toneClasses[value]}`}>
      {value}
    </span>
  );
}
```

Create `apps/web/src/components/stat-card.tsx`:

```tsx
export function StatCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: string | number;
  helper: string;
}) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-slate-950">{value}</p>
      <p className="mt-2 text-sm text-slate-600">{helper}</p>
    </article>
  );
}
```

Create `apps/web/src/components/app-shell.tsx`:

```tsx
import Link from "next/link";
import { navigation } from "@/lib/navigation";

export function AppShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto grid min-h-screen max-w-[1600px] grid-cols-1 lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-white/10 bg-slate-950/90 p-6 lg:border-b-0 lg:border-r">
          <Link href="/dashboard" className="block rounded-3xl bg-teal-700/20 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-teal-300">EMWAC</p>
            <p className="mt-2 text-2xl font-semibold">Platform</p>
          </Link>

          <nav className="mt-8 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-2xl px-4 py-3 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="bg-slate-50 px-6 py-8 text-slate-950 lg:px-10">
          <header className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Operational workspace</p>
              <h1 className="mt-2 text-4xl font-semibold">{title}</h1>
            </div>
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}
```

Create `apps/web/src/app/(platform)/layout.tsx`:

```tsx
export default function PlatformLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
```

Append to `apps/web/src/app/globals.css`:

```css
.page-grid {
  display: grid;
  gap: 1.5rem;
}

.page-panel {
  border: 1px solid #e2e8f0;
  border-radius: 1.5rem;
  background: #ffffff;
  padding: 1.5rem;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
}
```

- [ ] **Step 5: Run the shell test**

Run:

```bash
pnpm --filter @emwac/web test -- src/components/app-shell.test.tsx
```

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/lib apps/web/src/components apps/web/src/app/globals.css apps/web/src/app/'(platform)'/layout.tsx
git commit -m "feat: add EMWAC platform shell primitives"
```

## Task 4: Implement Home and Dashboard Views

**Files:**
- Create: `apps/web/src/features/home/home-view.tsx`
- Create: `apps/web/src/features/home/home-view.test.tsx`
- Create: `apps/web/src/features/dashboard/dashboard-view.tsx`
- Create: `apps/web/src/features/dashboard/dashboard-view.test.tsx`
- Modify: `apps/web/src/app/page.tsx`
- Create: `apps/web/src/app/(platform)/dashboard/page.tsx`

- [ ] **Step 1: Write the failing feature tests**

Create `apps/web/src/features/home/home-view.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { HomeView } from "./home-view";

describe("HomeView", () => {
  it("renders platform summary cards", () => {
    render(
      <HomeView
        stats={[
          { label: "Sites", value: "3" },
          { label: "Active alerts", value: "2" },
        ]}
      />,
    );

    expect(screen.getByText("Sites")).toBeInTheDocument();
    expect(screen.getByText("Active alerts")).toBeInTheDocument();
  });
});
```

Create `apps/web/src/features/dashboard/dashboard-view.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { DashboardView } from "./dashboard-view";

describe("DashboardView", () => {
  it("renders KPI cards and ranked sites", () => {
    render(
      <DashboardView
        summary={{
          totalSites: 3,
          healthySites: 0,
          warningSites: 2,
          offlineSites: 1,
          activeAlerts: 2,
        }}
        siteSummaries={[
          {
            id: "site-tidal-reach",
            name: "Tidal Reach",
            river: "Rheidol",
            region: "Aberystwyth",
            status: "critical",
            latestReading: {
              id: "r6",
              siteId: "site-tidal-reach",
              timestamp: "2026-03-28T11:58:00Z",
              qualityFlag: "suspect",
              metrics: { temp: 15.1, ph: 6.7, do: 6.8, ec: 322, nitrate: 4.6 },
            },
            latestRisk: {
              id: "g2",
              siteId: "site-tidal-reach",
              timestamp: "2026-03-28T11:58:00Z",
              riskScore: 88,
              riskLevel: "high",
              anomalyDetected: true,
              explanation: "Elevated nitrate and conductivity coincide with low dissolved oxygen.",
              confidence: 0.91,
            },
          },
        ]}
        activeAlerts={[]}
        rankedRisks={[]}
        updatedAt="2026-03-28T11:58:00Z"
      />,
    );

    expect(screen.getByText("Total sites")).toBeInTheDocument();
    expect(screen.getByText("Tidal Reach")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run:

```bash
pnpm --filter @emwac/web test -- src/features/home/home-view.test.tsx src/features/dashboard/dashboard-view.test.tsx
```

Expected: FAIL with module-not-found errors.

- [ ] **Step 3: Implement the Home view**

Create `apps/web/src/features/home/home-view.tsx`:

```tsx
import Link from "next/link";

export function HomeView({
  stats,
}: {
  stats: Array<{ label: string; value: string }>;
}) {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center gap-12 px-6 py-16">
      <section className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.25em] text-teal-700">
            EMWAC Platform
          </p>
          <h1 className="text-5xl font-semibold leading-tight">
            Environmental monitoring, clarified.
          </h1>
          <p className="max-w-2xl text-lg text-slate-700">
            Surface operational context, site health, and explainable intelligence
            without waiting for the live ingestion layer.
          </p>
          <div className="flex gap-4">
            <Link
              href="/dashboard"
              className="rounded-full bg-teal-700 px-6 py-3 text-white transition hover:bg-teal-800"
            >
              Open Dashboard
            </Link>
            <Link
              href="/sites"
              className="rounded-full border border-slate-300 bg-white px-6 py-3 text-slate-900 transition hover:border-slate-500"
            >
              Browse Sites
            </Link>
          </div>
        </div>

        <div className="grid gap-4">
          {stats.map((stat) => (
            <article key={stat.label} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">{stat.label}</p>
              <p className="mt-3 text-4xl font-semibold text-slate-950">{stat.value}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 4: Implement the Dashboard view and route wiring**

Create `apps/web/src/features/dashboard/dashboard-view.tsx`:

```tsx
import { SectionHeader } from "@/components/section-header";
import { StatCard } from "@/components/stat-card";
import { StatusPill } from "@/components/status-pill";
import { formatTimestamp } from "@/lib/formatters";
import type { Alert, AlgorithmResult, DashboardModel, SiteSummary } from "@/features/monitoring/types";
import { AppShell } from "@/components/app-shell";

export function DashboardView({
  summary,
  siteSummaries,
  activeAlerts,
  rankedRisks,
  updatedAt,
}: DashboardModel) {
  return (
    <AppShell title="Dashboard">
      <div className="page-grid">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <StatCard label="Total sites" value={summary.totalSites} helper="Configured stations in the MVP" />
          <StatCard label="Healthy" value={summary.healthySites} helper="No current issues detected" />
          <StatCard label="Warning" value={summary.warningSites} helper="Operational review recommended" />
          <StatCard label="Offline" value={summary.offlineSites} helper="Telemetry gap or station outage" />
          <StatCard label="Active alerts" value={summary.activeAlerts} helper={`Last update ${formatTimestamp(updatedAt)}`} />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <div className="page-panel">
            <SectionHeader
              title="Priority sites"
              description="The site list is ordered by current risk score so operators can triage quickly."
            />
            <div className="mt-6 space-y-4">
              {siteSummaries.map((site) => (
                <article key={site.id} className="flex items-start justify-between rounded-2xl border border-slate-200 p-4">
                  <div>
                    <h3 className="text-lg font-semibold">{site.name}</h3>
                    <p className="text-sm text-slate-600">
                      {site.river} · {site.region}
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      pH {site.latestReading.metrics.ph} · DO {site.latestReading.metrics.do} · Nitrate {site.latestReading.metrics.nitrate}
                    </p>
                  </div>
                  <div className="space-y-2 text-right">
                    <StatusPill value={site.status} />
                    <p className="text-sm font-medium text-slate-700">
                      Risk {site.latestRisk.riskScore}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="page-panel">
            <SectionHeader
              title="Active signals"
              description="High-priority anomalies and unresolved alerts."
            />
            <div className="mt-6 space-y-4">
              {activeAlerts.length === 0 ? (
                <p className="text-sm text-slate-600">No active alerts.</p>
              ) : (
                activeAlerts.map((alert) => (
                  <article key={alert.id} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{alert.title}</h3>
                      <StatusPill value={alert.severity} />
                    </div>
                    <p className="mt-2 text-sm text-slate-600">{alert.message}</p>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
```

Update `apps/web/src/app/page.tsx`:

```tsx
import { HomeView } from "@/features/home/home-view";
import { getDashboardModel } from "@/features/monitoring/repository";

export default function HomePage() {
  const dashboard = getDashboardModel();

  return (
    <HomeView
      stats={[
        { label: "Sites", value: String(dashboard.summary.totalSites) },
        { label: "Active alerts", value: String(dashboard.summary.activeAlerts) },
        { label: "Highest risk", value: String(dashboard.rankedRisks[0]?.riskScore ?? 0) },
      ]}
    />
  );
}
```

Create `apps/web/src/app/(platform)/dashboard/page.tsx`:

```tsx
import { DashboardView } from "@/features/dashboard/dashboard-view";
import { getDashboardModel } from "@/features/monitoring/repository";

export default function DashboardPage() {
  return <DashboardView {...getDashboardModel()} />;
}
```

- [ ] **Step 5: Run the feature tests**

Run:

```bash
pnpm --filter @emwac/web test -- src/features/home/home-view.test.tsx src/features/dashboard/dashboard-view.test.tsx src/app/page.test.tsx
```

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/features/home apps/web/src/features/dashboard apps/web/src/app/page.tsx apps/web/src/app/'(platform)'/dashboard/page.tsx
git commit -m "feat: add EMWAC home and dashboard views"
```

## Task 5: Add the Sites Page and Interactive Map

**Files:**
- Create: `apps/web/src/features/map/site-map.tsx`
- Create: `apps/web/src/features/sites/sites-view.tsx`
- Create: `apps/web/src/features/sites/sites-view.test.tsx`
- Create: `apps/web/src/app/(platform)/sites/page.tsx`
- Modify: `apps/web/src/app/layout.tsx`
- Modify: `apps/web/src/features/dashboard/dashboard-view.tsx`

- [ ] **Step 1: Add mapping dependencies**

Run:

```bash
pnpm --filter @emwac/web add react-map-gl maplibre-gl
```

- [ ] **Step 2: Write the failing Sites view test**

Create `apps/web/src/features/sites/sites-view.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("@/features/map/site-map", () => ({
  SiteMap: () => <div data-testid="site-map">Map</div>,
}));

import { SitesView } from "./sites-view";
import { getSitesModel } from "@/features/monitoring/repository";

describe("SitesView", () => {
  it("renders a map panel and all site cards", () => {
    render(<SitesView sites={getSitesModel()} />);

    expect(screen.getByTestId("site-map")).toBeInTheDocument();
    expect(screen.getByText("Black Covert")).toBeInTheDocument();
    expect(screen.getByText("Tidal Reach")).toBeInTheDocument();
    expect(screen.getByText("Upland Source")).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run:

```bash
pnpm --filter @emwac/web test -- src/features/sites/sites-view.test.tsx
```

Expected: FAIL with module-not-found errors.

- [ ] **Step 4: Implement the map and Sites view**

Update `apps/web/src/app/layout.tsx` to import map CSS:

```tsx
import type { Metadata } from "next";
import "maplibre-gl/dist/maplibre-gl.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "EMWAC Platform",
  description: "Environmental monitoring platform MVP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

Create `apps/web/src/features/map/site-map.tsx`:

```tsx
"use client";

import Map, { Marker, NavigationControl, Popup } from "react-map-gl/maplibre";
import { useMemo, useState } from "react";
import type { SiteSummary } from "@/features/monitoring/types";
import { StatusPill } from "@/components/status-pill";

const statusColors = {
  healthy: "#059669",
  warning: "#d97706",
  critical: "#dc2626",
  offline: "#64748b",
};

export function SiteMap({ sites }: { sites: SiteSummary[] }) {
  const [activeSiteId, setActiveSiteId] = useState<string | null>(sites[0]?.id ?? null);
  const activeSite = sites.find((site) => site.id === activeSiteId) ?? null;

  const initialViewState = useMemo(
    () => ({
      longitude: -4.02,
      latitude: 52.39,
      zoom: 9,
    }),
    [],
  );

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200" data-testid="site-map">
      <Map
        initialViewState={initialViewState}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        style={{ width: "100%", height: 420 }}
      >
        <NavigationControl position="top-right" />

        {sites.map((site) => {
          const source = rawSites.find((entry) => entry.id === site.id);

          if (!source) return null;

          return (
            <Marker key={site.id} longitude={source.longitude} latitude={source.latitude}>
              <button
                type="button"
                className="h-4 w-4 rounded-full border-2 border-white shadow"
                style={{ backgroundColor: statusColors[site.status] }}
                onClick={() => setActiveSiteId(site.id)}
                aria-label={`Open ${site.name}`}
              />
            </Marker>
          );
        })}

        {activeSite ? (() => {
          const source = rawSites.find((entry) => entry.id === activeSite.id);

          if (!source) return null;

          return (
            <Popup
              longitude={source.longitude}
              latitude={source.latitude}
              closeButton={false}
              onClose={() => setActiveSiteId(null)}
            >
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <strong>{activeSite.name}</strong>
                  <StatusPill value={activeSite.status} />
                </div>
                <p>pH {activeSite.latestReading.metrics.ph}</p>
                <p>DO {activeSite.latestReading.metrics.do}</p>
                <p>Nitrate {activeSite.latestReading.metrics.nitrate}</p>
              </div>
            </Popup>
          );
        })() : null}
      </Map>
    </div>
  );
}
```

Create `apps/web/src/features/sites/sites-view.tsx`:

```tsx
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { SectionHeader } from "@/components/section-header";
import { StatusPill } from "@/components/status-pill";
import type { SiteSummary } from "@/features/monitoring/types";
import { SiteMap } from "@/features/map/site-map";

export function SitesView({ sites }: { sites: SiteSummary[] }) {
  return (
    <AppShell title="Sites">
      <div className="page-grid">
        <section className="page-panel">
          <SectionHeader
            title="Monitoring footprint"
            description="Explore all stations on the map, then open a site detail page for trends and intelligence."
          />
          <div className="mt-6">
            <SiteMap sites={sites} />
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sites.map((site) => (
            <article key={site.id} className="page-panel">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{site.name}</h3>
                  <p className="text-sm text-slate-600">
                    {site.river} · {site.region}
                  </p>
                </div>
                <StatusPill value={site.status} />
              </div>
              <dl className="mt-4 grid gap-2 text-sm text-slate-700">
                <div className="flex justify-between">
                  <dt>pH</dt>
                  <dd>{site.latestReading.metrics.ph}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>DO</dt>
                  <dd>{site.latestReading.metrics.do}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Nitrate</dt>
                  <dd>{site.latestReading.metrics.nitrate}</dd>
                </div>
              </dl>
              <Link
                href={`/sites/${site.id}`}
                className="mt-6 inline-flex rounded-full bg-slate-950 px-4 py-2 text-sm text-white"
              >
                Open Site Detail
              </Link>
            </article>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
```

Create `apps/web/src/app/(platform)/sites/page.tsx`:

```tsx
import { SitesView } from "@/features/sites/sites-view";
import { getSitesModel } from "@/features/monitoring/repository";

export default function SitesPage() {
  return <SitesView sites={getSitesModel()} />;
}
```

Update `apps/web/src/features/dashboard/dashboard-view.tsx` to add a map section above the site list:

```tsx
import { SiteMap } from "@/features/map/site-map";
```

and replace the first `page-panel` in the body with:

```tsx
<div className="page-panel">
  <SectionHeader
    title="Network map"
    description="Geographic context for current site status and the latest readings."
  />
  <div className="mt-6">
    <SiteMap sites={siteSummaries} />
  </div>
</div>
```

- [ ] **Step 5: Run the Sites test**

Run:

```bash
pnpm --filter @emwac/web test -- src/features/sites/sites-view.test.tsx src/features/dashboard/dashboard-view.test.tsx
```

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/features/map apps/web/src/features/sites apps/web/src/features/dashboard/dashboard-view.tsx apps/web/src/app/layout.tsx apps/web/src/app/'(platform)'/sites/page.tsx
git commit -m "feat: add site exploration map and sites page"
```

## Task 6: Implement Site Detail and Time-Series Charts

**Files:**
- Create: `apps/web/src/features/charts/metric-line-chart.tsx`
- Create: `apps/web/src/features/sites/site-detail-view.tsx`
- Create: `apps/web/src/features/sites/site-detail-view.test.tsx`
- Create: `apps/web/src/app/(platform)/sites/[siteId]/page.tsx`

- [ ] **Step 1: Add charting dependencies**

Run:

```bash
pnpm --filter @emwac/web add echarts echarts-for-react
```

- [ ] **Step 2: Write the failing site detail view test**

Create `apps/web/src/features/sites/site-detail-view.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("@/features/charts/metric-line-chart", () => ({
  MetricLineChart: () => <div data-testid="metric-chart">Chart</div>,
}));

import { SiteDetailView } from "./site-detail-view";
import { getSiteDetailModel } from "@/features/monitoring/repository";

describe("SiteDetailView", () => {
  it("renders the latest metrics, alerts, and charts", () => {
    const detail = getSiteDetailModel("site-black-covert");

    if (!detail) {
      throw new Error("Expected site detail to exist");
    }

    render(<SiteDetailView detail={detail} />);

    expect(screen.getByText("Black Covert")).toBeInTheDocument();
    expect(screen.getByText(/Conductivity is drifting upward/i)).toBeInTheDocument();
    expect(screen.getAllByTestId("metric-chart")).toHaveLength(3);
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run:

```bash
pnpm --filter @emwac/web test -- src/features/sites/site-detail-view.test.tsx
```

Expected: FAIL with module-not-found errors.

- [ ] **Step 4: Create the reusable chart component**

Create `apps/web/src/features/charts/metric-line-chart.tsx`:

```tsx
"use client";

import ReactECharts from "echarts-for-react";

export function MetricLineChart({
  title,
  series,
}: {
  title: string;
  series: Array<{ timestamp: string; value: number }>;
}) {
  return (
    <ReactECharts
      style={{ height: 260 }}
      option={{
        color: ["#0f766e"],
        tooltip: { trigger: "axis" },
        xAxis: {
          type: "category",
          data: series.map((point) => point.timestamp.slice(11, 16)),
        },
        yAxis: { type: "value" },
        series: [
          {
            name: title,
            type: "line",
            smooth: true,
            areaStyle: { opacity: 0.15 },
            data: series.map((point) => point.value),
          },
        ],
      }}
    />
  );
}
```

- [ ] **Step 5: Implement the site detail view and route**

Create `apps/web/src/features/sites/site-detail-view.tsx`:

```tsx
import { AppShell } from "@/components/app-shell";
import { SectionHeader } from "@/components/section-header";
import { StatCard } from "@/components/stat-card";
import { StatusPill } from "@/components/status-pill";
import { MetricLineChart } from "@/features/charts/metric-line-chart";
import { getMetricSeries } from "@/features/monitoring/repository";
import type { SiteDetailModel } from "@/features/monitoring/types";

export function SiteDetailView({
  detail,
}: {
  detail: SiteDetailModel;
}) {
  return (
    <AppShell title={detail.site.name}>
      <div className="page-grid">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Latest pH" value={detail.latestReading.metrics.ph} helper="Most recent reading" />
          <StatCard label="Latest DO" value={detail.latestReading.metrics.do} helper="mg/L" />
          <StatCard label="Latest nitrate" value={detail.latestReading.metrics.nitrate} helper="mg/L" />
          <StatCard label="Risk score" value={detail.latestRisk.riskScore} helper={detail.latestRisk.explanation} />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <div className="page-panel">
            <SectionHeader
              title="Trend review"
              description="Review short-term behaviour across the core water-quality metrics."
            />
            <div className="mt-6 grid gap-6 xl:grid-cols-2">
              <MetricLineChart title="pH" series={getMetricSeries(detail.site.id, "ph")} />
              <MetricLineChart title="Dissolved oxygen" series={getMetricSeries(detail.site.id, "do")} />
              <MetricLineChart title="Nitrate" series={getMetricSeries(detail.site.id, "nitrate")} />
            </div>
          </div>

          <div className="page-panel">
            <SectionHeader
              title="Live context"
              description="Operational metadata, alerts, and explainable intelligence."
            />
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
              </article>

              <div className="space-y-3">
                {detail.alerts.map((alert) => (
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
          </div>
        </section>
      </div>
    </AppShell>
  );
}
```

Create `apps/web/src/app/(platform)/sites/[siteId]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import { SiteDetailView } from "@/features/sites/site-detail-view";
import { getSiteDetailModel } from "@/features/monitoring/repository";

export default function SiteDetailPage({
  params,
}: {
  params: { siteId: string };
}) {
  const detail = getSiteDetailModel(params.siteId);

  if (!detail) {
    notFound();
  }

  return <SiteDetailView detail={detail} />;
}
```

- [ ] **Step 6: Run the site detail test**

Run:

```bash
pnpm --filter @emwac/web test -- src/features/sites/site-detail-view.test.tsx src/features/monitoring/repository.test.ts
```

Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add apps/web/src/features/charts apps/web/src/features/sites/site-detail-view.tsx apps/web/src/app/'(platform)'/sites/'[siteId]'/page.tsx
git commit -m "feat: add site detail trends and intelligence"
```

## Task 7: Implement Analytics and Intelligence Pages

**Files:**
- Create: `apps/web/src/features/analytics/analytics-view.tsx`
- Create: `apps/web/src/features/analytics/analytics-view.test.tsx`
- Create: `apps/web/src/features/intelligence/intelligence-view.tsx`
- Create: `apps/web/src/features/intelligence/intelligence-view.test.tsx`
- Create: `apps/web/src/app/(platform)/analytics/page.tsx`
- Create: `apps/web/src/app/(platform)/intelligence/page.tsx`

- [ ] **Step 1: Write the failing analytics and intelligence tests**

Create `apps/web/src/features/analytics/analytics-view.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("@/features/charts/metric-line-chart", () => ({
  MetricLineChart: () => <div data-testid="metric-chart">Chart</div>,
}));

import { AnalyticsView } from "./analytics-view";
import { getAnalyticsModel } from "@/features/monitoring/repository";

describe("AnalyticsView", () => {
  it("renders comparison sections and charts", () => {
    render(<AnalyticsView model={getAnalyticsModel()} />);

    expect(screen.getByText(/Multi-site trend comparison/i)).toBeInTheDocument();
    expect(screen.getAllByTestId("metric-chart").length).toBeGreaterThan(1);
  });
});
```

Create `apps/web/src/features/intelligence/intelligence-view.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { IntelligenceView } from "./intelligence-view";
import { getIntelligenceModel } from "@/features/monitoring/repository";

describe("IntelligenceView", () => {
  it("renders ranked risk items and anomaly events", () => {
    render(<IntelligenceView model={getIntelligenceModel()} />);

    expect(screen.getByText(/Ranked risk overview/i)).toBeInTheDocument();
    expect(screen.getByText(/Tidal Reach/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run:

```bash
pnpm --filter @emwac/web test -- src/features/analytics/analytics-view.test.tsx src/features/intelligence/intelligence-view.test.tsx
```

Expected: FAIL with module-not-found errors.

- [ ] **Step 3: Implement the analytics view and route**

Create `apps/web/src/features/analytics/analytics-view.tsx`:

```tsx
"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { SectionHeader } from "@/components/section-header";
import { MetricLineChart } from "@/features/charts/metric-line-chart";

export function AnalyticsView({
  model,
}: {
  model: ReturnType<typeof import("@/features/monitoring/repository").getAnalyticsModel>;
}) {
  const [mode, setMode] = useState<"ph" | "nitrate">("ph");
  const series = mode === "ph" ? model.phSeries : model.nitrateSeries;

  return (
    <AppShell title="Analytics">
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
```

Create `apps/web/src/app/(platform)/analytics/page.tsx`:

```tsx
import { AnalyticsView } from "@/features/analytics/analytics-view";
import { getAnalyticsModel } from "@/features/monitoring/repository";

export default function AnalyticsPage() {
  return <AnalyticsView model={getAnalyticsModel()} />;
}
```

- [ ] **Step 4: Implement the intelligence view and route**

Create `apps/web/src/features/intelligence/intelligence-view.tsx`:

```tsx
import { AppShell } from "@/components/app-shell";
import { SectionHeader } from "@/components/section-header";
import { StatusPill } from "@/components/status-pill";
import { sites } from "@/features/monitoring/mock-data";

export function IntelligenceView({
  model,
}: {
  model: ReturnType<typeof import("@/features/monitoring/repository").getIntelligenceModel>;
}) {
  return (
    <AppShell title="Intelligence">
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
```

Create `apps/web/src/app/(platform)/intelligence/page.tsx`:

```tsx
import { IntelligenceView } from "@/features/intelligence/intelligence-view";
import { getIntelligenceModel } from "@/features/monitoring/repository";

export default function IntelligencePage() {
  return <IntelligenceView model={getIntelligenceModel()} />;
}
```

- [ ] **Step 5: Run the tests**

Run:

```bash
pnpm --filter @emwac/web test -- src/features/analytics/analytics-view.test.tsx src/features/intelligence/intelligence-view.test.tsx
```

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/features/analytics apps/web/src/features/intelligence apps/web/src/app/'(platform)'/analytics/page.tsx apps/web/src/app/'(platform)'/intelligence/page.tsx
git commit -m "feat: add analytics and intelligence pages"
```

## Task 8: Implement Alerts, Reports, and Settings Pages

**Files:**
- Create: `apps/web/src/features/alerts/alerts-view.tsx`
- Create: `apps/web/src/features/alerts/alerts-view.test.tsx`
- Create: `apps/web/src/features/reports/reports-view.tsx`
- Create: `apps/web/src/features/settings/settings-view.tsx`
- Create: `apps/web/src/app/(platform)/alerts/page.tsx`
- Create: `apps/web/src/app/(platform)/reports/page.tsx`
- Create: `apps/web/src/app/(platform)/settings/page.tsx`

- [ ] **Step 1: Write the failing alerts test**

Create `apps/web/src/features/alerts/alerts-view.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { AlertsView } from "./alerts-view";
import { getAlertsModel } from "@/features/monitoring/repository";

describe("AlertsView", () => {
  it("renders active alert cards", () => {
    render(<AlertsView alerts={getAlertsModel()} />);

    expect(screen.getByText(/Nitrate above operational threshold/i)).toBeInTheDocument();
    expect(screen.getByText(/Station reporting gap/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
pnpm --filter @emwac/web test -- src/features/alerts/alerts-view.test.tsx
```

Expected: FAIL with module-not-found errors.

- [ ] **Step 3: Implement alerts, reports, and settings views**

Create `apps/web/src/features/alerts/alerts-view.tsx`:

```tsx
import { AppShell } from "@/components/app-shell";
import { SectionHeader } from "@/components/section-header";
import { StatusPill } from "@/components/status-pill";
import { sites } from "@/features/monitoring/mock-data";

export function AlertsView({
  alerts,
}: {
  alerts: ReturnType<typeof import("@/features/monitoring/repository").getAlertsModel>;
}) {
  return (
    <AppShell title="Alerts">
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
```

Create `apps/web/src/features/reports/reports-view.tsx`:

```tsx
import { AppShell } from "@/components/app-shell";
import { SectionHeader } from "@/components/section-header";

export function ReportsView({
  reports,
}: {
  reports: ReturnType<typeof import("@/features/monitoring/repository").getReportsModel>;
}) {
  return (
    <AppShell title="Reports">
      <section className="page-panel">
        <SectionHeader
          title="Snapshot reports"
          description="Pre-generated summaries that demonstrate the reporting surface."
        />
        <div className="mt-6 space-y-4">
          {reports.map((report) => (
            <article key={report.id} className="rounded-2xl border border-slate-200 p-4">
              <h3 className="font-semibold">{report.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{report.period}</p>
              <p className="mt-3 text-sm text-slate-600">{report.summary}</p>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
```

Create `apps/web/src/features/settings/settings-view.tsx`:

```tsx
import { AppShell } from "@/components/app-shell";
import { SectionHeader } from "@/components/section-header";

export function SettingsView({
  settings,
}: {
  settings: ReturnType<typeof import("@/features/monitoring/repository").getSettingsModel>;
}) {
  return (
    <AppShell title="Settings">
      <section className="page-panel">
        <SectionHeader
          title="MVP operational defaults"
          description="Display-only configuration surfaces for refresh cadence and threshold presets."
        />
        <dl className="mt-6 grid gap-3 text-sm text-slate-700">
          <div className="flex justify-between">
            <dt>Refresh window</dt>
            <dd>{settings.refreshWindowMinutes} minutes</dd>
          </div>
          <div className="flex justify-between">
            <dt>pH range</dt>
            <dd>
              {settings.thresholds.ph.min} to {settings.thresholds.ph.max}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt>Nitrate max</dt>
            <dd>{settings.thresholds.nitrate.max} mg/L</dd>
          </div>
          <div className="flex justify-between">
            <dt>DO minimum</dt>
            <dd>{settings.thresholds.do.min} mg/L</dd>
          </div>
        </dl>
      </section>
    </AppShell>
  );
}
```

- [ ] **Step 4: Wire the routes**

Create `apps/web/src/app/(platform)/alerts/page.tsx`:

```tsx
import { AlertsView } from "@/features/alerts/alerts-view";
import { getAlertsModel } from "@/features/monitoring/repository";

export default function AlertsPage() {
  return <AlertsView alerts={getAlertsModel()} />;
}
```

Create `apps/web/src/app/(platform)/reports/page.tsx`:

```tsx
import { ReportsView } from "@/features/reports/reports-view";
import { getReportsModel } from "@/features/monitoring/repository";

export default function ReportsPage() {
  return <ReportsView reports={getReportsModel()} />;
}
```

Create `apps/web/src/app/(platform)/settings/page.tsx`:

```tsx
import { SettingsView } from "@/features/settings/settings-view";
import { getSettingsModel } from "@/features/monitoring/repository";

export default function SettingsPage() {
  return <SettingsView settings={getSettingsModel()} />;
}
```

- [ ] **Step 5: Run the alerts test**

Run:

```bash
pnpm --filter @emwac/web test -- src/features/alerts/alerts-view.test.tsx
```

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/features/alerts apps/web/src/features/reports apps/web/src/features/settings apps/web/src/app/'(platform)'/alerts/page.tsx apps/web/src/app/'(platform)'/reports/page.tsx apps/web/src/app/'(platform)'/settings/page.tsx
git commit -m "feat: add alerts reports and settings pages"
```

## Task 9: Add Navigation Smoke Tests and Project Documentation

**Files:**
- Create: `apps/web/tests/navigation.spec.ts`
- Modify: `README.md`

- [ ] **Step 1: Write the failing Playwright smoke test**

Create `apps/web/tests/navigation.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test("main platform routes render", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /environmental monitoring, clarified/i })).toBeVisible();

  await page.getByRole("link", { name: /open dashboard/i }).click();
  await expect(page.getByRole("heading", { name: /dashboard/i })).toBeVisible();

  await page.getByRole("link", { name: /sites/i }).click();
  await expect(page.getByRole("heading", { name: /sites/i })).toBeVisible();

  await page.getByRole("link", { name: /analytics/i }).click();
  await expect(page.getByRole("heading", { name: /analytics/i })).toBeVisible();
});
```

- [ ] **Step 2: Run the smoke test to verify it fails**

Run:

```bash
pnpm --filter @emwac/web exec playwright install
pnpm --filter @emwac/web e2e
```

Expected: FAIL until Playwright config is added and the app is started by the test runner.

- [ ] **Step 3: Add Playwright config and README instructions**

Create `apps/web/playwright.config.ts`:

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry",
  },
  webServer: {
    command: "pnpm dev",
    cwd: ".",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
```

Create or replace `README.md`:

```md
# EMWAC

## Workspace

- `docs/` holds the PRD and planning docs.
- `apps/web` contains the MVP frontend.

## Local development

```bash
pnpm install
pnpm dev
```

## Quality checks

```bash
pnpm lint
pnpm test
pnpm e2e
```

## Product scope

This repository currently contains a frontend-only MVP that uses typed mock monitoring data.
Live data ingestion, persistence, and production algorithm services are intentionally out of scope for this iteration.
```

- [ ] **Step 4: Run the full test suite**

Run:

```bash
pnpm lint
pnpm test
pnpm e2e
```

Expected:

- `pnpm lint` exits successfully
- `pnpm test` exits successfully
- `pnpm e2e` exits successfully

- [ ] **Step 5: Commit**

```bash
git add apps/web/tests/navigation.spec.ts apps/web/playwright.config.ts README.md
git commit -m "chore: add smoke coverage and contributor docs"
```

## Self-Review Notes

### Spec Coverage

- Home, Dashboard, Sites, Site Detail, Analytics, Intelligence, Alerts, Reports, and Settings are each mapped to a dedicated task.
- Map-based monitoring is covered in Task 5.
- Historical charts are covered in Task 6 and reused in Task 7.
- Explainable algorithm outputs are covered in Tasks 6 and 7.
- Reports and threshold display are covered in Task 8.
- Deployment-ready validation and docs are covered in Task 9.

### Placeholder Scan

- No task uses `TODO`, `TBD`, or "implement later".
- Each code-writing step includes concrete code.
- Each test step includes an exact command and expected outcome.

### Type Consistency

- `SiteStatus`, `AlertSeverity`, `MetricKey`, `SiteSummary`, and `DashboardModel` are defined once in `types.ts` and reused consistently.
- Route pages depend on repository-returned models rather than duplicating data shape logic.
