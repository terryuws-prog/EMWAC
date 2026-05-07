import { fireEvent, render, screen } from "@testing-library/react";
import { PluginDockDemo } from "./plugin-dock-demo";

describe("PluginDockDemo", () => {
  it("inserts a plugin mention and shows quick prompts", () => {
    render(<PluginDockDemo />);

    fireEvent.click(screen.getByRole("button", { name: "Use Vercel plugin" }));

    expect(screen.getByLabelText("Demo composer")).toHaveTextContent("@vercel");
    expect(
      screen.getByRole("button", { name: "Audit this repo for Vercel deployment risks" }),
    ).toBeInTheDocument();
  });

  it("appends a quick prompt after the inserted mention", () => {
    render(<PluginDockDemo />);

    fireEvent.click(screen.getByRole("button", { name: "Use Vercel plugin" }));
    fireEvent.click(screen.getByRole("button", { name: "Which Vercel tools fit this app best?" }));

    expect(screen.getByLabelText("Demo composer")).toHaveTextContent(
      "@vercel Which Vercel tools fit this app best?",
    );
  });

  it("opens More and adds a marketplace plugin to favorites", () => {
    render(<PluginDockDemo />);

    expect(screen.queryByRole("button", { name: "Use Figma plugin" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Open plugin marketplace" }));
    fireEvent.click(screen.getByRole("button", { name: "Add Figma to Dock" }));

    expect(screen.getByRole("button", { name: "Use Figma plugin" })).toBeInTheDocument();
  });
});
