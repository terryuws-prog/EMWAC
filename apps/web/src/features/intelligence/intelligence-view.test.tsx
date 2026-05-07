import { render, screen } from "@testing-library/react";
import { IntelligenceView } from "./intelligence-view";
import { getIntelligenceModel } from "@/features/monitoring/repository";

describe("IntelligenceView", () => {
  it("renders ranked risk items and anomaly events", () => {
    render(<IntelligenceView model={getIntelligenceModel()} />);

    expect(screen.getByText(/Ranked risk overview/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Tidal Reach/i).length).toBeGreaterThan(0);
  });
});
