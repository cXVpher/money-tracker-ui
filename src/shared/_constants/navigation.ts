export const NAV_ITEMS = [
  { label: "Fitur", href: "#fitur" },
  { label: "Perbandingan", href: "#perbandingan" },
  { label: "Harga", href: "#harga" },
  { label: "FAQ", href: "#faq" },
] as const;

export const DASHBOARD_NAV = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Transaksi", href: "/dashboard/transaksi", icon: "ArrowLeftRight" },
  { label: "Akun", href: "/dashboard/akun", icon: "Wallet" },
  { label: "Budget", href: "/dashboard/budget", icon: "PieChart" },
  { label: "Target", href: "/dashboard/target", icon: "Target" },
  { label: "Analitik", href: "/dashboard/analitik", icon: "BarChart3" },
  { label: "Hutang", href: "/dashboard/hutang", icon: "HandCoins" },
  { label: "Kalender", href: "/dashboard/kalender", icon: "CalendarDays" },
] as const;
