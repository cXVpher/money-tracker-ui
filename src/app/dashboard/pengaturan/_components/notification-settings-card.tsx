"use client";

import { useState } from "react";
import { Bell } from "@/shared/_components/icons/phosphor";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/_components/ui/card";
import { Switch } from "@/shared/_components/ui/switch";
import {
  getNotificationSettings,
  saveNotificationSettings,
  type NotificationSettings,
} from "@/shared/_utils/mock-client-store";

const notificationItems: Array<{
  key: keyof NotificationSettings;
  label: string;
}> = [
  { key: "billReminders", label: "Reminder tagihan" },
  { key: "budgetAlerts", label: "Budget hampir habis" },
  { key: "weeklySummary", label: "Ringkasan mingguan" },
];

export function NotificationSettingsCard() {
  const [notificationSettings, setNotificationSettings] = useState(
    getNotificationSettings
  );

  function handleToggleNotification(
    key: keyof NotificationSettings,
    checked: boolean
  ) {
    const nextNotificationSettings = {
      ...notificationSettings,
      [key]: checked,
    };

    setNotificationSettings(nextNotificationSettings);
    saveNotificationSettings(nextNotificationSettings);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Notifikasi
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {notificationItems.map((item) => (
          <div key={item.key} className="flex items-center justify-between">
            <span className="text-sm">{item.label}</span>
            <Switch
              checked={notificationSettings[item.key]}
              onCheckedChange={(checked) =>
                handleToggleNotification(item.key, checked)
              }
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

