import type { dashboardIcons } from "@/features/dashboard-shell/_utils/icon-map";

export type DashboardIconName = keyof typeof dashboardIcons;

export type DashboardNavItem = {
  label: string;
  href: string;
  icon: DashboardIconName;
};
