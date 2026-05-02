"use client";

import { useMemo, useState } from "react";
import {
  Bell,
  Check,
  CreditCard,
  Gift,
  Moon,
  Search,
  Shield,
  Sun,
  TrendingUp,
  Users,
  X,
} from "@/shared/_components/icons/phosphor";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/_components/ui/tabs";
import { Badge } from "@/shared/_components/ui/badge";
import { Button } from "@/shared/_components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/_components/ui/card";
import { Input } from "@/shared/_components/ui/input";
import { Label } from "@/shared/_components/ui/label";
import { useTheme } from "@/shared/_components/providers/theme-provider";
import { USE_MOCK_DATA } from "@/shared/_config/runtime";
import { shouldUseMockFallback } from "@/shared/_utils/api-client";
import { cn } from "@/shared/_utils/cn";
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
  type AdminRevenue,
  type AdminSession,
  type AdminUserDetail,
  type AdminUserListItem,
  type AdminUserListParams,
} from "@/shared/_utils/backend-admin-client";

const ADMIN_USER_PER_PAGE = 5;

export function AdminPageContent() {
  const currentMonth = useMemo(() => new Date().toISOString().slice(0, 7), []);
  const { resolvedTheme, setTheme } = useTheme();
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
      ? "Mode demo aktif. Semua data di halaman ini aman untuk dicoba."
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
  const pendingPayments = payments.filter((payment) => payment.status === "pending");
  const isDarkMode = resolvedTheme === "dark";

  async function handleAdminLogin() {
    if (!username.trim() || !password.trim()) {
      toast.error("Username dan password admin wajib diisi.");
      return;
    }

    try {
      const nextSession = await adminLogin(username.trim(), password.trim());
      setSession(nextSession);
      toast.success("Masuk sebagai admin.");
      await loadAdminData(nextSession.accessToken, { page: 1 });
    } catch (error) {
      if (shouldUseMockFallback(error)) {
        setPageNotice(
          "Admin API belum aktif. Tampilan admin tetap bisa dicoba pakai data demo."
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
      setPageNotice(USE_MOCK_DATA ? "Mode demo aktif. Data bisa berubah lokal di browser ini." : null);
    } catch (error) {
      if (shouldUseMockFallback(error)) {
        setPageNotice("Admin API belum siap penuh. Coba lagi saat backend admin menyala.");
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
        toast.warning("Detail user belum tersedia saat API mati.");
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
      user.is_active ? "Kenapa user ini dinonaktifkan?" : "Catatan aktivasi user?"
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
      toast.success("Status user sudah diperbarui.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal mengubah status user.");
    }
  }

  async function handleAddBalance(user: AdminUserListItem) {
    if (!session?.accessToken) {
      return;
    }

    const amountInput = window.prompt("Nominal saldo yang mau ditambahkan?");
    if (!amountInput) {
      return;
    }

    const description = window.prompt("Catatan top up?") ?? "Manual top-up by admin";
    const parsedAmount = Number(amountInput);

    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Nominal saldo tidak valid.");
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
      toast.success("Saldo user sudah ditambahkan.");
      if (selectedUserDetail?.user.id === user.id) {
        await handleSelectUser(user.id);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menambah saldo user.");
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
      toast.success("Pembayaran sudah disetujui.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menyetujui pembayaran.");
    }
  }

  async function handleRejectPayment(paymentId: string) {
    if (!session?.accessToken) {
      return;
    }

    const reason = window.prompt("Alasan pembayaran ditolak?");
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
      toast.success("Pembayaran sudah ditolak.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menolak pembayaran.");
    }
  }

  async function handleCreateReferralPayout() {
    if (!session?.accessToken) {
      return;
    }

    if (!payoutCode.trim() || !payoutPeriod.trim()) {
      toast.error("Kode referral dan periode payout wajib diisi.");
      return;
    }

    try {
      await createAdminReferralPayout(session.accessToken, {
        period: payoutPeriod.trim(),
        referralCode: payoutCode.trim(),
      });
      toast.success("Payout referral sudah dicatat.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal mencatat payout referral."
      );
    }
  }

  return (
    <main className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
          <div className="grid gap-6 p-6 lg:grid-cols-[1.3fr_0.7fr] lg:p-8">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="secondary" className="h-7 rounded-full px-3">
                  Area admin tersembunyi
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={() => setTheme(isDarkMode ? "light" : "dark")}
                >
                  {isDarkMode ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                  {isDarkMode ? "Light mode" : "Dark mode"}
                </Button>
              </div>
              <div className="space-y-2">
                <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight sm:text-4xl">
                  Panel Admin DuitKu
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                  Buat cek user, approve pembayaran, tambah saldo, lihat revenue,
                  dan catat payout referral tanpa perlu buka data mentah.
                </p>
              </div>
              {pageNotice ? (
                <div className="flex items-start gap-3 rounded-2xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-foreground">
                  <Bell className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{pageNotice}</span>
                </div>
              ) : null}
            </div>

            <Card className="border-primary/15 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Shield className="h-4 w-4" />
                  Masuk Admin
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
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
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button className="rounded-full" onClick={handleAdminLogin}>
                    {session ? "Masuk ulang" : "Masuk"}
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-full"
                    disabled={!session || isLoadingData}
                    onClick={() => void loadAdminData()}
                  >
                    {isLoadingData ? "Memuat..." : "Refresh data"}
                  </Button>
                </div>
                {session ? (
                  <p className="text-xs text-muted-foreground">
                    Login sebagai {session.admin.username} ({session.admin.role}).
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Isi kredensial admin dulu untuk membuka data operasional.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        {session ? (
          <Tabs defaultValue="overview" className="space-y-5">
            <TabsList variant="line" className="overflow-x-auto">
              <TabsTrigger value="overview">Ringkasan</TabsTrigger>
              <TabsTrigger value="users">User</TabsTrigger>
              <TabsTrigger value="payments">Pembayaran</TabsTrigger>
              <TabsTrigger value="activity">Aktivitas</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <StatTile
                  icon={Users}
                  label="Total user"
                  tone="emerald"
                  value={String(dashboard?.total_users ?? 0)}
                  helper={`${dashboard?.active_users ?? 0} user aktif`}
                />
                <StatTile
                  icon={CreditCard}
                  label="Butuh dicek"
                  tone="amber"
                  value={String(dashboard?.pending_payments ?? pendingPayments.length)}
                  helper="Pembayaran pending"
                />
                <StatTile
                  icon={TrendingUp}
                  label="Profit bersih"
                  tone="sky"
                  value={formatCurrency(dashboard?.net_profit ?? 0)}
                  helper={`Bulan ini ${formatCurrency(dashboard?.revenue_this_month ?? 0)}`}
                />
                <StatTile
                  icon={Gift}
                  label="Referral"
                  tone="rose"
                  value={formatCurrency(Number(referralOverview?.pending_payout ?? 0))}
                  helper="Payout menunggu"
                />
              </div>

              <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
                <Card>
                  <CardHeader>
                    <CardTitle>Yang perlu dicek hari ini</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <ActionRow
                      label="Pembayaran pending"
                      value={`${pendingPayments.length} transaksi`}
                      helper="Approve kalau bukti bayar valid."
                    />
                    <ActionRow
                      label="User nonaktif"
                      value={`${dashboard?.suspended_users ?? 0} akun`}
                      helper="Cek kalau ada komplain akses."
                    />
                    <ActionRow
                      label="Revenue bulan ini"
                      value={formatCurrency(revenue?.revenue ?? dashboard?.revenue_this_month ?? 0)}
                      helper="Angka sementara dari pembayaran verified."
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Catat payout referral</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Pakai form ini setelah referral sudah dibayar di luar sistem.
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="payout-code">Kode referral</Label>
                        <Input
                          id="payout-code"
                          value={payoutCode}
                          onChange={(event) => setPayoutCode(event.target.value)}
                          placeholder="RAKA2026"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="payout-period">Periode</Label>
                        <Input
                          id="payout-period"
                          value={payoutPeriod}
                          onChange={(event) => setPayoutPeriod(event.target.value)}
                          placeholder="2026-05"
                        />
                      </div>
                    </div>
                    <Button onClick={handleCreateReferralPayout}>
                      Simpan payout
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Kelola user</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto_auto_auto]">
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={userSearch}
                        onChange={(event) => setUserSearch(event.target.value)}
                        placeholder="Cari nama, phone, atau email"
                        className="pl-9"
                      />
                    </div>
                    <SelectField
                      value={userStatus ?? ""}
                      onChange={(value) =>
                        setUserStatus(value as AdminUserListParams["status"])
                      }
                      options={[
                        ["", "Semua status"],
                        ["active", "Aktif"],
                        ["inactive", "Nonaktif"],
                        ["suspended", "Suspended"],
                      ]}
                    />
                    <SelectField
                      value={userSort}
                      onChange={(value) =>
                        setUserSort(value as NonNullable<AdminUserListParams["sort"]>)
                      }
                      options={[
                        ["created_at", "Terbaru"],
                        ["name", "Nama"],
                        ["phone", "Phone"],
                        ["balance", "Saldo"],
                      ]}
                    />
                    <SelectField
                      value={userOrder}
                      onChange={(value) =>
                        setUserOrder(value as NonNullable<AdminUserListParams["order"]>)
                      }
                      options={[
                        ["desc", "Desc"],
                        ["asc", "Asc"],
                      ]}
                    />
                    <Button variant="outline" onClick={() => void handleSearchUsers()}>
                      Terapkan
                    </Button>
                  </div>

                  <div className="grid gap-3">
                    {users.length ? (
                      users.map((user) => (
                        <UserCard
                          key={user.id}
                          onAddBalance={() => void handleAddBalance(user)}
                          onSelect={() => void handleSelectUser(user.id)}
                          onToggle={() => void handleToggleUser(user)}
                          user={user}
                        />
                      ))
                    ) : (
                      <EmptyState title="User tidak ketemu" description="Coba ubah keyword atau filter status." />
                    )}
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
                        Sebelumnya
                      </Button>
                      <span>
                        Halaman {userPage} / {userPageCount}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={userPage >= userPageCount || isLoadingData}
                        onClick={() => void handleUserPageChange(userPage + 1)}
                      >
                        Lanjut
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <UserDetailCard detail={selectedUserDetail} />
            </TabsContent>

            <TabsContent value="payments" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Review pembayaran</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {payments.length ? (
                    payments.map((payment) => (
                      <PaymentCard
                        key={payment.id}
                        onReject={() => void handleRejectPayment(payment.id)}
                        onVerify={() => void handleVerifyPayment(payment.id)}
                        payment={payment}
                      />
                    ))
                  ) : (
                    <EmptyState title="Belum ada pembayaran" description="Payment baru akan muncul di sini." />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Aktivitas admin</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {logs.length ? (
                    logs.map((log) => (
                      <div
                        key={log.id}
                        className="rounded-2xl border border-border bg-card px-4 py-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <p className="font-medium">{humanizeAction(log.action)}</p>
                            <p className="text-xs text-muted-foreground">
                              Oleh {log.admin_username} - {formatDate(log.created_at)}
                            </p>
                          </div>
                          {log.target_type ? (
                            <Badge variant="outline">{log.target_type}</Badge>
                          ) : null}
                        </div>
                        {log.detail ? (
                          <p className="mt-2 text-sm text-muted-foreground">{log.detail}</p>
                        ) : null}
                      </div>
                    ))
                  ) : (
                    <EmptyState title="Belum ada aktivitas" description="Aksi admin akan tercatat di sini." />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <Card>
            <CardContent className="grid gap-4 p-6 text-sm text-muted-foreground md:grid-cols-3">
              <MiniGuide title="1. Masuk admin" text="Gunakan akun admin. Di mode demo, kredensial default sudah terisi." />
              <MiniGuide title="2. Cek antrean" text="Mulai dari pembayaran pending dan user yang butuh bantuan." />
              <MiniGuide title="3. Ambil aksi" text="Approve payment, tambah saldo, suspend user, atau catat payout." />
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}

function StatTile({
  helper,
  icon: Icon,
  label,
  tone,
  value,
}: {
  helper: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  tone: "amber" | "emerald" | "rose" | "sky";
  value: string;
}) {
  const toneClass = {
    amber: "bg-warning/15 text-warning-foreground dark:text-warning",
    emerald: "bg-success/15 text-success-foreground dark:text-success",
    rose: "bg-destructive/15 text-destructive",
    sky: "bg-primary/15 text-primary",
  }[tone];

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">{label}</p>
          <span className={cn("rounded-full p-2", toneClass)}>
            <Icon className="h-4 w-4" />
          </span>
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{helper}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function ActionRow({
  helper,
  label,
  value,
}: {
  helper: string;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-muted/30 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="font-medium">{label}</p>
        <Badge variant="secondary">{value}</Badge>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{helper}</p>
    </div>
  );
}

function UserCard({
  onAddBalance,
  onSelect,
  onToggle,
  user,
}: {
  onAddBalance: () => void;
  onSelect: () => void;
  onToggle: () => void;
  user: AdminUserListItem;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold">{user.name}</p>
            <StatusBadge status={user.is_active ? "active" : "inactive"} />
            <Badge variant="outline">{user.plan_type}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {user.phone} - {user.email || "tanpa email"}
          </p>
          <p className="text-sm">
            Saldo aplikasi: <span className="font-semibold">{formatCurrency(user.balance)}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={onSelect}>
            Lihat detail
          </Button>
          <Button variant="outline" size="sm" onClick={onToggle}>
            {user.is_active ? "Nonaktifkan" : "Aktifkan"}
          </Button>
          <Button size="sm" onClick={onAddBalance}>
            Tambah saldo
          </Button>
        </div>
      </div>
    </div>
  );
}

function UserDetailCard({ detail }: { detail: AdminUserDetail | null }) {
  if (!detail) {
    return (
      <EmptyState
        title="Pilih user untuk lihat detail"
        description="Klik tombol Lihat detail di daftar user."
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detail {detail.user.name}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <InfoBox label="Saldo" value={formatCurrency(detail.balance.balance)} />
        <InfoBox label="Plan" value={detail.balance.plan_type} />
        <InfoBox label="Total transaksi" value={String(detail.stats.total_transactions)} />
        <InfoBox label="WA bulan ini" value={String(detail.stats.total_wa_messages_this_month)} />
      </CardContent>
    </Card>
  );
}

function PaymentCard({
  onReject,
  onVerify,
  payment,
}: {
  onReject: () => void;
  onVerify: () => void;
  payment: AdminPaymentItem;
}) {
  const isPending = payment.status === "pending";

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold">{payment.user_name || payment.user_id}</p>
            <StatusBadge status={payment.status} />
          </div>
          <p className="text-sm text-muted-foreground">
            {payment.description || payment.type} - {formatDate(payment.created_at)}
          </p>
          <p className="text-lg font-bold">{formatCurrency(payment.amount)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" disabled={!isPending} onClick={onVerify}>
            <Check className="h-4 w-4" />
            Setujui
          </Button>
          <Button variant="destructive" size="sm" disabled={!isPending} onClick={onReject}>
            <X className="h-4 w-4" />
            Tolak
          </Button>
        </div>
      </div>
    </div>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-muted/30 p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}

function EmptyState({
  description,
  title,
}: {
  description: string;
  title: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-6 text-center">
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function MiniGuide({ text, title }: { text: string; title: string }) {
  return (
    <div className="rounded-2xl border border-border bg-muted/20 p-4">
      <p className="font-medium text-foreground">{title}</p>
      <p className="mt-1 leading-6">{text}</p>
    </div>
  );
}

function SelectField({
  onChange,
  options,
  value,
}: {
  onChange: (value: string) => void;
  options: Array<[string, string]>;
  value: string;
}) {
  return (
    <select
      className="h-10 rounded-md border border-input bg-background px-3 text-sm"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      {options.map(([optionValue, label]) => (
        <option key={optionValue || "all"} value={optionValue}>
          {label}
        </option>
      ))}
    </select>
  );
}

function StatusBadge({ status }: { status: string }) {
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus === "active" || normalizedStatus === "verified") {
    return <Badge className="bg-success text-success-foreground">{labelStatus(status)}</Badge>;
  }

  if (normalizedStatus === "pending") {
    return <Badge className="bg-warning text-warning-foreground">{labelStatus(status)}</Badge>;
  }

  if (normalizedStatus === "inactive" || normalizedStatus === "rejected") {
    return <Badge variant="destructive">{labelStatus(status)}</Badge>;
  }

  return <Badge variant="outline">{labelStatus(status)}</Badge>;
}

function labelStatus(status: string) {
  const labels: Record<string, string> = {
    active: "Aktif",
    inactive: "Nonaktif",
    pending: "Menunggu",
    rejected: "Ditolak",
    verified: "Disetujui",
  };

  return labels[status.toLowerCase()] ?? status;
}

function formatCurrency(value: number) {
  return `Rp${Intl.NumberFormat("id-ID").format(value)}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function humanizeAction(action: string) {
  return action
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
