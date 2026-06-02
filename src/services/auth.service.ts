"use client";

import { apiRequest } from "@/shared/_utils/api-client";

type BackendBalance = {
  balance: number;
  days_remaining?: number;
  expires_at?: string | null;
  is_grace_period?: boolean;
  plan_type: string;
  updated_at?: string;
  user_id?: string;
};

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

type AuthResponse = {
  access_token?: string;
  accessToken?: string;
  balance: BackendBalance;
  expires_in: number;
  user: BackendUser;
};

export type LoginInput = {
  identifier: string;
  password: string;
};

export type RegisterInput = {
  email?: string;
  name: string;
  password: string;
  phone: string;
  referralCode?: string;
};

export async function login(input: LoginInput) {
  return apiRequest<AuthResponse>("/auth/login", {
    body: JSON.stringify({ identifier: input.identifier, password: input.password }),
    method: "POST",
    skipAuthRefresh: true,
    skipAuthToken: true,
  });
}

export async function register(input: RegisterInput) {
  return apiRequest<AuthResponse>("/auth/register", {
    body: JSON.stringify({
      email: input.email?.trim() ? input.email.trim() : null,
      name: input.name.trim(),
      password: input.password.trim(),
      phone: input.phone.trim(),
      referral_code: input.referralCode?.trim()
        ? input.referralCode.trim()
        : null,
    }),
    method: "POST",
    skipAuthRefresh: true,
    skipAuthToken: true,
  });
}

export async function logout() {
  return apiRequest<null>("/auth/logout", {
    method: "POST",
  });
}
