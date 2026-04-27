"use client";

import { useState } from "react";
import { User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/_components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/_components/ui/card";
import { Input } from "@/shared/_components/ui/input";
import { Label } from "@/shared/_components/ui/label";
import {
  getProfileSettings,
  saveProfileSettings,
} from "@/shared/_utils/mock-client-store";

export function ProfileSettingsCard() {
  const [profileSettings, setProfileSettings] = useState(getProfileSettings);

  function handleSaveProfile() {
    if (!profileSettings.name.trim() || !profileSettings.email.trim()) {
      toast.error("Nama dan email wajib diisi.");
      return;
    }

    saveProfileSettings(profileSettings);
    toast.success("Profil tersimpan di perangkat ini.");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Profil
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nama</Label>
          <Input
            id="name"
            value={profileSettings.name}
            onChange={(event) =>
              setProfileSettings((current) => ({
                ...current,
                name: event.target.value,
              }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={profileSettings.email}
            onChange={(event) =>
              setProfileSettings((current) => ({
                ...current,
                email: event.target.value,
              }))
            }
          />
        </div>
        <div className="sm:col-span-2">
          <Button onClick={handleSaveProfile}>Simpan Profil</Button>
        </div>
      </CardContent>
    </Card>
  );
}
