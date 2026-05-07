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
    expect(screen.getAllByText(/Conductivity is drifting upward/i).length).toBeGreaterThan(0);
    expect(screen.getAllByTestId("metric-chart")).toHaveLength(10);
  });
});
