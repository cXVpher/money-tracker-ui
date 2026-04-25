import type { AnalyticsMetric, AnalyticsSeriesPoint, IncomeSourcePoint } from "../_types/analytics";

export const accountGrowth: AnalyticsSeriesPoint[] = [
  { month: "Nov", balance: 14_500_000 },
  { month: "Des", balance: 16_800_000 },
  { month: "Jan", balance: 19_200_000 },
  { month: "Feb", balance: 21_450_000 },
  { month: "Mar", balance: 23_100_000 },
  { month: "Apr", balance: 24_150_000 },
];

export const incomeSources: IncomeSourcePoint[] = [
  { name: "Gaji", value: 12_000_000 },
  { name: "Freelance", value: 3_500_000 },
  { name: "Lainnya", value: 500_000 },
];

export const monthOverMonthMetrics: AnalyticsMetric[] = [
  { label: "Pemasukan", value: "+3.1%" },
  { label: "Pengeluaran", value: "-28.4%" },
  { label: "Net Cashflow", value: "+41.8%" },
];
