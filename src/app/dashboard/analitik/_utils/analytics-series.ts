import type {
  AnalyticsChangeMetric,
  AnalyticsSeriesPoint,
  IncomeSourceDatum,
} from "../_types/analytics";

export const accountBalanceSeries: AnalyticsSeriesPoint[] = [
  { month: "Nov", balance: 14_500_000 },
  { month: "Des", balance: 16_800_000 },
  { month: "Jan", balance: 19_200_000 },
  { month: "Feb", balance: 21_450_000 },
  { month: "Mar", balance: 23_100_000 },
  { month: "Apr", balance: 24_150_000 },
];

export const incomeSourceBreakdown: IncomeSourceDatum[] = [
  { name: "Gaji", amount: 12_000_000 },
  { name: "Freelance", amount: 3_500_000 },
  { name: "Lainnya", amount: 500_000 },
];

export const monthOverMonthChangeMetrics: AnalyticsChangeMetric[] = [
  { label: "Pemasukan", changeLabel: "+3.1%" },
  { label: "Pengeluaran", changeLabel: "-28.4%" },
  { label: "Net Cashflow", changeLabel: "+41.8%" },
];
