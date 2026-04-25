import { Card, CardContent, CardHeader, CardTitle } from "@/shared/_components/ui/card";

const themes = ["System", "Dark", "Light"];

export function ThemeSettingsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferensi</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {themes.map((theme) => (
          <label key={theme} className="flex items-center justify-between rounded-lg border border-border p-3">
            <span className="text-sm">{theme} theme</span>
            <input name="theme" type="radio" defaultChecked={theme === "System"} />
          </label>
        ))}
      </CardContent>
    </Card>
  );
}
