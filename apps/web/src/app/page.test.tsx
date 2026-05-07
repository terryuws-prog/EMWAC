import { render, screen } from "@testing-library/react";
import { I18nProvider } from "@/lib/i18n";
import HomePage from "./page";

describe("HomePage", () => {
  it("renders the EMWAC hero and entry CTA", () => {
    render(
      <I18nProvider>
        <HomePage />
      </I18nProvider>
    );

    expect(
      screen.getByRole("heading", { name: /environmental monitoring/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: /dashboard/i }),
    ).toHaveAttribute("href", "/dashboard");
  });
});
