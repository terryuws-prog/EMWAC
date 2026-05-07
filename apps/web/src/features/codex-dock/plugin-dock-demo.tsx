"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  defaultFavoritePluginNames,
  getFavoritePlugins,
  getMarketplacePlugins,
  type ComposerPluginMetadata,
} from "./plugin-data";

function uniqueNames(pluginNames: readonly string[]) {
  return Array.from(new Set(pluginNames));
}

function buildComposerText(plugin: ComposerPluginMetadata, currentText: string) {
  const trimmed = currentText.trimStart();
  if (trimmed.startsWith(plugin.mention)) {
    return currentText;
  }

  return `${plugin.mention} `;
}

export function PluginDockDemo() {
  const [favoriteNames, setFavoriteNames] = useState<string[]>(
    Array.from(defaultFavoritePluginNames),
  );
  const [selectedName, setSelectedName] = useState<string>(defaultFavoritePluginNames[0]);
  const [composerText, setComposerText] = useState("@vercel ");
  const [marketplaceOpen, setMarketplaceOpen] = useState(false);
  const [query, setQuery] = useState("");

  const favoritePlugins = useMemo(
    () => getFavoritePlugins(favoriteNames),
    [favoriteNames],
  );

  const selectedPlugin = useMemo(
    () => favoritePlugins.find((plugin) => plugin.name === selectedName) ?? favoritePlugins[0],
    [favoritePlugins, selectedName],
  );

  const marketplacePlugins = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return getMarketplacePlugins(favoriteNames).filter((plugin) => {
      if (!normalizedQuery) {
        return true;
      }

      return `${plugin.displayName} ${plugin.shortDescription} ${plugin.category}`
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [favoriteNames, query]);

  const composerParts = composerText.trim().split(/\s+/).filter(Boolean);
  const composerMention = composerParts[0]?.startsWith("@") ? composerParts[0] : "";
  const composerRemainder = composerMention
    ? composerParts.slice(1).join(" ")
    : composerParts.join(" ");

  function handlePluginSelect(plugin: ComposerPluginMetadata) {
    setSelectedName(plugin.name);
    setMarketplaceOpen(false);
    setComposerText((currentText) => buildComposerText(plugin, currentText));
  }

  function handlePromptSelect(prompt: string) {
    if (!selectedPlugin) {
      return;
    }

    setComposerText(`${selectedPlugin.mention} ${prompt}`);
  }

  function handleAddFavorite(plugin: ComposerPluginMetadata) {
    setFavoriteNames((currentNames) => uniqueNames([...currentNames, plugin.name]));
    setSelectedName(plugin.name);
    setComposerText(`${plugin.mention} `);
    setMarketplaceOpen(false);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#f6f8fb] text-slate-950">
      <section className="relative min-h-screen bg-[radial-gradient(circle_at_15%_8%,rgba(255,255,255,0.95),transparent_30%),linear-gradient(180deg,#fbfdff_0%,#edf4fb_48%,#fbfbfd_100%)]">
        <div className="absolute inset-x-0 top-0 z-10 flex h-14 items-center justify-between border-b border-slate-200/60 bg-white/55 px-6 pl-28 shadow-[0_1px_0_rgba(255,255,255,0.75)_inset] backdrop-blur-2xl">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">
              Official extension proposal
            </p>
            <h1 className="text-lg font-semibold tracking-tight">Codex Plugin Dock</h1>
          </div>
          <p className="hidden text-sm text-slate-500 sm:block">
            Safe composer actions, no private UI injection
          </p>
        </div>

        <nav
          aria-label="Favorite plugins"
          className="fixed left-5 top-1/2 z-30 flex max-h-[calc(100vh-3rem)] w-[68px] -translate-y-1/2 flex-col items-center gap-2 overflow-y-auto rounded-[26px] border border-white/75 bg-white/45 px-2 py-3 shadow-[0_22px_64px_rgba(31,41,55,0.15),inset_0_1px_0_rgba(255,255,255,0.82)] backdrop-blur-3xl"
        >
          {favoritePlugins.map((plugin) => {
            const active = plugin.name === selectedPlugin?.name;

            return (
              <button
                aria-label={`Use ${plugin.displayName} plugin`}
                className={`group relative grid place-items-center rounded-2xl bg-white/75 p-0 shadow-[0_9px_20px_rgba(31,41,55,0.14),inset_0_1px_0_rgba(255,255,255,0.9)] transition duration-200 ease-out hover:translate-x-2 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-slate-900/20 ${
                  active
                    ? "h-14 w-14 translate-x-1 rounded-[19px]"
                    : "h-11 w-11"
                }`}
                key={plugin.name}
                onClick={() => handlePluginSelect(plugin)}
                title={plugin.displayName}
                type="button"
              >
                <Image
                  alt=""
                  className="h-full w-full rounded-[inherit] object-cover"
                  draggable={false}
                  height={56}
                  src={plugin.iconSrc}
                  unoptimized={plugin.iconSrc.endsWith(".svg")}
                  width={56}
                />
                <span className="pointer-events-none absolute left-[calc(100%+14px)] top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-xl bg-slate-950/85 px-2.5 py-1.5 text-xs font-semibold text-white shadow-lg backdrop-blur-xl group-hover:block group-focus:block">
                  {plugin.displayName}
                </span>
              </button>
            );
          })}

          <button
            aria-label="Open plugin marketplace"
            className="grid h-11 w-11 place-items-center rounded-2xl border border-white/80 bg-white/75 text-2xl leading-none text-slate-950 shadow-[0_9px_20px_rgba(31,41,55,0.12),inset_0_1px_0_rgba(255,255,255,0.9)] transition duration-200 ease-out hover:translate-x-2 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
            onClick={() => setMarketplaceOpen((open) => !open)}
            title="More plugins"
            type="button"
          >
            +
          </button>
        </nav>

        <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-end px-6 pb-7 pl-28 pt-24">
          <div className="grid min-h-[62vh] content-start gap-4 pb-44">
            <article className="max-w-xl rounded-[20px] border border-white/75 bg-white/65 px-4 py-3 text-sm text-slate-700 shadow-[0_18px_52px_rgba(31,41,55,0.08)] backdrop-blur-xl">
              我想把 Codex 插件调用变成左边 Dock 一样顺手。
            </article>
            <article className="ml-8 max-w-2xl rounded-[20px] border border-white/75 bg-white/75 px-4 py-3 text-sm text-slate-700 shadow-[0_18px_52px_rgba(31,41,55,0.08)] backdrop-blur-xl">
              可以。常用插件固定在左侧，点击真实 logo 后只调用安全 composer action。
            </article>
          </div>

          {selectedPlugin ? (
            <div className="fixed bottom-24 left-28 z-20 grid w-[min(620px,calc(100vw-9rem))] gap-2">
              {selectedPlugin.defaultPrompt.slice(0, 3).map((prompt) => (
                <button
                  className="min-h-10 rounded-2xl border border-white/80 bg-white/70 px-4 py-2 text-left text-sm font-semibold text-slate-800 shadow-[0_18px_46px_rgba(31,41,55,0.09)] backdrop-blur-2xl transition hover:-translate-y-0.5 hover:bg-white/85 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
                  key={prompt}
                  onClick={() => handlePromptSelect(prompt)}
                  type="button"
                >
                  {prompt}
                </button>
              ))}
            </div>
          ) : null}

          {marketplaceOpen ? (
            <aside className="fixed left-28 top-20 z-40 w-[min(380px,calc(100vw-8rem))] overflow-hidden rounded-[24px] border border-white/75 bg-white/75 shadow-[0_24px_70px_rgba(31,41,55,0.16)] backdrop-blur-3xl">
              <div className="border-b border-slate-200/70 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Plugin marketplace
                </p>
                <input
                  aria-label="Search plugins"
                  className="mt-3 h-10 w-full rounded-2xl border border-slate-200 bg-white/80 px-3 text-sm outline-none transition focus:border-slate-400"
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search plugins"
                  value={query}
                />
              </div>
              <div className="max-h-[430px] overflow-y-auto p-2">
                {marketplacePlugins.map((plugin) => (
                  <div
                    className="flex items-center gap-3 rounded-2xl px-3 py-2.5 transition hover:bg-white/75"
                    key={plugin.name}
                  >
                    <Image
                      alt=""
                      className="h-10 w-10 rounded-xl object-cover shadow-sm"
                      draggable={false}
                      height={40}
                      src={plugin.iconSrc}
                      unoptimized={plugin.iconSrc.endsWith(".svg")}
                      width={40}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold text-slate-950">
                          {plugin.displayName}
                        </p>
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: plugin.brandColor }}
                        />
                      </div>
                      <p className="truncate text-xs text-slate-500">
                        {plugin.shortDescription}
                      </p>
                    </div>
                    <button
                      aria-label={`Add ${plugin.displayName} to Dock`}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
                      onClick={() => handleAddFavorite(plugin)}
                      type="button"
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            </aside>
          ) : null}

          <div className="fixed bottom-7 left-28 right-7 z-20 flex min-h-[64px] items-center gap-3 rounded-[24px] border border-slate-300/60 bg-white/80 px-4 py-3 text-sm text-slate-700 shadow-[0_16px_44px_rgba(31,41,55,0.10)] backdrop-blur-2xl">
            <div aria-label="Demo composer" className="flex min-w-0 flex-1 items-center gap-2">
              {composerText ? (
                <>
                  {composerMention ? (
                    <span className="shrink-0 rounded-full bg-slate-950/10 px-2.5 py-1 font-bold text-slate-950">
                      {composerMention}
                    </span>
                  ) : null}
                  {composerMention && composerRemainder ? " " : null}
                  {composerRemainder ? (
                    <span className="min-w-0 truncate">{composerRemainder}</span>
                  ) : null}
                </>
              ) : (
                <span className="text-slate-400">Ask Codex...</span>
              )}
            </div>
            <span className="hidden text-xs text-slate-400 sm:inline">Enter</span>
          </div>
        </div>
      </section>
    </main>
  );
}
