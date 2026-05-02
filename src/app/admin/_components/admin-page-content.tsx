"use client";

import { useMemo, useState } from "react";
import { Shield } from "@/shared/_components/icons/phosphor";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/_components/ui/tabs";
import { Badge } from "@/shared/_components/ui/badge";
import { Button } from "@/shared/_components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/_components/ui/card";
import { Input } from "@/shared/_components/ui/input";
import { Label } from "@/shared/_components/ui/label";
import { USE_MOCK_DATA } from "@/shared/_config/runtime";
import { shouldUseMockFallback } from "@/shared/_utils/api-client";
import {
  addAdminUserBalance,
  adminLogin,
  createAdminReferralPayout,
  getAdminDashboard,
  getAdminLogs,
  getAdminReferralOverview,
  getAdminRevenue,
  getAdminUserDetail,
  listAdminPayments,
  listAdminUsers,
  rejectAdminPayment,
  updateAdminUserStatus,
  verifyAdminPayment,
  type AdminDashboardStats,
  type AdminLogItem,
  type AdminPaymentItem,
  type AdminSession,
  type AdminUserDetail,
  type AdminUserListParams,
  type AdminUserListItem,
  type AdminRevenue,
} from "@/shared/_utils/backend-admin-client";

const ADMIN_USER_PER_PAGE = 5;

