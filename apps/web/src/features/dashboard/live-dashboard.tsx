"use client";

import { useLiveData } from "@/features/monitoring/use-live-data";
import { DashboardView } from "./dashboard-view";

export function LiveDashboard() {
  const { model } = useLiveData();
  const history = (model as typeof model & { history?: Record<string, import("@/features/monitoring/types").Reading[]> }).history;
  return <DashboardView {...model} history={history} />;
}
