"use client";

import { AppShell } from "@/components/app-shell";
import { SectionHeader } from "@/components/section-header";
import { useT } from "@/lib/i18n";

interface Report {
  id: string;
  title: string;
  period: string;
  summary: string;
}

export function ReportsView({
  reports,
}: {
  reports: Report[];
}) {
  const t = useT();
  return (
    <AppShell title={t("nav.reports")}>
      <section className="page-panel">
        <SectionHeader
          title="Snapshot reports"
          description="Pre-generated summaries that demonstrate the reporting surface."
        />
        <div className="mt-6 space-y-4">
          {reports.map((report) => (
            <article key={report.id} className="rounded-2xl border border-slate-200 p-4">
              <h3 className="font-semibold">{report.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{report.period}</p>
              <p className="mt-3 text-sm text-slate-600">{report.summary}</p>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
