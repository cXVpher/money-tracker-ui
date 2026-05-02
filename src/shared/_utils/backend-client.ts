"use client";

import type { Transaction } from "@/shared/_types/finance";
import { apiRequest } from "@/shared/_utils/api-client";
import { clearAccessToken } from "@/features/auth/_utils/jwt-session";

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

type BackendTransaction = {
  confidence?: number | null;
  created_at: string;
  deskripsi: string;
  group_id?: string | null;
  id: string;
  jumlah: number;
  kategori: string;
  recorded_by?: string | null;
  source: string;
  tipe: "IN" | "OUT";
  user_id: string;
};

type DashboardSummaryResponse = {
  comparison: {
    change_percent: number;
    prev_month_out: number;
  };
  month: string;
  saldo: number;
  total_in: number;
  total_out: number;
  total_transactions: number;
};

type DashboardChartResponse = {
  by_kategori:
    | Array<{
        count: number;
        kategori: string;
        total: number;
      }>
    | null;
  daily_trend:
    | Array<{
        date: string;
        in: number;
        out: number;
      }>
    | null;
  month: string;
};

type PeriodReportResponse = {
  by_kategori:
    | Array<{
        count: number;
        kategori: string;
        total: number;
      }>
    | null;
  end_date: string;
  period: string;
  saldo: number;
  start_date: string;
  total_in: number;
  total_out: number;
  transactions: BackendTransaction[] | null;
};

type PaginatedResponse<T> = {
  items: T[];
  page: number;
  per_page: number;
  total: number;
};

export type DashboardOverviewData = {
  cashflowSeries: Array<{
    expense: number;
    income: number;
    month: string;
  }>;
  recentTransactions: Transaction[];
  summary: {
    changePercent: number;
    month: string;
    prevMonthOut: number;
    saldo: number;
    totalIn: number;
    totalOut: number;
    totalTransactions: number;
  };
};

export type ProfileData = {
  balance: BackendBalance;
  user: BackendUser;
};

export type TransactionListFilters = {
  from?: string;
  kategori?: string;
  page?: number;
  perPage?: number;
  search?: string;
  tipe?: "IN" | "OUT";
  to?: string;
};

export type UpdateProfileInput = {
  email: string;
  name: string;
  timezone?: string;
};

export type LoginInput = {
  password: string;
  phone: string;
};

export type RegisterInput = {
  email?: string;
  name: string;
  password: string;
  phone: string;
  referralCode?: string;
};

export type CreateTransactionInput = {
  categoryName: string;
  description: string;
  transactionType: "expense" | "income";
  amount: number;
};

export type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
};

type AuthResponse = {
  access_token?: string;
  accessToken?: string;
  balance: BackendBalance;
  expires_in: number;
  user: BackendUser;
};

const backendCategoryMetadata: Record<
  string,
  { icon: string; label: string }
> = {
  Belanja: { icon: "shopping", label: "Belanja" },
  Lainnya: { icon: "other", label: "Lainnya" },
  Makan: { icon: "food", label: "Makanan & Minuman" },
  Pemasukan: { icon: "salary", label: "Pemasukan" },
  Tagihan: { icon: "bills", label: "Tagihan" },
  Transport: { icon: "transport", label: "Transportasi" },
};

export const backendTransactionCategories = [
  { color: "#f97316", icon: "food", name: "Makan" },
  { color: "#3b82f6", icon: "transport", name: "Transport" },
  { color: "#64748b", icon: "bills", name: "Tagihan" },
  { color: "#ec4899", icon: "shopping", name: "Belanja" },
  { color: "#22c55e", icon: "salary", name: "Pemasukan" },
  { color: "#a3a3a3", icon: "other", name: "Lainnya" },
] as const;

export async function login(input: LoginInput) {
  return apiRequest<AuthResponse>("/api/auth/login", {
    body: JSON.stringify(input),
    method: "POST",
    skipAuthToken: true,
  });
}

export async function register(input: RegisterInput) {
  return apiRequest<AuthResponse>("/api/auth/register", {
    body: JSON.stringify({
      email: input.email?.trim() ? input.email.trim() : null,
      name: input.name,
      password: input.password,
      phone: input.phone,
      referral_code: input.referralCode?.trim()
        ? input.referralCode.trim()
        : null,
    }),
    method: "POST",
    skipAuthToken: true,
  });
}

export async function getProfile() {
  return apiRequest<ProfileData>("/api/me");
}

export async function getBalance() {
  return apiRequest<BackendBalance>("/api/balance");
}

export async function updateProfile(input: UpdateProfileInput) {
  return apiRequest<BackendUser>("/api/me", {
    body: JSON.stringify({
      email: input.email.trim(),
      name: input.name.trim(),
      timezone: input.timezone?.trim() || undefined,
    }),
    method: "PUT",
  });
}

