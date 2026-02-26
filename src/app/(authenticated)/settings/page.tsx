import { getGameSettings } from "@/lib/queries";
import { SettingsForm } from "./settings-form";

export default async function SettingsPage() {
  const settings = await getGameSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure budgets, cost formula, and account settings
        </p>
      </div>
      <SettingsForm settings={settings} />
    </div>
  );
}