export function AdminPageContent() {
  const currentMonth = useMemo(() => new Date().toISOString().slice(0, 7), []);
  const [session, setSession] = useState<AdminSession | null>(null);
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin12345");
  const [userSearch, setUserSearch] = useState("");
  const [userStatus, setUserStatus] =
    useState<AdminUserListParams["status"]>("");
  const [userSort, setUserSort] =
    useState<NonNullable<AdminUserListParams["sort"]>>("created_at");
  const [userOrder, setUserOrder] =
    useState<NonNullable<AdminUserListParams["order"]>>("desc");
  const [userPage, setUserPage] = useState(1);
  const [userTotal, setUserTotal] = useState(0);
  const [payoutCode, setPayoutCode] = useState("");
  const [payoutPeriod, setPayoutPeriod] = useState(currentMonth);
  const [pageNotice, setPageNotice] = useState<string | null>(
    USE_MOCK_DATA
      ? "Mode mock aktif. Halaman admin akan aktif penuh saat backend admin tersedia."
      : null
  );
  const [dashboard, setDashboard] = useState<AdminDashboardStats | null>(null);
  const [users, setUsers] = useState<AdminUserListItem[]>([]);
  const [selectedUserDetail, setSelectedUserDetail] =
    useState<AdminUserDetail | null>(null);
  const [payments, setPayments] = useState<AdminPaymentItem[]>([]);
  const [revenue, setRevenue] = useState<AdminRevenue | null>(null);
  const [referralOverview, setReferralOverview] =
    useState<Record<string, unknown> | null>(null);
  const [logs, setLogs] = useState<AdminLogItem[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const userPageCount = Math.max(1, Math.ceil(userTotal / ADMIN_USER_PER_PAGE));

  async function handleAdminLogin() {
    if (!username.trim() || !password.trim()) {
      toast.error("Username dan password admin wajib diisi.");
      return;
    }

    try {
      const nextSession = await adminLogin(username.trim(), password.trim());
      setSession(nextSession);
      toast.success("Login admin berhasil.");
      await loadAdminData(nextSession.accessToken, { page: 1 });
    } catch (error) {
      if (shouldUseMockFallback(error)) {
        setPageNotice(
          "Admin API belum aktif. UI admin sudah siap dan bisa dites lagi saat backend menyala."
        );
        toast.warning("Admin API belum aktif.");
        return;
      }

      toast.error(error instanceof Error ? error.message : "Login admin gagal.");
    }
  }

  async function loadAdminData(
    token = session?.accessToken,
    userListParams: Partial<AdminUserListParams> = {}
  ) {
    if (!token) {
      return;
    }

    setIsLoadingData(true);

    try {
      const nextUserPage = userListParams.page ?? userPage;
      const [dashboardData, userData, paymentData, revenueData, referralData, logData] =
        await Promise.all([
          getAdminDashboard(token),
          listAdminUsers(token, {
            order: userListParams.order ?? userOrder,
            page: nextUserPage,
            perPage: ADMIN_USER_PER_PAGE,
            search: userListParams.search ?? userSearch,
            sort: userListParams.sort ?? userSort,
            status: userListParams.status ?? userStatus,
          }),
          listAdminPayments(token, { page: 1, perPage: 20 }),
          getAdminRevenue(token, currentMonth),
          getAdminReferralOverview(token),
          getAdminLogs(token, { page: 1, perPage: 20 }),
        ]);

      setDashboard(dashboardData);
      setUsers(userData.items);
      setUserPage(userData.page);
      setUserTotal(userData.total);
      setPayments(paymentData.items);
      setRevenue(revenueData);
      setReferralOverview(referralData);
      setLogs(logData.items);
      setPageNotice(null);
    } catch (error) {
      if (shouldUseMockFallback(error)) {
        setPageNotice("Admin API masih belum aktif penuh. Data admin belum bisa dimuat.");
        return;
      }

      toast.error(error instanceof Error ? error.message : "Gagal memuat data admin.");
    } finally {
      setIsLoadingData(false);
    }
  }

  async function handleSearchUsers() {
    if (!session?.accessToken) {
      return;
    }

    await loadAdminData(session.accessToken, { page: 1 });
  }

  async function handleUserPageChange(nextPage: number) {
    if (!session?.accessToken || nextPage < 1 || nextPage > userPageCount) {
      return;
    }

    await loadAdminData(session.accessToken, { page: nextPage });
  }

  async function handleSelectUser(userId: string) {
    if (!session?.accessToken) {
      return;
    }

    try {
      const detail = await getAdminUserDetail(session.accessToken, userId);
      setSelectedUserDetail(detail);
    } catch (error) {
      if (shouldUseMockFallback(error)) {
        toast.warning("Detail user admin belum tersedia saat API mati.");
        return;
      }

      toast.error(error instanceof Error ? error.message : "Gagal memuat detail user.");
    }
  }

  async function handleToggleUser(user: AdminUserListItem) {
    if (!session?.accessToken) {
      return;
    }

    const reason = window.prompt(
      user.is_active ? "Alasan menonaktifkan user?" : "Alasan mengaktifkan user lagi?"
    );

    if (reason == null) {
      return;
    }

    try {
      await updateAdminUserStatus(session.accessToken, {
        isActive: !user.is_active,
        reason,
        userId: user.id,
      });
      setUsers((current) =>
        current.map((item) =>
          item.id === user.id ? { ...item, is_active: !item.is_active } : item
        )
      );
      if (selectedUserDetail?.user.id === user.id) {
        setSelectedUserDetail((current) =>
          current
            ? {
                ...current,
                user: { ...current.user, is_active: !current.user.is_active },
              }
            : current
        );
      }
      toast.success("Status user berhasil diubah.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal mengubah status user.");
    }
  }

  async function handleAddBalance(user: AdminUserListItem) {
    if (!session?.accessToken) {
      return;
    }

    const amountInput = window.prompt("Nominal balance yang ingin ditambahkan?");
    if (!amountInput) {
      return;
    }

    const description = window.prompt("Deskripsi top up admin?") ?? "Manual top-up by admin";
    const parsedAmount = Number(amountInput);

    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Nominal balance tidak valid.");
      return;
    }

    try {
      const response = await addAdminUserBalance(session.accessToken, {
        amount: parsedAmount,
        description,
        userId: user.id,
      });
      setUsers((current) =>
        current.map((item) =>
          item.id === user.id ? { ...item, balance: response.new_balance } : item
        )
      );
      toast.success("Balance user berhasil ditambahkan.");
      if (selectedUserDetail?.user.id === user.id) {
        await handleSelectUser(user.id);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menambah balance user.");
    }
  }

  async function handleVerifyPayment(paymentId: string) {
    if (!session?.accessToken) {
      return;
    }

    try {
      await verifyAdminPayment(session.accessToken, paymentId);
      setPayments((current) =>
        current.map((payment) =>
          payment.id === paymentId ? { ...payment, status: "verified" } : payment
        )
      );
      toast.success("Pembayaran berhasil diverifikasi.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal verifikasi pembayaran.");
    }
  }

  async function handleRejectPayment(paymentId: string) {
    if (!session?.accessToken) {
      return;
    }

    const reason = window.prompt("Alasan reject pembayaran?");
    if (reason == null) {
      return;
    }

    try {
      await rejectAdminPayment(session.accessToken, { paymentId, reason });
      setPayments((current) =>
        current.map((payment) =>
          payment.id === paymentId ? { ...payment, status: "rejected" } : payment
        )
      );
      toast.success("Pembayaran berhasil ditolak.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menolak pembayaran.");
    }
  }

  async function handleCreateReferralPayout() {
    if (!session?.accessToken) {
      return;
    }

    if (!payoutCode.trim() || !payoutPeriod.trim()) {
      toast.error("Referral code dan periode payout wajib diisi.");
      return;
    }

    try {
      const result = await createAdminReferralPayout(session.accessToken, {
        period: payoutPeriod.trim(),
        referralCode: payoutCode.trim(),
      });
      toast.success(
        `Payout referral tercatat: ${JSON.stringify(result)}`
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal mencatat payout referral."
      );
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">
          Surface admin untuk user, payment, revenue, referral, dan logs
        </p>
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight">
          Admin
        </h1>
      </div>

      {pageNotice ? (
        <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          {pageNotice}
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Sesi Admin
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-[1fr_1fr_auto_auto]">
          <div className="space-y-2">
            <Label htmlFor="admin-username">Username</Label>
            <Input
              id="admin-username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <div className="flex items-end">
            <Button onClick={handleAdminLogin}>Login Admin</Button>
          </div>
          <div className="flex items-end">
            <Button
              variant="outline"
              disabled={!session || isLoadingData}
              onClick={() => void loadAdminData()}
            >
              {isLoadingData ? "Memuat..." : "Refresh Data"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {session ? (
        <Tabs defaultValue="overview">
          <TabsList variant="line">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatTile label="Total user" value={String(dashboard?.total_users ?? 0)} />
              <StatTile label="User aktif" value={String(dashboard?.active_users ?? 0)} />
              <StatTile
                label="Pending payment"
                value={String(dashboard?.pending_payments ?? 0)}
              />
              <StatTile
                label="Net profit"
                value={`Rp${(dashboard?.net_profit ?? 0).toLocaleString("id-ID")}`}
              />
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <JsonCard title="Dashboard Stats" data={dashboard} />
              <JsonCard title="Revenue" data={revenue} />
              <JsonCard title="Referral Overview" data={referralOverview} />
              <Card>
                <CardHeader>
                  <CardTitle>Referral Payout</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    value={payoutCode}
                    onChange={(event) => setPayoutCode(event.target.value)}
                    placeholder="Kode referral"
                  />
                  <Input
                    value={payoutPeriod}
                    onChange={(event) => setPayoutPeriod(event.target.value)}
                    placeholder="2026-04"
                  />
                  <Button onClick={handleCreateReferralPayout}>Catat Payout</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Daftar User</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Input
                    value={userSearch}
                    onChange={(event) => setUserSearch(event.target.value)}
                    placeholder="Cari nama / phone / email"
                  />
                  <select
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                    value={userStatus}
                    onChange={(event) =>
                      setUserStatus(event.target.value as AdminUserListParams["status"])
                    }
                  >
                    <option value="">Semua status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                  <select
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                    value={userSort}
                    onChange={(event) =>
                      setUserSort(
                        event.target.value as NonNullable<AdminUserListParams["sort"]>
                      )
                    }
                  >
                    <option value="created_at">Terbaru</option>
                    <option value="name">Nama</option>
                    <option value="phone">Phone</option>
                    <option value="balance">Balance</option>
                  </select>
                  <select
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                    value={userOrder}
                    onChange={(event) =>
                      setUserOrder(
                        event.target.value as NonNullable<AdminUserListParams["order"]>
                      )
                    }
                  >
                    <option value="desc">Desc</option>
                    <option value="asc">Asc</option>
                  </select>
                  <Button
                    variant="outline"
                    onClick={() => void handleSearchUsers()}
                  >
                    Cari
                  </Button>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
                  <span>
                    Menampilkan {users.length} dari {userTotal} user
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={userPage <= 1 || isLoadingData}
                      onClick={() => void handleUserPageChange(userPage - 1)}
                    >
                      Prev
                    </Button>
                    <span>
                      Page {userPage} / {userPageCount}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={userPage >= userPageCount || isLoadingData}
                      onClick={() => void handleUserPageChange(userPage + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
                <div className="space-y-3">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="space-y-3 rounded-lg border border-border p-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {user.phone} - {user.email || "tanpa email"}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">{user.is_active ? "active" : "inactive"}</Badge>
                          <Badge variant="outline">{user.plan_type}</Badge>
                          <Badge variant="outline">
                            Rp{user.balance.toLocaleString("id-ID")}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => void handleSelectUser(user.id)}
                        >
                          Detail
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => void handleToggleUser(user)}
                        >
                          {user.is_active ? "Suspend" : "Aktifkan"}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => void handleAddBalance(user)}
                        >
                          Tambah Balance
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <JsonCard title="Detail User Terpilih" data={selectedUserDetail} />
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Admin Payments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="space-y-3 rounded-lg border border-border p-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-medium">
                          {payment.user_name || payment.user_id}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {payment.description || payment.type}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">{payment.status}</Badge>
                        <Badge variant="outline">
                          Rp{payment.amount.toLocaleString("id-ID")}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        onClick={() => void handleVerifyPayment(payment.id)}
                      >
                        Verify
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => void handleRejectPayment(payment.id)}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs">
            <JsonCard title="Admin Logs" data={logs} />
          </TabsContent>
        </Tabs>
      ) : null}
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="space-y-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}

function JsonCard({
  data,
  title,
}: {
  data: unknown;
  title: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="max-h-[420px] overflow-auto rounded-lg bg-muted p-3 text-xs">
          {JSON.stringify(data ?? null, null, 2)}
        </pre>
      </CardContent>
    </Card>
  );
}

