import { MobileNav } from "@/features/dashboard-shell/_components/mobile-nav";
import { Sidebar } from "@/features/dashboard-shell/_components/sidebar";
import { Topbar } from "@/features/dashboard-shell/_components/topbar";
import { MockAuthGate } from "@/shared/_components/auth/mock-auth-gate";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MockAuthGate>
      <div className="min-h-screen bg-background text-foreground">
        <Sidebar />
        <div className="min-h-screen lg:pl-72">
          <Topbar />
          <main className="px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-10">
            {children}
          </main>
        </div>
        <MobileNav />
      </div>
    </MockAuthGate>
  );
}
