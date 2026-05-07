import { IntelligenceView } from "@/features/intelligence/intelligence-view";
import { getIntelligenceModel } from "@/features/monitoring/repository";

export default function IntelligencePage() {
  return <IntelligenceView model={getIntelligenceModel()} />;
}
