"use client";

import { apiRequest } from "@/shared/_utils/api-client";

export type PaginatedResponse<T> = {
  items: T[] | null;
  page: number;
  per_page: number;
  total: number;
};

export type AdminSession = {
  admin: {
    created_at: string;
    id: string;
    role: string;
    username: string;
  };
  expiresIn: number;
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
  const data = await apiRequest<{
    admin: AdminSession["admin"];
    expires_in: number;
  }>("/admin/auth/login", {
    body: JSON.stringify({ password, username }),
    method: "POST",
    skipAuthRefresh: true,
    skipAuthToken: true,
  });

  return {
    admin: data.admin,
    expiresIn: data.expires_in,
  } satisfies AdminSession;
}

export async function adminLogout() {
  return apiRequest<null>("/admin/auth/logout", {
    method: "POST",
    skipAuthRedirect: true,
  });
}

export async function getAdminDashboard() {


  return apiRequest<AdminDashboardStats>("/admin/dashboard");
}

export async function listAdminUsers(
  input: AdminUserListParams | string = {}
) {
  const params = typeof input === "string" ? { search: input } : input;



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

  const path = query.size ? `/admin/users?${query.toString()}` : "/admin/users";
  return apiRequest<PaginatedResponse<AdminUserListItem>>(path);
}

export async function getAdminUserDetail(userId: string) {


  return apiRequest<AdminUserDetail>(`/admin/users/${userId}`);
}

export async function updateAdminUserStatus(
  input: { isActive: boolean; reason: string; userId: string }
) {


  return apiRequest<{ is_active: boolean }>(
    `/admin/users/${input.userId}/status`,
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
  input: { amount: number; description: string; userId: string }
) {


  return apiRequest<{ new_balance: number }>(
    `/admin/users/${input.userId}/balance`,
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
  input: AdminPaymentListParams | string = {}
) {
  const params = typeof input === "string" ? { status: input } : input;



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
    ? `/admin/payments?${query.toString()}`
    : "/admin/payments";
  return apiRequest<PaginatedResponse<AdminPaymentItem>>(path);
}

export async function verifyAdminPayment(paymentId: string) {


  return apiRequest<{
    expires_at?: string | null;
    new_balance: number;
    payment_id: string;
  }>(`/admin/payments/${paymentId}/verify`, {
    method: "PUT",
  });
}

export async function rejectAdminPayment(
  input: { paymentId: string; reason: string }
) {


  return apiRequest<null>(`/admin/payments/${input.paymentId}/reject`, {
    body: JSON.stringify({ reason: input.reason }),
    method: "PUT",
  });
}

export async function getAdminRevenue(month: string) {


  return apiRequest<AdminRevenue>(
    `/admin/revenue?month=${encodeURIComponent(month)}`
  );
}

export async function getAdminReferralOverview() {


  return apiRequest<Record<string, unknown>>("/admin/referrals");
}

export async function createAdminReferralPayout(
  input: { period: string; referralCode: string }
) {


  return apiRequest<Record<string, unknown>>("/admin/referrals/payout", {
    body: JSON.stringify({
      period: input.period,
      referral_code: input.referralCode,
    }),
    method: "POST",
  });
}

export async function getAdminLogs(params: AdminLogListParams = {}) {


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

  const path = query.size ? `/admin/logs?${query.toString()}` : "/admin/logs";
  return apiRequest<PaginatedResponse<AdminLogItem>>(path);
}