export async function refreshAuth() {
  return apiRequest<{ expires_in: number }>("/api/auth/refresh", {
    method: "POST",
    skipAuthRefresh: true,
    skipAuthToken: true,
  });
}

export async function logout() {
  try {
    return await apiRequest<null>("/api/auth/logout", {
      method: "POST",
    });
  } finally {
    clearAccessToken();
  }
}

export async function changePassword(input: ChangePasswordInput) {
  return apiRequest<null>("/api/me/change-password", {
    body: JSON.stringify({
      current_password: input.currentPassword,
      new_password: input.newPassword,
    }),
    method: "POST",
  });
}

export async function getDashboardOverviewData(
  month = new Date().toISOString().slice(0, 7)
): Promise<DashboardOverviewData> {
  const today = new Date().toISOString().slice(0, 10);
  const [summary, chart, report] = await Promise.all([
    apiRequest<DashboardSummaryResponse>(
      `/api/dashboard/summary?month=${encodeURIComponent(month)}`
    ),
    apiRequest<DashboardChartResponse>(
      `/api/dashboard/chart?month=${encodeURIComponent(month)}`
    ),
    apiRequest<PeriodReportResponse>(
      `/api/report?period=monthly&date=${encodeURIComponent(today)}`
    ),
  ]);

  return {
    cashflowSeries: (chart.daily_trend ?? []).map((entry) => ({
      expense: entry.out,
      income: entry.in,
      month: new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "short",
      }).format(new Date(entry.date)),
    })),
    recentTransactions: (report.transactions ?? [])
      .slice(0, 5)
      .map(mapBackendTransactionToUi),
    summary: {
      changePercent: summary.comparison.change_percent,
      month: summary.month,
      prevMonthOut: summary.comparison.prev_month_out,
      saldo: summary.saldo,
      totalIn: summary.total_in,
      totalOut: summary.total_out,
      totalTransactions: summary.total_transactions,
    },
  };
}

export async function getMonthlyTransactions(
  date = new Date().toISOString().slice(0, 10)
) {
  const report = await apiRequest<PeriodReportResponse>(
    `/api/report?period=monthly&date=${encodeURIComponent(date)}`
  );

  return (report.transactions ?? []).map(mapBackendTransactionToUi);
}

export async function getTransactions(filters: TransactionListFilters = {}) {
  const query = new URLSearchParams();

  if (filters.page) {
    query.set("page", String(filters.page));
  }
  if (filters.perPage) {
    query.set("per_page", String(filters.perPage));
  }
  if (filters.tipe) {
    query.set("tipe", filters.tipe);
  }
  if (filters.kategori) {
    query.set("kategori", filters.kategori);
  }
  if (filters.search) {
    query.set("search", filters.search);
  }
  if (filters.from) {
    query.set("from", filters.from);
  }
  if (filters.to) {
    query.set("to", filters.to);
  }

  const path = query.size
    ? `/api/transactions?${query.toString()}`
    : "/api/transactions";
  const response = await apiRequest<PaginatedResponse<BackendTransaction>>(path);

  return {
    items: response.items.map(mapBackendTransactionToUi),
    page: response.page,
    perPage: response.per_page,
    total: response.total,
  };
}

export async function getTransaction(id: string) {
  const transaction = await apiRequest<BackendTransaction>(`/api/transactions/${id}`);
  return mapBackendTransactionToUi(transaction);
}

export async function deleteTransaction(id: string) {
  return apiRequest<null>(`/api/transactions/${id}`, {
    method: "DELETE",
  });
}

export async function createTransaction(input: CreateTransactionInput) {
  const transaction = await apiRequest<BackendTransaction>("/api/transactions", {
    body: JSON.stringify({
      deskripsi: input.description.trim(),
      jumlah: input.amount,
      kategori: input.categoryName,
      tipe: input.transactionType === "income" ? "IN" : "OUT",
    }),
    method: "POST",
  });

  return mapBackendTransactionToUi(transaction);
}

function mapBackendTransactionToUi(transaction: BackendTransaction): Transaction {
  const category = backendCategoryMetadata[transaction.kategori] ?? {
    icon: "other",
    label: transaction.kategori,
  };

  return {
    accountId: "backend",
    accountName: "DuitKu",
    amount: transaction.jumlah,
    categoryIcon: category.icon,
    categoryId: `backend-${normalizeKey(transaction.kategori)}`,
    categoryName: category.label,
    date: transaction.created_at.slice(0, 10),
    description: transaction.deskripsi,
    id: transaction.id,
    type: transaction.tipe === "IN" ? "income" : "expense",
  };
}

function normalizeKey(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "-");
}
