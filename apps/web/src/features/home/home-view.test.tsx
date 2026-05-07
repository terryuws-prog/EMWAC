import { render, screen } from "@testing-library/react";
import { I18nProvider } from "@/lib/i18n";
import { HomeView } from "./home-view";

describe("HomeView", () => {
  it("renders platform summary cards", () => {
    render(
      <I18nProvider>
        <HomeView
          stats={[
            { labelKey: "home.sites", value: "3" },
            { labelKey: "home.activeAlerts", value: "2" },
          ]}
        />
      </I18nProvider>,
    );

    expect(screen.getByText("Sites")).toBeInTheDocument();
    expect(screen.getByText("Active alerts")).toBeInTheDocument();
  });
});
