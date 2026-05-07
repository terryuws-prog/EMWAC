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
