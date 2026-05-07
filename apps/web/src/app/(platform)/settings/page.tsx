import { SettingsView } from "@/features/settings/settings-view";
import { getSettingsModel } from "@/features/monitoring/repository";

export default function SettingsPage() {
  return <SettingsView settings={getSettingsModel()} />;
}
