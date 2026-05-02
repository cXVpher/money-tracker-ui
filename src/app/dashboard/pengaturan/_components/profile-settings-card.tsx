"use client";

import { useEffect, useState } from "react";
import { User } from "@/shared/_components/icons/phosphor";
import { toast } from "sonner";
import { Button } from "@/shared/_components/ui/button";
import { USE_MOCK_DATA } from "@/shared/_config/runtime";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/_components/ui/card";
import { Input } from "@/shared/_components/ui/input";
import { Label } from "@/shared/_components/ui/label";
import { ApiClientError, shouldUseMockFallback } from "@/shared/_utils/api-client";
import { getProfile, updateProfile } from "@/shared/_utils/backend-client";
import {
  getProfileSettings,
  saveProfileSettings,
} from "@/shared/_utils/mock-client-store";

export function ProfileSettingsCard() {
  const [profileSettings, setProfileSettings] = useState(getProfileSettings);
  const [isLoading, setIsLoading] = useState(!USE_MOCK_DATA);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (USE_MOCK_DATA) {
      return;
    }

    let isActive = true;

    async function loadProfile() {
      try {
        const profile = await getProfile();
        if (isActive) {
          setProfileSettings({
            email: profile.user.email ?? "",
            name: profile.user.name,
          });
        }
      } catch (error) {
        if (isActive) {
          if (shouldUseMockFallback(error)) {
            toast.warning("API profil belum aktif. Menampilkan profil mock.");
            return;
          }

          const message =
            error instanceof ApiClientError
              ? error.message
              : "Gagal memuat profil.";
          toast.error(message);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadProfile();

    return () => {
      isActive = false;
    };
  }, []);

  async function handleSaveProfile() {
    if (!profileSettings.name.trim() || !profileSettings.email.trim()) {
      toast.error("Nama dan email wajib diisi.");
      return;
    }

    setIsSaving(true);

    try {
      if (USE_MOCK_DATA) {
        saveProfileSettings(profileSettings);
        toast.success("Profil tersimpan di perangkat ini.");
        return;
      }

      await updateProfile(profileSettings);
      toast.success("Profil berhasil diperbarui.");
    } catch (error) {
      if (!USE_MOCK_DATA && shouldUseMockFallback(error)) {
        saveProfileSettings(profileSettings);
        toast.warning("API profil belum aktif. Profil disimpan lokal dulu.");
        return;
      }

      const message =
        error instanceof ApiClientError
          ? error.message
          : "Gagal menyimpan profil.";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
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
            disabled={isLoading || isSaving}
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
            disabled={isLoading || isSaving}
            onChange={(event) =>
              setProfileSettings((current) => ({
                ...current,
                email: event.target.value,
              }))
            }
          />
        </div>
        <div className="sm:col-span-2">
          <Button onClick={handleSaveProfile} disabled={isLoading || isSaving}>
            {isSaving ? "Menyimpan..." : "Simpan Profil"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

