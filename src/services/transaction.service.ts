"use client";

import type { Transaction } from "@/shared/_types/finance";
import { apiRequest } from "@/shared/_utils/api-client";

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

type PaginatedResponse<T> = {
  items: T[] | null;
  page: number;
  per_page: number;
  total: number;
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

export type TransactionListFilters = {
  from?: string;
  kategori?: string;
  page?: number;
  perPage?: number;
  search?: string;
  tipe?: "IN" | "OUT";
  to?: string;
};

export type CreateTransactionInput = {
  categoryName: string;
  description: string;
  transactionType: "expense" | "income";
  amount: number;
};

export const backendTransactionCategories = [
  { color: "#f97316", icon: "food", name: "Makan" },
  { color: "#3b82f6", icon: "transport", name: "Transport" },
  { color: "#64748b", icon: "bills", name: "Tagihan" },
  { color: "#ec4899", icon: "shopping", name: "Belanja" },
  { color: "#22c55e", icon: "salary", name: "Pemasukan" },
  { color: "#a3a3a3", icon: "other", name: "Lainnya" },
] as const;

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

export async function getMonthlyTransactions(
  date = new Date().toISOString().slice(0, 10)
) {
  const report = await apiRequest<PeriodReportResponse>(
    `/report?period=monthly&date=${encodeURIComponent(date)}`
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
    ? `/transactions?${query.toString()}`
    : "/transactions";
  const response = await apiRequest<PaginatedResponse<BackendTransaction>>(path);
  const items = response.items ?? [];

  return {
    items: items.map(mapBackendTransactionToUi),
    page: response.page,
    perPage: response.per_page,
    total: response.total,
  };
}

export async function getTransaction(id: string) {
  const transaction = await apiRequest<BackendTransaction>(`/transactions/${id}`);
  return mapBackendTransactionToUi(transaction);
}

export async function deleteTransaction(id: string) {
  return apiRequest<null>(`/transactions/${id}`, {
    method: "DELETE",
  });
}

export async function createTransaction(input: CreateTransactionInput) {
  const transaction = await apiRequest<BackendTransaction>("/transactions", {
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
