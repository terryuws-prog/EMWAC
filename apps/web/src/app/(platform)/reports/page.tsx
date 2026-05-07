import { ReportsView } from "@/features/reports/reports-view";
import { getReportsModel } from "@/features/monitoring/repository";

export default function ReportsPage() {
  return <ReportsView reports={getReportsModel()} />;
}
