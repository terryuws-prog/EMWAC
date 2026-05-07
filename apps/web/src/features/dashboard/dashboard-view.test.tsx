import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("@/features/map/site-map", () => ({
  SiteMap: () => <div data-testid="site-map">Map</div>,
}));

vi.mock("@/features/charts/multi-site-chart", () => ({
  MultiSiteChart: () => <div data-testid="multi-site-chart">Chart</div>,
}));

import { DashboardView } from "./dashboard-view";
import { getDashboardModel } from "@/features/monitoring/repository";
import { I18nProvider } from "@/lib/i18n";

describe("DashboardView", () => {
  it("renders KPI cards, map, table, and site overview", () => {
    render(
      <I18nProvider>
        <DashboardView {...getDashboardModel()} />
      </I18nProvider>
    );

    expect(screen.getByText("Total sites")).toBeInTheDocument();
    expect(screen.getByText("Active alerts")).toBeInTheDocument();
    expect(screen.getByTestId("site-map")).toBeInTheDocument();
    expect(screen.getByText("Site overview")).toBeInTheDocument();
    expect(screen.getByText("Sensor trends")).toBeInTheDocument();
    expect(screen.getAllByText("Tidal Reach").length).toBeGreaterThan(0);
  });
});
