"use client";

import { useTheme } from "@/shared/_components/providers/theme-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/_components/ui/card";

const themes = [
  { label: "System", value: "system" },
  { label: "Dark", value: "dark" },
  { label: "Light", value: "light" },
] as const;

export function ThemeSettingsCard() {
  const { theme, setTheme } = useTheme();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferensi</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {themes.map((themeOption) => (
          <label
            key={themeOption.value}
            className="flex items-center justify-between rounded-lg border border-border p-3"
          >
            <span className="text-sm">{themeOption.label} theme</span>
            <input
              name="theme"
              type="radio"
              checked={theme === themeOption.value}
              onChange={() => setTheme(themeOption.value)}
            />
          </label>
        ))}
      </CardContent>
    </Card>
  );
}
