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

export async function getDashboardOverviewData(
  month = new Date().toISOString().slice(0, 7)
): Promise<DashboardOverviewData> {
  const today = new Date().toISOString().slice(0, 10);
  const [summary, chart, report] = await Promise.all([
    apiRequest<DashboardSummaryResponse>(
      `/dashboard/summary?month=${encodeURIComponent(month)}`
    ),
    apiRequest<DashboardChartResponse>(
      `/dashboard/chart?month=${encodeURIComponent(month)}`
    ),
    apiRequest<PeriodReportResponse>(
      `/report?period=monthly&date=${encodeURIComponent(today)}`
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
