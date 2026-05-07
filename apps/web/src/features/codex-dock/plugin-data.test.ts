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
