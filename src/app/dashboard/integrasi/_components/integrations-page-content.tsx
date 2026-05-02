"use client";

import { useEffect, useMemo, useState } from "react";
import { CreditCard, Gift, KeyRound, Users } from "@/shared/_components/icons/phosphor";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/_components/ui/tabs";
import { Button } from "@/shared/_components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/_components/ui/card";
import { Input } from "@/shared/_components/ui/input";
import { Label } from "@/shared/_components/ui/label";
import { Textarea } from "@/shared/_components/ui/textarea";
import { Badge } from "@/shared/_components/ui/badge";
import { USE_MOCK_DATA } from "@/shared/_config/runtime";
import { shouldUseMockFallback } from "@/shared/_utils/api-client";
import {
  createGroup,
  createGroupTransaction,
  createToken,
  createTopup,
  deleteToken,
  generateReferralCode,
  getGroupReport,
  getReferralSummary,
  inviteGroupMember,
  listGroups,
  listPayments,
  listTokens,
  type ApiTokenData,
  type GroupListItem,
  type GroupReportResponse,
  type PaymentItem,
  type ReferralSummary,
} from "@/shared/_utils/backend-user-modules-client";

const emptyReferralSummary: ReferralSummary = {
  active_referrals: 0,
  code: null,
  commission_per_user: 5000,
  pending_payout: 0,
  total_earned: 0,
  total_referrals: 0,
};

