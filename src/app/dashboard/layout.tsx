import { DashboardShell } from "@/features/dashboard-shell/_components/dashboard-shell";

import { getUserRoleFromCookie, isAdminRole } from "@/shared/_utils/jwt-server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const hasAccessToken = cookieStore.has("user_access_token");
  const hasRefreshToken = cookieStore.has("user_refresh_token");
  const hasAdminAccessToken = cookieStore.has("admin_access_token");
  const hasAdminRefreshToken = cookieStore.has("admin_refresh_token");

  if (
    !hasAccessToken &&
    !hasRefreshToken &&
    !hasAdminAccessToken &&
    !hasAdminRefreshToken
  ) {
    redirect("/login");
  }

  const role = await getUserRoleFromCookie();

  if (isAdminRole(role)) {
    return <>{children}</>;
  }

  return <DashboardShell>{children}</DashboardShell>;
}
