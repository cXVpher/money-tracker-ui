"use client";

import type { Transaction } from "@/shared/_types";
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

function mapBackendTransactionToUi(transaction: BackendTransaction): Transaction {
  const category = getMetadataForCategory(transaction.kategori);

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

function getMetadataForCategory(name: string) {
  const norm = name.trim().toLowerCase();

  if (norm.includes("makan") || norm.includes("food")) {
    return { icon: "food", label: "Makanan & Minuman" };
  }
  if (norm.includes("transport")) {
    return { icon: "transport", label: name };
  }
  if (norm.includes("tagihan") || norm.includes("bill")) {
    return { icon: "bills", label: name };
  }
  if (norm.includes("belanja") || norm.includes("shopping")) {
    return { icon: "shopping", label: name };
  }
  if (
    norm.includes("masuk") ||
    norm.includes("gaji") ||
    norm.includes("salary") ||
    norm.includes("income") ||
    norm.includes("allowance")
  ) {
    return { icon: "salary", label: name };
  }
  if (norm.includes("kontribusi") || norm.includes("target") || norm.includes("saving")) {
    return { icon: "target", label: name };
  }

  return { icon: "other", label: name };
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
