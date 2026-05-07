import { render, screen } from "@testing-library/react";
import CodexPluginDockPage from "./page";

describe("CodexPluginDockPage", () => {
  it("renders the dock proposal page", () => {
    render(<CodexPluginDockPage />);

    expect(
      screen.getByRole("heading", { name: "Codex Plugin Dock" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Use Vercel plugin" })).toBeInTheDocument();
  });
});
