"use client";

import { useState } from "react";
import { MobileNav } from "@/features/dashboard-shell/_components/mobile-nav";
import { Sidebar } from "@/features/dashboard-shell/_components/sidebar";
import { Topbar } from "@/features/dashboard-shell/_components/topbar";
import { cn } from "@/shared/_utils/cn";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onCollapsedChange={setIsSidebarCollapsed}
      />
      <div
        className={cn(
          "min-h-screen transition-[padding] duration-300",
          isSidebarCollapsed ? "lg:pl-20" : "lg:pl-72"
        )}
      >
        <Topbar />
        <main className="px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-10">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
