import { HomeView } from "@/features/home/home-view";
import { getDashboardModel } from "@/features/monitoring/repository";

export default function HomePage() {
  const dashboard = getDashboardModel();

  return (
    <HomeView
      stats={[
        { labelKey: "home.sites", value: String(dashboard.summary.totalSites) },
        { labelKey: "home.activeAlerts", value: String(dashboard.summary.activeAlerts) },
        { labelKey: "home.highestRisk", value: String(dashboard.rankedRisks[0]?.riskScore ?? 0) },
      ]}
    />
  );
}
