import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
}));

import { AppShell } from "./app-shell";
import { I18nProvider } from "@/lib/i18n";

describe("AppShell", () => {
  it("renders navigation items and a page title", () => {
    render(
      <I18nProvider>
        <AppShell title="Dashboard">
          <div>Child content</div>
        </AppShell>
      </I18nProvider>,
    );

    expect(screen.getByRole("link", { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /sites/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByText("Child content")).toBeInTheDocument();
  });
});