export function IntegrationsPageContent() {
  const currentMonth = useMemo(() => new Date().toISOString().slice(0, 7), []);
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [tokens, setTokens] = useState<ApiTokenData[]>([]);
  const [groups, setGroups] = useState<GroupListItem[]>([]);
  const [referralSummary, setReferralSummary] =
    useState<ReferralSummary>(emptyReferralSummary);
  const [groupReport, setGroupReport] = useState<GroupReportResponse | null>(null);
  const [pageNotice, setPageNotice] = useState<string | null>(
    USE_MOCK_DATA
      ? "Mode mock aktif. Halaman ini siap pakai dan akan mencoba endpoint asli saat API dinyalakan."
      : null
  );
  const [isLoading, setIsLoading] = useState(!USE_MOCK_DATA);

  const [topupAmount, setTopupAmount] = useState("");
  const [topupDescription, setTopupDescription] = useState("");
  const [topupProof, setTopupProof] = useState<File | null>(null);
  const [tokenName, setTokenName] = useState("");
  const [groupName, setGroupName] = useState("");
  const [inviteGroupId, setInviteGroupId] = useState("");
  const [invitePhone, setInvitePhone] = useState("");
  const [groupTransaction, setGroupTransaction] = useState({
    amount: "",
    categoryName: "Lainnya",
    description: "",
    groupId: "",
    transactionType: "OUT" as "IN" | "OUT",
  });
  const [groupReportGroupId, setGroupReportGroupId] = useState("");
  const [groupReportMonth, setGroupReportMonth] = useState(currentMonth);

  useEffect(() => {
    if (USE_MOCK_DATA) {
      return;
    }

    let isActive = true;

    async function loadData() {
      try {
        const [paymentData, tokenData, groupData, referralData] = await Promise.all([
          listPayments(),
          listTokens(),
          listGroups(),
          getReferralSummary(),
        ]);

        if (!isActive) {
          return;
        }

        setPayments(paymentData.items);
        setTokens(tokenData);
        setGroups(groupData);
        setReferralSummary(referralData);
        setPageNotice(null);
      } catch (error) {
        if (!isActive) {
          return;
        }

        if (shouldUseMockFallback(error)) {
          setPageNotice(
            "API integrasi belum aktif penuh. Kamu masih bisa cek UI dan form dari halaman ini."
          );
        } else {
          setPageNotice(error instanceof Error ? error.message : "Gagal memuat modul integrasi.");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadData();

    return () => {
      isActive = false;
    };
  }, []);

  async function handleCreateTopup() {
    const parsedAmount = Number(topupAmount);

    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Nominal top up harus lebih besar dari 0.");
      return;
    }

    try {
      const response = await createTopup({
        amount: parsedAmount,
        description: topupDescription,
        proof: topupProof,
      });
      setPayments((current) => [
        {
          amount: response.amount,
          created_at: new Date().toISOString(),
          description: topupDescription || response.message,
          id: response.payment_id,
          status: response.status,
          type: "topup",
          user_id: "me",
        },
        ...current,
      ]);
      setTopupAmount("");
      setTopupDescription("");
      setTopupProof(null);
      toast.success(response.message);
    } catch (error) {
      if (shouldUseMockFallback(error)) {
        setPayments((current) => [
          {
            amount: parsedAmount,
            created_at: new Date().toISOString(),
            description: topupDescription || "Top up lokal",
            id: `local-pay-${Date.now()}`,
            status: "pending",
            type: "topup",
            user_id: "mock-user",
          },
          ...current,
        ]);
        toast.warning("API top up belum aktif. Request disimpan di daftar lokal.");
        setTopupAmount("");
        setTopupDescription("");
        setTopupProof(null);
        return;
      }

      toast.error(error instanceof Error ? error.message : "Gagal membuat top up.");
    }
  }

  async function handleCreateToken() {
    if (!tokenName.trim()) {
      toast.error("Nama token wajib diisi.");
      return;
    }

    try {
      const token = await createToken(tokenName.trim());
      setTokens((current) => [token, ...current]);
      setTokenName("");
      toast.success("Token API berhasil dibuat.");
    } catch (error) {
      if (shouldUseMockFallback(error)) {
        setTokens((current) => [
          {
            created_at: new Date().toISOString(),
            id: `local-token-${Date.now()}`,
            name: tokenName.trim(),
            token: `ft_local_${Date.now()}`,
            user_id: "mock-user",
          },
          ...current,
        ]);
        setTokenName("");
        toast.warning("API token belum aktif. Token sementara dibuat di lokal.");
        return;
      }

      toast.error(error instanceof Error ? error.message : "Gagal membuat token.");
    }
  }

  async function handleDeleteToken(id: string) {
    try {
      await deleteToken(id);
      setTokens((current) => current.filter((token) => token.id !== id));
      toast.success("Token berhasil dihapus.");
    } catch (error) {
      if (shouldUseMockFallback(error)) {
        setTokens((current) => current.filter((token) => token.id !== id));
        toast.warning("API hapus token belum aktif. Daftar lokal tetap diperbarui.");
        return;
      }

      toast.error(error instanceof Error ? error.message : "Gagal menghapus token.");
    }
  }

  async function handleCreateGroup() {
    if (!groupName.trim()) {
      toast.error("Nama grup wajib diisi.");
      return;
    }

    try {
      const group = await createGroup(groupName.trim());
      setGroups((current) => [
        {
          id: group.id,
          member_count: group.members.length,
          name: group.name,
          role: "owner",
        },
        ...current,
      ]);
      setGroupName("");
      toast.success("Grup berhasil dibuat.");
    } catch (error) {
      if (shouldUseMockFallback(error)) {
        setGroups((current) => [
          {
            id: `local-group-${Date.now()}`,
            member_count: 1,
            name: groupName.trim(),
            role: "owner",
          },
          ...current,
        ]);
        setGroupName("");
        toast.warning("API grup belum aktif. Grup lokal ditambahkan ke tampilan.");
        return;
      }

      toast.error(error instanceof Error ? error.message : "Gagal membuat grup.");
    }
  }

  async function handleInviteMember() {
    if (!inviteGroupId || !invitePhone.trim()) {
      toast.error("Pilih grup dan isi nomor anggota.");
      return;
    }

    try {
      await inviteGroupMember(inviteGroupId, invitePhone.trim());
      setInvitePhone("");
      toast.success("Undangan anggota berhasil dikirim.");
    } catch (error) {
      if (shouldUseMockFallback(error)) {
        setInvitePhone("");
        toast.warning("API invite belum aktif. Form sudah siap dipakai saat API hidup.");
        return;
      }

      toast.error(error instanceof Error ? error.message : "Gagal mengundang anggota.");
    }
  }

  async function handleCreateGroupTransaction() {
    const parsedAmount = Number(groupTransaction.amount);

    if (!groupTransaction.groupId || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Lengkapi grup dan nominal transaksi.");
      return;
    }

    if (!groupTransaction.description.trim()) {
      toast.error("Deskripsi transaksi grup wajib diisi.");
      return;
    }

    try {
      await createGroupTransaction({
        amount: parsedAmount,
        categoryName: groupTransaction.categoryName,
        description: groupTransaction.description,
        groupId: groupTransaction.groupId,
        transactionType: groupTransaction.transactionType,
      });
      setGroupTransaction({
        amount: "",
        categoryName: "Lainnya",
        description: "",
        groupId: "",
        transactionType: "OUT",
      });
      toast.success("Transaksi grup berhasil dibuat.");
    } catch (error) {
      if (shouldUseMockFallback(error)) {
        setGroupTransaction({
          amount: "",
          categoryName: "Lainnya",
          description: "",
          groupId: "",
          transactionType: "OUT",
        });
        toast.warning("API transaksi grup belum aktif. Form tetap sudah terhubung.");
        return;
      }

      toast.error(
        error instanceof Error ? error.message : "Gagal membuat transaksi grup."
      );
    }
  }

  async function handleLoadGroupReport() {
    if (!groupReportGroupId) {
      toast.error("Pilih grup untuk melihat report.");
      return;
    }

    try {
      const report = await getGroupReport(groupReportGroupId, groupReportMonth);
      setGroupReport(report);
      toast.success("Report grup berhasil dimuat.");
    } catch (error) {
      if (shouldUseMockFallback(error)) {
        const group = groups.find((item) => item.id === groupReportGroupId);
        setGroupReport({
          by_kategori: null,
          by_member: null,
          group_name: group?.name ?? "Grup Lokal",
          month: groupReportMonth,
          total_out: 0,
        });
        toast.warning("API report grup belum aktif. Menampilkan placeholder lokal.");
        return;
      }

      toast.error(error instanceof Error ? error.message : "Gagal memuat report grup.");
    }
  }

  async function handleGenerateReferral() {
    try {
      const response = await generateReferralCode();
      setReferralSummary((current) => ({
        ...current,
        code: response.code,
      }));
      toast.success("Kode referral baru berhasil dibuat.");
    } catch (error) {
      if (shouldUseMockFallback(error)) {
        setReferralSummary((current) => ({
          ...current,
          code: `MOCK${String(Date.now()).slice(-4)}`,
        }));
        toast.warning("API referral belum aktif. Kode dummy ditampilkan di lokal.");
        return;
      }

      toast.error(error instanceof Error ? error.message : "Gagal membuat kode referral.");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">
          Pembayaran, token, grup, dan referral
        </p>
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight">
          Integrasi
        </h1>
      </div>

      {pageNotice ? (
        <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          {pageNotice}
        </div>
      ) : null}

      <Tabs defaultValue="payments">
        <TabsList variant="line">
          <TabsTrigger value="payments">
            <CreditCard className="h-4 w-4" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="tokens">
            <KeyRound className="h-4 w-4" />
            Tokens
          </TabsTrigger>
          <TabsTrigger value="groups">
            <Users className="h-4 w-4" />
            Groups
          </TabsTrigger>
          <TabsTrigger value="referral">
            <Gift className="h-4 w-4" />
            Referral
          </TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Up</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="topup-amount">Nominal</Label>
                <Input
                  id="topup-amount"
                  value={topupAmount}
                  onChange={(event) => setTopupAmount(event.target.value)}
                  placeholder="85000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="topup-proof">Bukti transfer</Label>
                <Input
                  id="topup-proof"
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={(event) =>
                    setTopupProof(event.target.files?.[0] ?? null)
                  }
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="topup-description">Deskripsi</Label>
                <Textarea
                  id="topup-description"
                  value={topupDescription}
                  onChange={(event) => setTopupDescription(event.target.value)}
                  placeholder="Contoh: top up 3 bulan"
                />
              </div>
              <div className="sm:col-span-2">
                <Button onClick={handleCreateTopup}>Kirim Top Up</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Riwayat Pembayaran</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {payments.length ? (
                payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-3"
                  >
                    <div>
                      <p className="font-medium">
                        {payment.description || "Pembayaran tanpa deskripsi"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {payment.type} • {new Date(payment.created_at).toLocaleString("id-ID")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        Rp{payment.amount.toLocaleString("id-ID")}
                      </p>
                      <Badge variant="outline">{payment.status}</Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  {isLoading ? "Memuat pembayaran..." : "Belum ada pembayaran."}
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tokens" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Buat API Token</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 sm:flex-row">
              <Input
                value={tokenName}
                onChange={(event) => setTokenName(event.target.value)}
                placeholder="Mis. iOS Shortcut"
              />
              <Button onClick={handleCreateToken}>Tambah Token</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Daftar Token</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tokens.length ? (
                tokens.map((token) => (
                  <div
                    key={token.id}
                    className="space-y-3 rounded-lg border border-border p-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-medium">{token.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Dibuat {new Date(token.created_at).toLocaleString("id-ID")}
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteToken(token.id)}
                      >
                        Hapus
                      </Button>
                    </div>
                    <pre className="overflow-x-auto rounded-lg bg-muted p-3 text-xs">
                      {token.token}
                    </pre>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  Belum ada token API.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="groups" className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Buat Grup</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 sm:flex-row">
                <Input
                  value={groupName}
                  onChange={(event) => setGroupName(event.target.value)}
                  placeholder="Mis. Keluarga"
                />
                <Button onClick={handleCreateGroup}>Tambah Grup</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Undang Anggota</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <select
                  value={inviteGroupId}
                  onChange={(event) => setInviteGroupId(event.target.value)}
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none"
                >
                  <option value="">Pilih grup</option>
                  {groups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
                <Input
                  value={invitePhone}
                  onChange={(event) => setInvitePhone(event.target.value)}
                  placeholder="628123456789"
                />
                <Button onClick={handleInviteMember}>Kirim Undangan</Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <Card>
              <CardHeader>
                <CardTitle>Transaksi Grup</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <select
                  value={groupTransaction.groupId}
                  onChange={(event) =>
                    setGroupTransaction((current) => ({
                      ...current,
                      groupId: event.target.value,
                    }))
                  }
                  className="h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none"
                >
                  <option value="">Pilih grup</option>
                  {groups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
                <Input
                  value={groupTransaction.amount}
                  onChange={(event) =>
                    setGroupTransaction((current) => ({
                      ...current,
                      amount: event.target.value,
                    }))
                  }
                  placeholder="150000"
                />
                <Input
                  value={groupTransaction.categoryName}
                  onChange={(event) =>
                    setGroupTransaction((current) => ({
                      ...current,
                      categoryName: event.target.value,
                    }))
                  }
                  placeholder="Kategori"
                />
                <select
                  value={groupTransaction.transactionType}
                  onChange={(event) =>
                    setGroupTransaction((current) => ({
                      ...current,
                      transactionType: event.target.value as "IN" | "OUT",
                    }))
                  }
                  className="h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none"
                >
                  <option value="OUT">Pengeluaran</option>
                  <option value="IN">Pemasukan</option>
                </select>
                <div className="sm:col-span-2">
                  <Textarea
                    value={groupTransaction.description}
                    onChange={(event) =>
                      setGroupTransaction((current) => ({
                        ...current,
                        description: event.target.value,
                      }))
                    }
                    placeholder="Deskripsi transaksi grup"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Button onClick={handleCreateGroupTransaction}>
                    Simpan Transaksi Grup
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Daftar Grup</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {groups.length ? (
                  groups.map((group) => (
                    <div
                      key={group.id}
                      className="flex items-center justify-between rounded-lg border border-border p-3"
                    >
                      <div>
                        <p className="font-medium">{group.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Role {group.role} • {group.member_count} anggota
                        </p>
                      </div>
                      <Badge variant="outline">{group.id}</Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Belum ada grup.</p>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Report Grup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-[1fr_220px_auto]">
                <select
                  value={groupReportGroupId}
                  onChange={(event) => setGroupReportGroupId(event.target.value)}
                  className="h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none"
                >
                  <option value="">Pilih grup</option>
                  {groups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
                <Input
                  value={groupReportMonth}
                  onChange={(event) => setGroupReportMonth(event.target.value)}
                  placeholder="2026-04"
                />
                <Button onClick={handleLoadGroupReport}>Lihat Report</Button>
              </div>
              {groupReport ? (
                <div className="space-y-3 rounded-lg border border-border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium">{groupReport.group_name}</p>
                      <p className="text-xs text-muted-foreground">
                        Periode {groupReport.month}
                      </p>
                    </div>
                    <Badge variant="outline">
                      Total keluar Rp{groupReport.total_out.toLocaleString("id-ID")}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {(groupReport.by_member ?? []).length ? (
                      groupReport.by_member?.map((member) => (
                        <div
                          key={`${member.phone}-${member.name}`}
                          className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2"
                        >
                          <span>
                            {member.name} • {member.phone}
                          </span>
                          <span>
                            Rp{member.total.toLocaleString("id-ID")} ({member.percent}%)
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Belum ada kontribusi anggota pada periode ini.
                      </p>
                    )}
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="referral" className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Ringkasan Referral</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                <MetricRow label="Kode aktif" value={referralSummary.code ?? "-"} />
                <MetricRow
                  label="Komisi per user"
                  value={`Rp${referralSummary.commission_per_user.toLocaleString("id-ID")}`}
                />
                <MetricRow
                  label="Total referral"
                  value={String(referralSummary.total_referrals)}
                />
                <MetricRow
                  label="Referral aktif"
                  value={String(referralSummary.active_referrals)}
                />
                <MetricRow
                  label="Pending payout"
                  value={`Rp${referralSummary.pending_payout.toLocaleString("id-ID")}`}
                />
                <MetricRow
                  label="Total earned"
                  value={`Rp${referralSummary.total_earned.toLocaleString("id-ID")}`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Generate Kode Referral</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Buat kode referral baru untuk dibagikan ke calon pengguna.
                </p>
                <Button onClick={handleGenerateReferral}>Generate Kode</Button>
                {referralSummary.code ? (
                  <pre className="overflow-x-auto rounded-lg bg-muted p-3 text-xs">
                    {referralSummary.code}
                  </pre>
                ) : null}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}

