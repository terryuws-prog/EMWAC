# Codex Plugin Dock Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished local Next.js demo of the left-side Codex Plugin Dock proposal at `/codex-plugin-dock`.

**Architecture:** Add a self-contained `features/codex-dock` module with typed plugin fixtures, a client-side interactive demo component, focused tests, and a standalone Next route. The demo simulates a Codex composer and official `insertMention` action without touching real Codex UI or hidden DOM APIs.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS utilities, Vitest, React Testing Library.

---

## File Structure

- Create `apps/web/src/features/codex-dock/plugin-data.ts`
  - Defines `ComposerPluginMetadata`, demo plugin fixtures, default favorite order, and helpers for resolving favorites and marketplace plugins.
- Create `apps/web/src/features/codex-dock/plugin-dock-demo.tsx`
  - Client component for the left floating Dock, simulated conversation, composer, quick prompts, and marketplace panel.
- Create `apps/web/src/features/codex-dock/plugin-data.test.ts`
  - Tests fixture integrity and helper behavior.
- Create `apps/web/src/features/codex-dock/plugin-dock-demo.test.tsx`
  - Tests click-to-insert mention, quick prompt insertion, More panel, and favorite toggling.
- Create `apps/web/src/app/codex-plugin-dock/page.tsx`
  - Standalone route that renders the demo.
- Create `apps/web/public/plugin-dock/*`
  - Demo icon assets copied from locally installed plugin manifests.

## Task 1: Plugin Metadata Fixtures

**Files:**
- Create: `apps/web/src/features/codex-dock/plugin-data.ts`
- Test: `apps/web/src/features/codex-dock/plugin-data.test.ts`

- [ ] **Step 1: Write the failing plugin data tests**

Create `apps/web/src/features/codex-dock/plugin-data.test.ts`:

```ts
import {
  defaultFavoritePluginNames,
  getFavoritePlugins,
  getMarketplacePlugins,
  pluginCatalog,
} from "./plugin-data";

describe("plugin-data", () => {
  it("contains installable plugins with icons, mentions, and short labels", () => {
    expect(pluginCatalog.length).toBeGreaterThanOrEqual(8);

    for (const plugin of pluginCatalog) {
      expect(plugin.name).toMatch(/^[a-z0-9-]+$/);
      expect(plugin.mention).toBe(`@${plugin.name}`);
      expect(plugin.displayName.length).toBeGreaterThan(1);
      expect(plugin.iconSrc).toMatch(/^\/plugin-dock\//);
      expect(plugin.shortDescription.length).toBeGreaterThan(1);
    }
  });

  it("returns default favorites in the configured order", () => {
    const favorites = getFavoritePlugins(defaultFavoritePluginNames);

    expect(favorites.map((plugin) => plugin.name)).toEqual(defaultFavoritePluginNames);
    expect(favorites[0]?.name).toBe("vercel");
  });

  it("keeps marketplace plugins outside the current favorites", () => {
    const marketplace = getMarketplacePlugins(["vercel", "github"]);

    expect(marketplace.some((plugin) => plugin.name === "vercel")).toBe(false);
    expect(marketplace.some((plugin) => plugin.name === "github")).toBe(false);
    expect(marketplace.length).toBe(pluginCatalog.length - 2);
  });
});
```

- [ ] **Step 2: Run the data test to verify it fails**

Run:

```bash
pnpm --filter @emwac/web test -- src/features/codex-dock/plugin-data.test.ts
```

Expected: FAIL because `plugin-data.ts` does not exist.

- [ ] **Step 3: Implement typed plugin fixtures**

Create `apps/web/src/features/codex-dock/plugin-data.ts`:

