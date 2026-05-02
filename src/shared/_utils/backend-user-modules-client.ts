"use client";

import { apiRequest } from "@/shared/_utils/api-client";

type PaginatedResponse<T> = {
  items: T[];
  page: number;
  per_page: number;
  total: number;
};

export type ApiTokenData = {
  created_at: string;
  id: string;
  name: string;
  token: string;
  user_id: string;
};

export type PaymentItem = {
  amount: number;
  created_at: string;
  description?: string | null;
  id: string;
  status: string;
  type: string;
  user_id: string;
};

export type TopupResponse = {
  amount: number;
  message: string;
  payment_id: string;
  status: string;
};

export type GroupMember = {
  name: string;
  phone: string;
  role: string;
  user_id: string;
};

export type GroupListItem = {
  id: string;
  member_count: number;
  name: string;
  role: string;
};

export type GroupCreateResponse = {
  id: string;
  members: GroupMember[];
  name: string;
};

export type GroupTransactionResponse = {
  created_at: string;
  deskripsi: string;
  id: string;
  jumlah: number;
  kategori: string;
  tipe: "IN" | "OUT";
};

export type GroupReportResponse = {
  by_kategori:
    | Array<{
        count: number;
        kategori: string;
        total: number;
      }>
    | null;
  by_member:
    | Array<{
        name: string;
        percent: number;
        phone: string;
        total: number;
      }>
    | null;
  group_name: string;
  month: string;
  total_out: number;
};

export type ReferralSummary = {
  active_referrals: number;
  code: string | null;
  commission_per_user: number;
  pending_payout: number;
  total_earned: number;
  total_referrals: number;
};

export type ReferralGenerateResponse = {
  code: string;
  referral_link: string;
};

export async function listTokens() {
  return apiRequest<ApiTokenData[]>("/api/tokens");
}

export async function createToken(name: string) {
  return apiRequest<ApiTokenData>("/api/tokens", {
    body: JSON.stringify({ name }),
    method: "POST",
  });
}

export async function deleteToken(id: string) {
  return apiRequest<null>(`/api/tokens/${id}`, {
    method: "DELETE",
  });
}

export async function listPayments(status?: string) {
  const query = new URLSearchParams();

  if (status) {
    query.set("status", status);
  }

  const path = query.size ? `/api/payments?${query.toString()}` : "/api/payments";
  return apiRequest<PaginatedResponse<PaymentItem>>(path);
}

export async function createTopup(input: {
  amount: number;
  description?: string;
  proof?: File | null;
}) {
  const formData = new FormData();

  formData.set("amount", String(input.amount));
  if (input.description?.trim()) {
    formData.set("description", input.description.trim());
  }
  if (input.proof) {
    formData.set("proof", input.proof);
  }

  return apiRequest<TopupResponse>("/api/payments/topup", {
    body: formData,
    method: "POST",
  });
}

export async function listGroups() {
  return apiRequest<GroupListItem[]>("/api/groups");
}

export async function createGroup(name: string) {
  return apiRequest<GroupCreateResponse>("/api/groups", {
    body: JSON.stringify({ name }),
    method: "POST",
  });
}

export async function inviteGroupMember(groupId: string, phone: string) {
  return apiRequest<GroupMember>(`/api/groups/${groupId}/invite`, {
    body: JSON.stringify({ phone }),
    method: "POST",
  });
}

export async function createGroupTransaction(input: {
  amount: number;
  categoryName: string;
  description: string;
  groupId: string;
  transactionType: "IN" | "OUT";
}) {
  return apiRequest<GroupTransactionResponse>(`/api/groups/${input.groupId}/transaction`, {
    body: JSON.stringify({
      deskripsi: input.description.trim(),
      jumlah: input.amount,
      kategori: input.categoryName.trim(),
      tipe: input.transactionType,
    }),
    method: "POST",
  });
}

export async function getGroupReport(groupId: string, month: string) {
  return apiRequest<GroupReportResponse>(
    `/api/groups/${groupId}/report?month=${encodeURIComponent(month)}`
  );
}

export async function getReferralSummary() {
  return apiRequest<ReferralSummary>("/api/referral");
}

export async function generateReferralCode() {
  return apiRequest<ReferralGenerateResponse>("/api/referral/generate", {
    method: "POST",
  });
}
