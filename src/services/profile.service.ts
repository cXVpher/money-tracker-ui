"use client";

import { apiRequest } from "@/shared/_utils/api-client";

type BackendUser = {
  created_at: string;
  email?: string | null;
  id: string;
  is_active: boolean;
  name: string;
  phone: string;
  timezone: string;
  updated_at: string;
};

type BackendBalance = {
  balance: number;
  days_remaining?: number;
  expires_at?: string | null;
  is_grace_period?: boolean;
  plan_type: string;
  updated_at?: string;
  user_id?: string;
};

export type ProfileData = {
  balance: BackendBalance;
  user: BackendUser;
};

export type UpdateProfileInput = {
  email: string;
  name: string;
  timezone?: string;
};

export type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
};

export async function getProfile() {
  return apiRequest<ProfileData>("/me");
}

export async function updateProfile(input: UpdateProfileInput) {
  return apiRequest<BackendUser>("/me", {
    body: JSON.stringify({
      email: input.email.trim(),
      name: input.name.trim(),
      timezone: input.timezone?.trim() || undefined,
    }),
    method: "PUT",
  });
}

export async function changePassword(input: ChangePasswordInput) {
  return apiRequest<null>("/me/change-password", {
    body: JSON.stringify({
      current_password: input.currentPassword,
      new_password: input.newPassword,
    }),
    method: "POST",
  });
}
