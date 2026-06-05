"use client";

import type { Account } from "@/shared/_types";
import { apiRequest } from "@/shared/_utils/api-client";

type BackendWallet = {
  balance: number;
  color: string;
  created_at: string;
  icon: string;
  id: string;
  name: string;
  type: Account["type"];
  updated_at: string;
  user_id: string;
};

export type CreateAccountInput = {
  balance: number;
  color: string;
  icon: string;
  name: string;
  type: Account["type"];
};

export type UpdateAccountInput = {
  color: string;
  icon: string;
  id: string;
  name: string;
};

function mapBackendWallet(wallet: BackendWallet): Account {
  return {
    balance: wallet.balance,
    color: wallet.color,
    icon: wallet.icon,
    id: wallet.id,
    name: wallet.name,
    type: wallet.type,
  };
}

export async function getAccounts() {
  const wallets = await apiRequest<BackendWallet[]>("/wallets");
  return (wallets ?? []).map(mapBackendWallet);
}

export async function createAccount(input: CreateAccountInput) {
  const wallet = await apiRequest<BackendWallet>("/wallets", {
    body: JSON.stringify({
      balance: input.balance,
      color: input.color,
      icon: input.icon,
      name: input.name.trim(),
      type: input.type,
    }),
    method: "POST",
  });

  return mapBackendWallet(wallet);
}

export async function updateAccount(input: UpdateAccountInput) {
  const wallet = await apiRequest<BackendWallet>(`/wallets/${input.id}`, {
    body: JSON.stringify({
      color: input.color,
      icon: input.icon,
      name: input.name.trim(),
    }),
    method: "PATCH",
  });

  return mapBackendWallet(wallet);
}

export async function deleteAccount(id: string) {
  return apiRequest<null>(`/wallets/${id}`, {
    method: "DELETE",
  });
}
