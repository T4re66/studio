import { PageHeader } from "@/components/page-header";
import { ThemeSelector } from "@/components/settings/theme-selector";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Einstellungen"
        description="Passe die Anwendung an deine Bedürfnisse an."
      />
      <div className="max-w-md">
        <ThemeSelector />
      </div>
    </div>
  );
}
