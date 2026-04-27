import type { ReactNode } from "react";

export interface AnalyticsChangeMetric {
  label: string;
  toneClass?: string;
  changeLabel: string;
}

export interface AnalyticsSeriesPoint {
  month: string;
  balance: number;
}

export interface ChartPanelProps {
  children: ReactNode;
  title: string;
}

export interface IncomeSourceDatum {
  name: string;
  amount: number;
}
