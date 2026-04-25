import { CategorySettingsCard } from "./category-settings-card";
import { ExportSettingsCard } from "./export-settings-card";
import { NotificationSettingsCard } from "./notification-settings-card";
import { ProfileSettingsCard } from "./profile-settings-card";
import { ThemeSettingsCard } from "./theme-settings-card";

export function SettingsScreen() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Profil, kategori, ekspor, dan notifikasi</p>
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight">
          Pengaturan
        </h1>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <ProfileSettingsCard />
        <ThemeSettingsCard />
      </div>

      <CategorySettingsCard />

      <div className="grid gap-6 md:grid-cols-2">
        <ExportSettingsCard />
        <NotificationSettingsCard />
      </div>
    </div>
  );
}
