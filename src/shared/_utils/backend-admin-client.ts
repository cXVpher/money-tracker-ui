"use client";

import { API_BASE_URL, USE_MOCK_DATA } from "@/shared/_config/runtime";
import { ApiClientError } from "@/shared/_utils/api-client";
import {
  addMockAdminUserBalance,
  createMockAdminReferralPayout,
  getMockAdminDashboard,
  getMockAdminLogs,
  getMockAdminReferralOverview,
  getMockAdminRevenue,
  getMockAdminUserDetail,
  listMockAdminPayments,
  listMockAdminUsers,
  mockAdminLogin,
  rejectMockAdminPayment,
  updateMockAdminUserStatus,
  verifyMockAdminPayment,
} from "@/shared/_utils/mock-admin-client";

type ApiEnvelope<T> = {
  code: number;
  data: T;
  message: string;
};

export type PaginatedResponse<T> = {
  items: T[];
  page: number;
  per_page: number;
  total: number;
};

export type AdminSession = {
  accessToken: string;
  admin: {
    created_at: string;
    id: string;
    role: string;
    username: string;
  };
  expiresIn: number;
  refreshToken: string;
};

export type AdminDashboardStats = {
  active_users: number;
  churn_this_month: number;
  infra_cost_this_month: number;
  net_profit: number;
  new_users_this_month: number;
  pending_payments: number;
  profit_split: Record<string, number>;
  referral_cost_this_month: number;
  revenue_change_percent: number;
  revenue_prev_month: number;
  revenue_this_month: number;
  suspended_users: number;
  total_users: number;
};

export type AdminUserListItem = {
  balance: number;
  created_at: string;
  email?: string | null;
  id: string;
  is_active: boolean;
  name: string;
  phone: string;
  plan_type: string;
  timezone: string;
  updated_at: string;
};

export type AdminPaymentItem = {
  amount: number;
  created_at: string;
  description?: string | null;
  id: string;
  status: string;
  type: string;
  user_id: string;
  user_name?: string;
  user_phone?: string;
  verified_at?: string | null;
  verified_by?: string | null;
};

export type AdminUserDetail = {
  balance: {
    balance: number;
    plan_type: string;
    updated_at?: string;
    user_id: string;
  };
  payments: AdminPaymentItem[];
  stats: {
    ai_cost_this_month: number;
    member_since_days: number;
    registered_via_referral: string | null;
    total_ai_calls_this_month: number;
    total_transactions: number;
    total_wa_messages_this_month: number;
  };
  user: AdminUserListItem;
};

export type AdminRevenue = {
  cost: Record<string, number>;
  month: string;
  net_profit: number;
  profit_split: Record<string, number>;
  referral_payout: number;
  revenue: number;
  trend: Array<Record<string, unknown>>;
};

export type AdminLogItem = {
  action: string;
  admin_id: string;
  admin_username: string;
  created_at: string;
  detail?: string | null;
  id: string;
  target_id?: string | null;
  target_type?: string | null;
};

export type AdminUserListParams = {
  order?: "asc" | "desc";
  page?: number;
  perPage?: number;
  search?: string;
  sort?: "created_at" | "name" | "phone" | "balance";
  status?: "" | "active" | "inactive" | "suspended";
};

export type AdminPaymentListParams = {
  page?: number;
  perPage?: number;
  status?: string;
};

export type AdminLogListParams = {
  action?: string;
  adminId?: string;
  page?: number;
  perPage?: number;
};

export async function adminLogin(username: string, password: string) {
  if (USE_MOCK_DATA) {
    return mockAdminLogin(username, password);
  }

  const data = await adminRequest<{
    access_token: string;
    admin: AdminSession["admin"];
    expires_in: number;
    refresh_token: string;
  }>("/api/admin/auth/login", null, {
    body: JSON.stringify({ password, username }),
    method: "POST",
  });

  return {
    accessToken: data.access_token,
    admin: data.admin,
    expiresIn: data.expires_in,
    refreshToken: data.refresh_token,
  } satisfies AdminSession;
}

export async function getAdminDashboard(token: string) {
  if (USE_MOCK_DATA) {
    return getMockAdminDashboard();
  }

  return adminRequest<AdminDashboardStats>("/api/admin/dashboard", token);
}

export async function listAdminUsers(
  token: string,
  input: AdminUserListParams | string = {}
) {
  const params = typeof input === "string" ? { search: input } : input;

  if (USE_MOCK_DATA) {
    return listMockAdminUsers(params);
  }

  const query = new URLSearchParams();

  if (params.search?.trim()) {
    query.set("search", params.search.trim());
  }
  if (params.status?.trim()) {
    query.set("status", params.status.trim());
  }
  if (params.sort) {
    query.set("sort", params.sort);
  }
  if (params.order) {
    query.set("order", params.order);
  }
  if (params.page) {
    query.set("page", String(params.page));
  }
  if (params.perPage) {
    query.set("per_page", String(params.perPage));
  }

  const path = query.size ? `/api/admin/users?${query.toString()}` : "/api/admin/users";
  return adminRequest<PaginatedResponse<AdminUserListItem>>(path, token);
}

