# Codex Plugin Dock Design

Date: 2026-04-29

## Purpose

Codex Plugin Dock is a proposal and demo for making Codex plugins easier to discover and invoke from the conversation composer.

The current friction is that users must remember or type plugin mentions such as `@vercel`, `@github`, or `@browser-use`. Installed plugins already contain useful interface metadata, including display names, composer icons, logos, categories, capabilities, and starter prompts. The Dock turns that metadata into a visual, one-click composer experience.

The long-term goal is an official Codex composer extension point. The immediate goal is to build a polished demo and written proposal that shows how the experience should work without relying on private UI injection.

## Product Position

This is not a plugin marketplace replacement. It is a lightweight composer companion for invoking plugins at the moment a user is writing a prompt.

The proposal targets three audiences:

- Codex users who install many plugins and do not want to memorize mentions.
- Plugin authors who want their plugins to be discoverable at the moment of use.
- Codex platform maintainers who need a safe, consistent composer extension model.

## Current Evidence

Local installed Codex plugin manifests expose the fields needed for the Dock:

- `name`
- `interface.displayName`
- `interface.shortDescription`
- `interface.category`
- `interface.capabilities`
- `interface.defaultPrompt`
- `interface.composerIcon`
- `interface.logo`
- `interface.brandColor`

Marketplace metadata also provides plugin names, source paths, categories, installation policy, and authentication policy.

Official OpenAI material confirms that Codex surfaces share the Codex harness through App Server and that Codex skills/plugins are intended to be used across the app, CLI, and IDE workflows. The official materials do not currently describe a stable public API for injecting custom UI into the Codex composer, so this proposal treats composer UI integration as a platform feature request rather than something to hack around.

References:

- https://openai.com/index/unlocking-the-codex-harness/
- https://openai.com/index/introducing-the-codex-app/

## User Experience

The Dock is a vertical, glass-like strip floating on the left side of the Codex conversation page.

Default state:

- Shows only favorite or frequently used plugins.
- Uses each plugin's own `composerIcon` first, then `logo`, then a generated fallback icon.
- Keeps the UI visually quiet so plugin logos carry the identity.
- Displays 6 to 8 favorite plugins by default.
- Includes a `More` button at the bottom.

Hover state:

- The hovered icon gently scales and shifts right, similar to macOS Dock behavior.
- A compact tooltip appears with the plugin display name.
- Motion is subtle, fast, and spring-like.

Click state:

- Clicking a plugin inserts the plugin mention into the current composer, for example `@vercel `.
- A small quick-prompt panel slides out from the Dock beside the selected plugin or near the composer.
- The panel shows up to three `interface.defaultPrompt` entries.
- The user can click a quick prompt or ignore it and keep typing.

More state:

- Clicking `More` opens a marketplace/favorites panel.
- The panel supports search, category filtering, installed status, and favorite toggling.
- Users can add plugins to the Dock, remove them, and reorder favorites.

## Visual Direction

The approved visual direction is:

- Left-side floating Dock.
- Frosted glass base.
- Real plugin logos from manifest metadata.
- Minimal extra color.
- Smooth hover magnification and subtle tooltip.
- Quick prompts presented as translucent floating rows.

The Dock should feel native and polished, not like a heavy sidebar.

## Official Extension Point Proposal

The proposed Codex platform feature is a `composer extension point` that allows trusted UI contributors to register lightweight composer-adjacent controls.

The extension point should provide:

- Read-only access to installed plugin interface metadata.
- A safe action for inserting a plugin mention into the current composer.
- A safe action for inserting or appending a text snippet to the current composer.
- A way to open a plugin marketplace or plugin detail surface.
- A persistent user preference store for favorites and ordering.
- Accessibility hooks for keyboard navigation and screen readers.

It should not provide:

- Arbitrary DOM access to the Codex app.
- Raw access to conversation history.
- Access to credentials, API keys, local files, or browser history.
- Permission to submit prompts without user action.
- Permission to bypass Codex approval, sandbox, or plugin security policy.

## Candidate API Shape

This is an illustrative API proposal for the design document and demo. Exact naming should be owned by the Codex platform.

