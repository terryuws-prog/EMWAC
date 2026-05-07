"use client";

import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { SectionHeader } from "@/components/section-header";
import { StatusPill } from "@/components/status-pill";
import type { SiteSummary } from "@/features/monitoring/types";
import { SiteMap } from "@/features/map/site-map";
import { useT } from "@/lib/i18n";

export function SitesView({ sites }: { sites: SiteSummary[] }) {
  const t = useT();
  return (
    <AppShell title={t("nav.sites")}>
      <div className="page-grid">
        <section className="page-panel">
          <SectionHeader
            title="Monitoring footprint"
            description="Explore all stations on the map, then open a site detail page for trends and intelligence."
          />
          <div className="mt-6">
            <SiteMap sites={sites} />
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sites.map((site) => (
            <article key={site.id} className="page-panel">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{site.name}</h3>
                  <p className="text-sm text-slate-600">
                    {site.river} · {site.region}
                  </p>
                </div>
                <StatusPill value={site.status} />
              </div>
              <dl className="mt-4 grid gap-2 text-sm text-slate-700">
                <div className="flex justify-between">
                  <dt>pH</dt>
                  <dd>{site.latestReading.metrics.ph}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>DO</dt>
                  <dd>{site.latestReading.metrics.do}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Nitrate</dt>
                  <dd>{site.latestReading.metrics.nitrate}</dd>
                </div>
              </dl>
              <Link
                href={`/sites/${site.id}`}
                className="mt-6 inline-flex rounded-full bg-slate-950 px-4 py-2 text-sm text-white"
              >
                Open Site Detail
              </Link>
            </article>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
