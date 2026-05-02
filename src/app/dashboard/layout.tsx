import { DashboardShell } from "@/features/dashboard-shell/_components/dashboard-shell";
import { MockAuthGate } from "@/shared/_components/auth/mock-auth-gate";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MockAuthGate>
      <DashboardShell>{children}</DashboardShell>
    </MockAuthGate>
  );
}
