import { getUserRoleFromCookie } from "@/shared/_utils/jwt-server";
import { AdminPageContent } from "@/app/admin/_components/admin-page-content";
import { UserDashboard } from "@/features/dashboard-overview/_components/user-dashboard";

export default async function DashboardPage() {
  const role = await getUserRoleFromCookie();

  if (role === "admin" || role === "super_admin") {
    return <AdminPageContent />;
  }

  return <UserDashboard />;
}