```ts
type ComposerPluginMetadata = {
  name: string;
  displayName: string;
  shortDescription?: string;
  category?: string;
  capabilities?: string[];
  defaultPrompt?: string[];
  composerIconUrl?: string;
  logoUrl?: string;
  brandColor?: string;
  installed: boolean;
  authenticationPolicy?: "ON_INSTALL" | "ON_USE";
};

type ComposerActions = {
  insertMention(pluginName: string): Promise<void>;
  insertText(text: string): Promise<void>;
  openPluginDetails(pluginName: string): Promise<void>;
  openPluginMarketplace(): Promise<void>;
};

type ComposerPreferences = {
  getFavoritePlugins(): Promise<string[]>;
  setFavoritePlugins(pluginNames: string[]): Promise<void>;
};
```

The Dock would use `insertMention("vercel")` rather than editing the Codex DOM directly.

## Demo Scope

The demo should prove the experience, not pretend to have private platform access.

Demo deliverables:

- A polished left-side Dock UI using real plugin manifest metadata from local fixtures.
- A simulated Codex conversation composer.
- Click-to-insert mention behavior inside the simulated composer.
- Quick prompt display from `interface.defaultPrompt`.
- A `More` panel for searching plugins and adding favorites.
- A short README explaining which parts are demo-only and which parts need official Codex support.

The demo can run as a local web app. It should not modify the actual Codex app or rely on hidden DOM selectors.

## Data Sources

Installed plugin discovery for demo:

- Search known plugin cache locations for `.codex-plugin/plugin.json`.
- Resolve `composerIcon` and `logo` relative to the plugin root.
- Normalize metadata into the `ComposerPluginMetadata` shape.

Marketplace discovery for demo:

- Read marketplace JSON if present.
- Join marketplace entries with plugin manifest details when available.
- Show unavailable metadata with fallback names and generated icons.

Favorites:

- Store locally in a small JSON file for the demo.
- In an official implementation, use Codex's user preference store.

## Accessibility

The Dock must support:

- Keyboard focus for each plugin icon.
- Arrow-key navigation through Dock items.
- Enter/Space to invoke a plugin.
- Escape to close quick prompts or marketplace panel.
- Accessible labels from `interface.displayName`.
- Reduced motion mode that disables magnification and slide effects.

## Safety And Privacy

The Dock must be a composer aid, not an automation bypass.

Rules:

- It can insert text only into the composer.
- It cannot submit prompts automatically.
- It cannot read private thread content except what the user is actively composing, and the demo should not read real Codex input at all.
- It cannot transmit plugin lists or usage data unless the user explicitly opts in.
- It cannot create or change plugin authentication state directly.
- It must respect Codex plugin install and authentication policies.

## Implementation Strategy

Phase 1: Demo and proposal

- Build the local demo with mock Codex conversation chrome.
- Use real plugin manifest fixtures where possible.
- Include visual states: default, hover, selected, quick prompts, marketplace panel.
- Publish a concise proposal explaining the extension point.

Phase 2: Non-invasive companion fallback

- If useful, build a local overlay that can copy or paste mentions with explicit user permission.
- Keep this clearly separate from the official embedded proposal.
- Avoid DOM scraping, hidden selectors, or unsupported injection as the primary path.

Phase 3: Official integration path

- Use the demo and spec to request or propose a Codex composer extension point.
- Once an official API exists, replace simulated composer actions with platform-provided composer actions.

## Demo Decisions

The demo will make these decisions so implementation can proceed without waiting for platform answers:

- Treat the Dock as a product proposal, not a real Codex app injection.
- Read plugin metadata from local fixtures generated from installed plugin manifests.
- Store favorites in browser local storage or a local demo JSON file.
- Show installed and marketplace plugins together, with installed plugins visually prioritized.
- Keep the `More` panel inside the demo rather than linking to a real Codex marketplace surface.
- Simulate `insertMention` by writing into the demo composer only.

## Platform Questions Not Blocking Demo

- Whether Codex will expose composer extension points to plugins, apps, or a separate client-extension system.
- Whether the Dock belongs as a first-party Codex feature, a marketplace plugin, or a supported third-party app surface.
- Whether plugin favorites should sync across Codex app, CLI, IDE, and web.
- Whether marketplace search should include uninstalled plugins, installed plugins only, or both by default.

## Acceptance Criteria

The design is successful if:

- A user can understand the Dock's value in under 10 seconds from the demo.
- Clicking a plugin in the demo inserts the correct mention into the simulated composer.
- Quick prompts come from plugin manifest metadata.
- Favorites can be added, removed, and reordered in the demo.
- The proposal clearly explains why official composer actions are safer than UI injection.
- The implementation never depends on unsupported access to the actual Codex app UI.
