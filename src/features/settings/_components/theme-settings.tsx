import { Card, CardContent, CardHeader, CardTitle } from "@/shared/_components/ui/card";

export function ThemeSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferensi</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {["System", "Dark", "Light"].map((theme) => (
          <label
            key={theme}
            className="flex items-center justify-between rounded-lg border border-border p-3"
          >
            <span className="text-sm">{theme} theme</span>
            <input name="theme" type="radio" defaultChecked={theme === "System"} />
          </label>
        ))}
      </CardContent>
    </Card>
  );
}