export async function getAdminUserDetail(token: string, userId: string) {
  if (USE_MOCK_DATA) {
    return getMockAdminUserDetail(userId);
  }

  return adminRequest<AdminUserDetail>(`/api/admin/users/${userId}`, token);
}

export async function updateAdminUserStatus(
  token: string,
  input: { isActive: boolean; reason: string; userId: string }
) {
  if (USE_MOCK_DATA) {
    return updateMockAdminUserStatus(input);
  }

  return adminRequest<{ is_active: boolean }>(
    `/api/admin/users/${input.userId}/status`,
    token,
    {
      body: JSON.stringify({
        is_active: input.isActive,
        reason: input.reason,
      }),
      method: "PUT",
    }
  );
}

export async function addAdminUserBalance(
  token: string,
  input: { amount: number; description: string; userId: string }
) {
  if (USE_MOCK_DATA) {
    return addMockAdminUserBalance(input);
  }

  return adminRequest<{ new_balance: number }>(
    `/api/admin/users/${input.userId}/balance`,
    token,
    {
      body: JSON.stringify({
        amount: input.amount,
        description: input.description,
      }),
      method: "PUT",
    }
  );
}

export async function listAdminPayments(
  token: string,
  input: AdminPaymentListParams | string = {}
) {
  const params = typeof input === "string" ? { status: input } : input;

  if (USE_MOCK_DATA) {
    return listMockAdminPayments(params);
  }

  const query = new URLSearchParams();

  if (params.status?.trim()) {
    query.set("status", params.status.trim());
  }
  if (params.page) {
    query.set("page", String(params.page));
  }
  if (params.perPage) {
    query.set("per_page", String(params.perPage));
  }

  const path = query.size
    ? `/api/admin/payments?${query.toString()}`
    : "/api/admin/payments";
  return adminRequest<PaginatedResponse<AdminPaymentItem>>(path, token);
}

export async function verifyAdminPayment(token: string, paymentId: string) {
  if (USE_MOCK_DATA) {
    return verifyMockAdminPayment(paymentId);
  }

  return adminRequest<{
    expires_at?: string | null;
    new_balance: number;
    payment_id: string;
  }>(`/api/admin/payments/${paymentId}/verify`, token, {
    method: "PUT",
  });
}

export async function rejectAdminPayment(
  token: string,
  input: { paymentId: string; reason: string }
) {
  if (USE_MOCK_DATA) {
    return rejectMockAdminPayment(input.paymentId);
  }

  return adminRequest<null>(`/api/admin/payments/${input.paymentId}/reject`, token, {
    body: JSON.stringify({ reason: input.reason }),
    method: "PUT",
  });
}

export async function getAdminRevenue(token: string, month: string) {
  if (USE_MOCK_DATA) {
    return getMockAdminRevenue(month);
  }

  return adminRequest<AdminRevenue>(
    `/api/admin/revenue?month=${encodeURIComponent(month)}`,
    token
  );
}

export async function getAdminReferralOverview(token: string) {
  if (USE_MOCK_DATA) {
    return getMockAdminReferralOverview();
  }

  return adminRequest<Record<string, unknown>>("/api/admin/referrals", token);
}

export async function createAdminReferralPayout(
  token: string,
  input: { period: string; referralCode: string }
) {
  if (USE_MOCK_DATA) {
    return createMockAdminReferralPayout(input);
  }

  return adminRequest<Record<string, unknown>>("/api/admin/referrals/payout", token, {
    body: JSON.stringify({
      period: input.period,
      referral_code: input.referralCode,
    }),
    method: "POST",
  });
}

export async function getAdminLogs(token: string, params: AdminLogListParams = {}) {
  if (USE_MOCK_DATA) {
    return getMockAdminLogs(params);
  }

  const query = new URLSearchParams();

  if (params.adminId?.trim()) {
    query.set("admin_id", params.adminId.trim());
  }
  if (params.action?.trim()) {
    query.set("action", params.action.trim());
  }
  if (params.page) {
    query.set("page", String(params.page));
  }
  if (params.perPage) {
    query.set("per_page", String(params.perPage));
  }

  const path = query.size ? `/api/admin/logs?${query.toString()}` : "/api/admin/logs";
  return adminRequest<PaginatedResponse<AdminLogItem>>(path, token);
}

async function adminRequest<T>(
  path: string,
  token: string | null,
  init?: RequestInit
) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(init?.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
    ...init,
  });

  let payload: ApiEnvelope<T> | null = null;

  try {
    payload = (await response.json()) as ApiEnvelope<T>;
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new ApiClientError(
      payload?.message ??
        (USE_MOCK_DATA
          ? "Mode admin belum tersedia di mock."
          : "Terjadi kesalahan saat menghubungi admin API."),
      response.status
    );
  }

  if (!payload) {
    throw new ApiClientError("Respons admin API tidak valid.", response.status);
  }

  return payload.data;
}
