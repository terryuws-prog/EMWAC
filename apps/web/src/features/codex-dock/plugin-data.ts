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
