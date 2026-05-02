"use client";

import { useState } from "react";
import { LockKeyhole } from "@/shared/_components/icons/phosphor";
import { toast } from "sonner";
import { Button } from "@/shared/_components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/_components/ui/card";
import { Input } from "@/shared/_components/ui/input";
import { Label } from "@/shared/_components/ui/label";
import { USE_MOCK_DATA } from "@/shared/_config/runtime";
import { ApiClientError, shouldUseMockFallback } from "@/shared/_utils/api-client";
import { changePassword } from "@/shared/_utils/backend-client";
import { getMockCredentials, updateMockPassword } from "@/shared/_utils/mock-auth";

export function PasswordSettingsCard() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSavePassword() {
    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      toast.error("Semua field password wajib diisi.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password baru minimal 8 karakter.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Konfirmasi password baru belum sama.");
      return;
    }

    if (currentPassword === newPassword) {
      toast.error("Password baru harus beda dari password sekarang.");
      return;
    }

    setIsSaving(true);

    try {
      if (USE_MOCK_DATA) {
        const credentials = getMockCredentials();

        if (currentPassword !== credentials.password) {
          toast.error("Password sekarang tidak cocok.");
          return;
        }

        updateMockPassword(newPassword);
        toast.success("Password mock berhasil diubah.");
        resetForm();
        return;
      }

      await changePassword({
        currentPassword,
        newPassword,
      });
      toast.success("Password berhasil diubah.");
      resetForm();
    } catch (error) {
      if (!USE_MOCK_DATA && shouldUseMockFallback(error)) {
        const credentials = getMockCredentials();

        if (currentPassword !== credentials.password) {
          toast.error("Password sekarang tidak cocok.");
          return;
        }

        updateMockPassword(newPassword);
        toast.warning("API password belum aktif. Password disimpan di mode mock.");
        resetForm();
        return;
      }

      const message =
        error instanceof ApiClientError
          ? error.message
          : "Gagal mengubah password.";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  }

  function resetForm() {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LockKeyhole className="h-4 w-4" />
          Password
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="current-password">Password sekarang</Label>
          <Input
            id="current-password"
            type="password"
            value={currentPassword}
            disabled={isSaving}
            onChange={(event) => setCurrentPassword(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="new-password">Password baru</Label>
          <Input
            id="new-password"
            type="password"
            value={newPassword}
            disabled={isSaving}
            onChange={(event) => setNewPassword(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-password">Konfirmasi password baru</Label>
          <Input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            disabled={isSaving}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </div>
        <Button onClick={handleSavePassword} disabled={isSaving}>
          {isSaving ? "Menyimpan..." : "Ubah Password"}
        </Button>
      </CardContent>
    </Card>
  );
}

