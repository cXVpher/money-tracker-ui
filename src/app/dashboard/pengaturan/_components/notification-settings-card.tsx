import { Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/_components/ui/card";
import { Switch } from "@/shared/_components/ui/switch";

const notifications = [
  "Reminder tagihan",
  "Budget hampir habis",
  "Ringkasan mingguan",
];

export function NotificationSettingsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Notifikasi
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {notifications.map((item) => (
          <div key={item} className="flex items-center justify-between">
            <span className="text-sm">{item}</span>
            <Switch defaultChecked />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
