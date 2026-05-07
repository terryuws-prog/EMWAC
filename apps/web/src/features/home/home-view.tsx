"use client";

import Link from "next/link";
import { useT, LanguageToggle } from "@/lib/i18n";

export function HomeView({
  stats,
}: {
  stats: Array<{ labelKey: string; value: string }>;
}) {
  const t = useT();

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Language toggle — floating top-right */}
      <div className="absolute right-6 top-5 z-20">
        <LanguageToggle />
      </div>

      {/* Flowing waves at bottom */}
      <div className="pointer-events-none absolute bottom-0 left-0 w-[200%]" style={{ height: 220 }}>
        {/* Wave layer 1 */}
        <svg
          className="absolute bottom-0 left-0 h-full w-full animate-wave-flow-1"
          viewBox="0 0 2880 220"
          preserveAspectRatio="none"
        >
          <path
            fill="rgba(15, 118, 110, 0.07)"
            d="M0,120 C320,180 640,60 960,120 C1280,180 1600,60 1920,120 C2240,180 2560,60 2880,120 L2880,220 L0,220Z"
          />
        </svg>

        {/* Wave layer 2 */}
        <svg
          className="absolute bottom-0 left-0 h-full w-full animate-wave-flow-2"
          viewBox="0 0 2880 220"
          preserveAspectRatio="none"
        >
          <path
            fill="rgba(15, 118, 110, 0.10)"
            d="M0,140 C240,100 480,180 720,140 C960,100 1200,180 1440,140 C1680,100 1920,180 2160,140 C2400,100 2640,180 2880,140 L2880,220 L0,220Z"
          />
        </svg>

        {/* Wave layer 3 */}
        <svg
          className="absolute bottom-0 left-0 h-full w-full animate-wave-flow-3"
          viewBox="0 0 2880 220"
          preserveAspectRatio="none"
        >
          <path
            fill="rgba(15, 118, 110, 0.14)"
            d="M0,160 C360,130 720,190 1080,160 C1440,130 1800,190 2160,160 C2520,130 2880,190 2880,160 L2880,220 L0,220Z"
          />
        </svg>

        {/* Wave layer 4 */}
        <svg
          className="absolute bottom-0 left-0 h-full w-full animate-wave-flow-4"
          viewBox="0 0 2880 220"
          preserveAspectRatio="none"
        >
          <path
            fill="rgba(15, 118, 110, 0.05)"
            d="M0,180 C400,155 800,200 1200,175 C1600,155 2000,200 2400,175 C2800,155 2880,200 2880,180 L2880,220 L0,220Z"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col justify-center gap-12 px-6 py-16">
        <section className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.25em] text-teal-700">
              {t("home.platform")}
            </p>
            <h1 className="text-5xl font-semibold leading-tight">
              {t("home.headline")}
            </h1>
            <p className="max-w-2xl text-lg text-slate-700">
              {t("home.subtitle")}
            </p>
            <div className="flex gap-4">
              <Link
                href="/dashboard"
                className="rounded-full bg-teal-700 px-6 py-3 text-white transition hover:bg-teal-800"
              >
                {t("home.openDashboard")}
              </Link>
              <Link
                href="/sites"
                className="rounded-full border border-slate-300 bg-white px-6 py-3 text-slate-900 transition hover:border-slate-500"
              >
                {t("home.browseSites")}
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            {stats.map((stat) => (
              <article key={stat.labelKey} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">{t(stat.labelKey)}</p>
                <p className="mt-3 text-4xl font-semibold text-slate-950">{stat.value}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