```ts
export type ComposerPluginMetadata = {
  name: string;
  mention: `@${string}`;
  displayName: string;
  shortDescription: string;
  category: string;
  capabilities: string[];
  defaultPrompt: string[];
  iconSrc: string;
  brandColor: string;
  installed: boolean;
};

export const pluginCatalog: ComposerPluginMetadata[] = [
  {
    name: "vercel",
    mention: "@vercel",
    displayName: "Vercel",
    shortDescription: "Build and deploy web apps and agents",
    category: "Coding",
    capabilities: ["Interactive", "Write"],
    defaultPrompt: [
      "Audit this repo for Vercel deployment risks",
      "Which Vercel tools fit this app best?",
      "Help wire the Vercel app into this workflow",
    ],
    iconSrc: "/plugin-dock/vercel-icon.png",
    brandColor: "#000000",
    installed: true,
  },
  {
    name: "github",
    mention: "@github",
    displayName: "GitHub",
    shortDescription: "Triage PRs, issues, CI, and publish flows",
    category: "Coding",
    capabilities: ["Interactive", "Write"],
    defaultPrompt: [
      "Inspect open pull requests",
      "Debug failing GitHub Actions checks",
      "Prepare these changes for review",
    ],
    iconSrc: "/plugin-dock/github-small.svg",
    brandColor: "#24292f",
    installed: true,
  },
  {
    name: "browser-use",
    mention: "@browser-use",
    displayName: "Browser Use",
    shortDescription: "Control the in-app browser with Codex",
    category: "Engineering",
    capabilities: ["Interactive", "Read", "Write"],
    defaultPrompt: [
      "Open localhost:3000",
      "Test my latest changes in the browser",
      "Take a screenshot and check the UI",
    ],
    iconSrc: "/plugin-dock/browser-icon.png",
    brandColor: "#0f766e",
    installed: true,
  },
  {
    name: "documents",
    mention: "@documents",
    displayName: "Documents",
    shortDescription: "Create, edit, and verify document artifacts",
    category: "Productivity",
    capabilities: ["Read", "Write"],
    defaultPrompt: [
      "Create a polished DOCX from this outline",
      "Review this document for layout issues",
      "Render and verify the final document",
    ],
    iconSrc: "/plugin-dock/documents-icon.png",
    brandColor: "#2563eb",
    installed: true,
  },
  {
    name: "spreadsheets",
    mention: "@spreadsheets",
    displayName: "Spreadsheets",
    shortDescription: "Analyze and create spreadsheet files",
    category: "Productivity",
    capabilities: ["Read", "Write"],
    defaultPrompt: [
      "Analyze this workbook",
      "Create a formatted spreadsheet",
      "Add formulas and charts to this sheet",
    ],
    iconSrc: "/plugin-dock/spreadsheets-icon.png",
    brandColor: "#16a34a",
    installed: true,
  },
  {
    name: "presentations",
    mention: "@presentations",
    displayName: "Presentations",
    shortDescription: "Create and verify presentation decks",
    category: "Productivity",
    capabilities: ["Read", "Write"],
    defaultPrompt: [
      "Turn this outline into a slide deck",
      "Polish this deck visually",
      "Render and verify the presentation",
    ],
    iconSrc: "/plugin-dock/presentations-icon.png",
    brandColor: "#dc2626",
    installed: true,
  },
  {
    name: "figma",
    mention: "@figma",
    displayName: "Figma",
    shortDescription: "Bring design context into implementation work",
    category: "Design",
    capabilities: ["Read"],
    defaultPrompt: [
      "Use this Figma design as implementation context",
      "Extract assets from the selected design",
      "Compare this UI with the Figma reference",
    ],
    iconSrc: "/plugin-dock/figma-icon.svg",
    brandColor: "#a259ff",
    installed: false,
  },
  {
    name: "linear",
    mention: "@linear",
    displayName: "Linear",
    shortDescription: "Manage issues, triage bugs, and plan releases",
    category: "Productivity",
    capabilities: ["Interactive", "Write"],
    defaultPrompt: [
      "Triage open bugs",
      "Create Linear issues from these notes",
      "Summarize release-blocking work",
    ],
    iconSrc: "/plugin-dock/linear-icon.svg",
    brandColor: "#5e6ad2",
    installed: false,
  },
];

export const defaultFavoritePluginNames = [
  "vercel",
  "github",
  "browser-use",
  "documents",
  "spreadsheets",
  "presentations",
] as const;

export function getFavoritePlugins(pluginNames: readonly string[]) {
  return pluginNames
    .map((pluginName) => pluginCatalog.find((plugin) => plugin.name === pluginName))
    .filter((plugin): plugin is ComposerPluginMetadata => Boolean(plugin));
}

export function getMarketplacePlugins(favoritePluginNames: readonly string[]) {
  const favorites = new Set(favoritePluginNames);
  return pluginCatalog.filter((plugin) => !favorites.has(plugin.name));
}
```

