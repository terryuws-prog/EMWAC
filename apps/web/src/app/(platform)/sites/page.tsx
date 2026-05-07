import { SitesView } from "@/features/sites/sites-view";
import { getSitesModel } from "@/features/monitoring/repository";

export default function SitesPage() {
  return <SitesView sites={getSitesModel()} />;
}
