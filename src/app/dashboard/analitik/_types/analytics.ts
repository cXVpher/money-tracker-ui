import type { ReactNode } from "react";

export interface AnalyticsMetric {
  label: string;
  tone?: string;
  value: string;
}

export interface AnalyticsSeriesPoint {
  month: string;
  balance: number;
}

export interface ChartCardProps {
  children: ReactNode;
  title: string;
}

export interface IncomeSourcePoint {
  name: string;
  value: number;
}
