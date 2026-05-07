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
