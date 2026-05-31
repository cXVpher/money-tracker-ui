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

export async function getBalance() {
  return apiRequest<BackendBalance>("/balance");
}
