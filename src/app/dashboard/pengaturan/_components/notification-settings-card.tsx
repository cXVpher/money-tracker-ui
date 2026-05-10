"use client";

import { useState } from "react";
import { Bell } from "@/shared/_components/icons/phosphor";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/_components/ui/card";
import { USE_MOCK_DATA } from "@/shared/_config/runtime";
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

const disabledNotificationSettings: NotificationSettings = {
  billReminders: false,
  budgetAlerts: false,
  weeklySummary: false,
};

export function NotificationSettingsCard() {
  const [notificationSettings, setNotificationSettings] = useState(
    () => (USE_MOCK_DATA ? getNotificationSettings() : disabledNotificationSettings)
  );

  function handleToggleNotification(
    key: keyof NotificationSettings,
    checked: boolean
  ) {
    if (!USE_MOCK_DATA) {
      return;
    }

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
        {!USE_MOCK_DATA ? (
          <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
            Pengaturan notifikasi belum tersedia untuk akun ini.
          </div>
        ) : null}
        {notificationItems.map((item) => (
          <div key={item.key} className="flex items-center justify-between">
            <span className="text-sm">{item.label}</span>
            <Switch
              checked={notificationSettings[item.key]}
              disabled={!USE_MOCK_DATA}
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

