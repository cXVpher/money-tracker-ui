"use client";

import { useEffect, useState } from "react";
import { Pencil, User } from "@/shared/_components/icons/phosphor";
import { toast } from "sonner";
import { Button } from "@/shared/_components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/_components/ui/card";
import { Input } from "@/shared/_components/ui/input";
import { Label } from "@/shared/_components/ui/label";
import { ApiClientError } from "@/shared/_utils/api-client";
import { getProfile, updateProfile } from "@/services/profile.service";


const emptyProfileSettings = {
  email: "",
  name: "",
};

export function ProfileSettingsCard() {
  const [profileSettings, setProfileSettings] = useState(emptyProfileSettings);
  const [savedProfileSettings, setSavedProfileSettings] = useState(emptyProfileSettings);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {


    let isActive = true;

    async function loadProfile() {
      try {
        const profile = await getProfile();
        if (isActive) {
          const nextProfileSettings = {
            email: profile.user.email ?? "",
            name: profile.user.name,
          };

          setProfileSettings(nextProfileSettings);
          setSavedProfileSettings(nextProfileSettings);
        }
      } catch (error) {
        if (isActive) {
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


      await updateProfile(profileSettings);
      setSavedProfileSettings(profileSettings);
      setIsEditing(false);
      toast.success("Profil berhasil diperbarui.");
    } catch (error) {
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
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profil
          </CardTitle>
          <Button
            aria-label={isEditing ? "Batal edit profil" : "Edit profil"}
            className="h-9 w-9 rounded-full"
            disabled={isLoading || isSaving}
            onClick={() => {
              if (isEditing) {
                setProfileSettings(savedProfileSettings);
                setIsEditing(false);
                return;
              }

              setIsEditing(true);
            }}
            size="icon"
            type="button"
            variant={isEditing ? "secondary" : "ghost"}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nama</Label>
          <Input
            id="name"
            value={profileSettings.name}
            disabled={!isEditing || isLoading || isSaving}
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
            disabled={!isEditing || isLoading || isSaving}
            onChange={(event) =>
              setProfileSettings((current) => ({
                ...current,
                email: event.target.value,
              }))
            }
          />
        </div>
        {isEditing ? (
        <div className="sm:col-span-2">
          <Button onClick={handleSaveProfile} disabled={isLoading || isSaving}>
            {isSaving ? "Menyimpan..." : "Simpan Profil"}
          </Button>
        </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