- [ ] **Step 4: Add icon assets**

Create `apps/web/public/plugin-dock/` and copy available installed plugin icons into it:

```bash
mkdir -p apps/web/public/plugin-dock
cp /Users/meng/.codex/plugins/cache/openai-curated/vercel/6807e4de/assets/app-icon.png apps/web/public/plugin-dock/vercel-icon.png
cp /Users/meng/.codex/plugins/cache/openai-curated/github/6807e4de/assets/github-small.svg apps/web/public/plugin-dock/github-small.svg
cp /Users/meng/.codex/plugins/cache/openai-bundled/browser-use/0.1.0-alpha1/assets/browser.png apps/web/public/plugin-dock/browser-icon.png
cp /Users/meng/.codex/plugins/cache/openai-primary-runtime/documents/26.426.12240/assets/icon.png apps/web/public/plugin-dock/documents-icon.png
cp /Users/meng/.codex/plugins/cache/openai-primary-runtime/spreadsheets/26.426.12240/assets/icon.png apps/web/public/plugin-dock/spreadsheets-icon.png
cp /Users/meng/.codex/plugins/cache/openai-primary-runtime/presentations/26.426.12240/assets/icon.png apps/web/public/plugin-dock/presentations-icon.png
```

Create fallback SVGs with these exact contents:

`apps/web/public/plugin-dock/figma-icon.svg`

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="16" fill="#111827"/>
  <circle cx="24" cy="20" r="8" fill="#f24e1e"/>
  <circle cx="40" cy="20" r="8" fill="#ff7262"/>
  <circle cx="24" cy="32" r="8" fill="#a259ff"/>
  <circle cx="40" cy="32" r="8" fill="#1abcfe"/>
  <circle cx="24" cy="44" r="8" fill="#0acf83"/>
</svg>
```

`apps/web/public/plugin-dock/linear-icon.svg`

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="16" fill="#5e6ad2"/>
  <path d="M18 40 40 18M18 30l12-12M28 46l18-18" stroke="white" stroke-width="5" stroke-linecap="round"/>
</svg>
```

- [ ] **Step 5: Run the data tests**

Run:

```bash
pnpm --filter @emwac/web test -- src/features/codex-dock/plugin-data.test.ts
```

Expected: PASS.

## Task 2: Interactive Dock Component

**Files:**
- Create: `apps/web/src/features/codex-dock/plugin-dock-demo.tsx`
- Test: `apps/web/src/features/codex-dock/plugin-dock-demo.test.tsx`

- [ ] **Step 1: Write failing interaction tests**

Create `apps/web/src/features/codex-dock/plugin-dock-demo.test.tsx`:

```tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { PluginDockDemo } from "./plugin-dock-demo";

describe("PluginDockDemo", () => {
  it("inserts a plugin mention and shows quick prompts", async () => {
    render(<PluginDockDemo />);

    fireEvent.click(screen.getByRole("button", { name: "Use Vercel plugin" }));

    expect(screen.getByLabelText("Demo composer")).toHaveTextContent("@vercel");
    expect(
      screen.getByRole("button", { name: "Audit this repo for Vercel deployment risks" }),
    ).toBeInTheDocument();
  });

  it("appends a quick prompt after the inserted mention", async () => {
    render(<PluginDockDemo />);

    fireEvent.click(screen.getByRole("button", { name: "Use Vercel plugin" }));
    fireEvent.click(screen.getByRole("button", { name: "Which Vercel tools fit this app best?" }));

    expect(screen.getByLabelText("Demo composer")).toHaveTextContent(
      "@vercel Which Vercel tools fit this app best?",
    );
  });

  it("opens More and adds a marketplace plugin to favorites", async () => {
    render(<PluginDockDemo />);

    expect(screen.queryByRole("button", { name: "Use Figma plugin" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Open plugin marketplace" }));
    fireEvent.click(screen.getByRole("button", { name: "Add Figma to Dock" }));

    expect(screen.getByRole("button", { name: "Use Figma plugin" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the component test to verify it fails**

Run:

```bash
pnpm --filter @emwac/web test -- src/features/codex-dock/plugin-dock-demo.test.tsx
```

Expected: FAIL because `plugin-dock-demo.tsx` does not exist.

- [ ] **Step 3: Implement the component**

Create `apps/web/src/features/codex-dock/plugin-dock-demo.tsx`.

Implementation requirements:

- Mark the file `"use client"`.
- Import `useMemo` and `useState`.
- Import `defaultFavoritePluginNames`, `getFavoritePlugins`, `getMarketplacePlugins`, and `pluginCatalog`.
- Maintain these state values:
  - `favoriteNames`
  - `selectedName`
  - `composerText`
  - `marketplaceOpen`
  - `query`
- `handlePluginSelect(plugin)` sets `selectedName`, closes marketplace, and sets composer text to `${plugin.mention} ` unless the composer already starts with that mention.
- `handlePromptSelect(prompt)` appends the prompt after the mention.
- Render:
  - A full-screen product page with heading "Codex Plugin Dock".
  - A left floating Dock with one button per favorite plugin.
  - A More button with accessible name "Open plugin marketplace".
  - A simulated conversation and composer.
  - A quick prompt panel when `selectedPlugin` exists.
  - A marketplace panel when `marketplaceOpen` is true.

Use this accessible text exactly:

- Dock buttons: `aria-label={`Use ${plugin.displayName} plugin`}`
- Composer: `aria-label="Demo composer"`
- Marketplace add buttons: `aria-label={`Add ${plugin.displayName} to Dock`}`

- [ ] **Step 4: Run the component tests**

Run:

```bash
pnpm --filter @emwac/web test -- src/features/codex-dock/plugin-dock-demo.test.tsx
```

Expected: PASS.

## Task 3: Demo Route

**Files:**
- Create: `apps/web/src/app/codex-plugin-dock/page.tsx`
- Test: `apps/web/src/app/codex-plugin-dock/page.test.tsx`

- [ ] **Step 1: Write the route test**

Create `apps/web/src/app/codex-plugin-dock/page.test.tsx`:

```tsx
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
```

- [ ] **Step 2: Run the route test to verify it fails**

Run:

```bash
pnpm --filter @emwac/web test -- src/app/codex-plugin-dock/page.test.tsx
```

Expected: FAIL because the route does not exist.

- [ ] **Step 3: Implement the route**

Create `apps/web/src/app/codex-plugin-dock/page.tsx`:

```tsx
import { PluginDockDemo } from "@/features/codex-dock/plugin-dock-demo";

export const metadata = {
  title: "Codex Plugin Dock Demo",
  description: "A proposal demo for a Codex composer plugin Dock.",
};

export default function CodexPluginDockPage() {
  return <PluginDockDemo />;
}
```

- [ ] **Step 4: Run the route test**

Run:

```bash
pnpm --filter @emwac/web test -- src/app/codex-plugin-dock/page.test.tsx
```

Expected: PASS.

## Task 4: Full Verification

**Files:**
- Modify if needed: `apps/web/src/features/codex-dock/plugin-dock-demo.tsx`
- Modify if needed: `apps/web/src/features/codex-dock/plugin-data.ts`

- [ ] **Step 1: Run all unit tests**

Run:

```bash
pnpm test
```

Expected: PASS.

- [ ] **Step 2: Run production build**

Run:

```bash
pnpm build
```

Expected: PASS.

- [ ] **Step 3: Start dev server**

Run:

```bash
pnpm dev
```

Expected: Next.js starts and prints a local URL, usually `http://localhost:3000`.

- [ ] **Step 4: Browser-check the demo**

Open `/codex-plugin-dock`.

Verify:

- Left glass Dock is visible.
- Plugin logos load.
- Clicking Vercel inserts `@vercel`.
- Quick prompts appear.
- More panel opens.
- Adding Figma adds it to the Dock.
- Text does not overlap on desktop or mobile widths.

## Self-Review

Spec coverage:

- Left floating Dock: Task 2.
- Real plugin logos: Task 1 and Task 2.
- Favorite/default Dock: Task 1 and Task 2.
- More marketplace panel: Task 2.
- Click-to-insert mention: Task 2.
- Quick prompts from metadata: Task 1 and Task 2.
- Demo-only safe composer simulation: Task 2 and Task 3.
- Verification: Task 4.

No placeholders remain in this plan. Type names are consistent: `ComposerPluginMetadata`, `pluginCatalog`, `defaultFavoritePluginNames`, `getFavoritePlugins`, and `getMarketplacePlugins`.
