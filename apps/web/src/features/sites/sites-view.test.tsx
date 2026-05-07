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
