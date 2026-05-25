import { DashboardShell } from "@/features/dashboard-shell/_components/dashboard-shell";


export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DashboardShell>{children}</DashboardShell>
  );
}
