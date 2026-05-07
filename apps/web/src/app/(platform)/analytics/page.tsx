import { AnalyticsView } from "@/features/analytics/analytics-view";
import { getAnalyticsModel } from "@/features/monitoring/repository";

export default function AnalyticsPage() {
  return <AnalyticsView model={getAnalyticsModel()} />;
}
