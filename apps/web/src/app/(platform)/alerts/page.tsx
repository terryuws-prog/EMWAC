import { AlertsView } from "@/features/alerts/alerts-view";
import { getAlertsModel } from "@/features/monitoring/repository";

export default function AlertsPage() {
  return <AlertsView alerts={getAlertsModel()} />;
}
