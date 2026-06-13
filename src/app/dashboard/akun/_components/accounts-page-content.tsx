"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeftRight } from "@/shared/_components/icons/phosphor";
import { toast } from "sonner";
import { APP_ICON_OPTIONS } from "@/shared/_components/icons/app-icon";
import { Button } from "@/shared/_components/ui/button";
import { EmptyState } from "@/shared/_components/ui/empty-state";
import { CardGridSkeleton } from "@/shared/_components/ui/skeleton";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/_components/ui/dialog";
import { Input } from "@/shared/_components/ui/input";
import { Label } from "@/shared/_components/ui/label";
import type { Account } from "@/shared/_types";
import {
  createAccount,
  deleteAccount,
  getAccounts,
  updateAccount,
  type CreateAccountInput,
} from "@/services/account.service";
import { AccountCard } from "./account-card";
import { AccountTotalCard } from "./account-total-card";

const accountsQueryKey = ["accounts"] as const;

type AccountEditorState = Omit<CreateAccountInput, "balance"> & {
  balance: string;
  id?: string;
};

const emptyAccountForm: AccountEditorState = {
  balance: "",
  color: "#0066AE",
  icon: "bank",
  name: "",
  type: "bank",
};

export function AccountsPageContent() {
  const queryClient = useQueryClient();
  const [accountEditor, setAccountEditor] =
    useState<AccountEditorState | null>(null);

  const accountsQuery = useQuery({
    queryFn: getAccounts,
    queryKey: accountsQueryKey,
  });

  const saveAccountMutation = useMutation({
    mutationFn: async (input: AccountEditorState) =>
      input.id
        ? updateAccount({
            color: input.color,
            icon: input.icon,
            id: input.id,
            name: input.name,
          })
        : createAccount({
            balance: Number(input.balance || 0),
            color: input.color,
            icon: input.icon,
            name: input.name,
            type: input.type,
          }),
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Gagal menyimpan akun.");
    },
    onSuccess: () => {
      setAccountEditor(null);
      toast.success("Akun berhasil disimpan.");
      void queryClient.invalidateQueries({ queryKey: accountsQueryKey });
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: deleteAccount,
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Gagal menghapus akun.");
    },
    onSuccess: () => {
      toast.success("Akun berhasil dihapus.");
      void queryClient.invalidateQueries({ queryKey: accountsQueryKey });
    },
  });

  const accounts = accountsQuery.data ?? [];
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  function openCreateDialog() {
    setAccountEditor(emptyAccountForm);
  }

  function openEditDialog(account: Account) {
    setAccountEditor({
      balance: String(account.balance),
      color: account.color,
      icon: account.icon,
      id: account.id,
      name: account.name,
      type: account.type,
    });
  }

  function handleSaveAccount() {
    if (!accountEditor?.name.trim()) {
      toast.error("Nama akun wajib diisi.");
      return;
    }

    if (!accountEditor.id && Number(accountEditor.balance || 0) < 0) {
      toast.error("Saldo awal tidak boleh negatif.");
      return;
    }

    saveAccountMutation.mutate(accountEditor);
  }

  function handleDeleteAccount(account: Account) {
    if (!window.confirm(`Hapus akun "${account.name}"?`)) {
      return;
    }

    deleteAccountMutation.mutate(account.id);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Bank, e-wallet, tunai, dan kartu kredit</p>
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight">
            Akun
          </h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="rounded-full"
            disabled
          >
            <ArrowLeftRight className="h-4 w-4" />
            Transfer
          </Button>
          <Button className="rounded-full" onClick={openCreateDialog}>
            Tambah Akun
          </Button>
        </div>
      </div>

      {accountsQuery.isError ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {accountsQuery.error instanceof Error
            ? accountsQuery.error.message
            : "Gagal memuat akun."}
        </div>
      ) : null}

      <AccountTotalCard accountCount={accounts.length} totalBalance={totalBalance} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {accountsQuery.isLoading ? (
          <CardGridSkeleton count={3} />
        ) : accounts.length ? accounts.map((account) => (
          <AccountCard
            key={account.id}
            account={account}
            onDelete={() => handleDeleteAccount(account)}
            onEdit={() => openEditDialog(account)}
          />
        )) : (
          <EmptyState
            className="md:col-span-2 xl:col-span-3"
            description="Tambahkan bank, e-wallet, tunai, atau kartu kredit agar saldo dan transaksi bisa dilacak per akun."
            title="Belum ada akun finansial"
            action={
              <Button onClick={openCreateDialog}>
                Tambah Akun
              </Button>
            }
          />
        )}
      </div>

      <Dialog
        open={accountEditor !== null}
        onOpenChange={(open) => {
          if (!open) {
            setAccountEditor(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {accountEditor?.id ? "Edit Akun" : "Tambah Akun"}
            </DialogTitle>
          </DialogHeader>
          {accountEditor ? (
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="account-name">Nama akun</Label>
                <Input
                  id="account-name"
                  value={accountEditor.name}
                  onChange={(event) =>
                    setAccountEditor((current) =>
                      current ? { ...current, name: event.target.value } : current
                    )
                  }
                />
              </div>
              {!accountEditor.id ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="account-type">Tipe</Label>
                    <select
                      id="account-type"
                      className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                      value={accountEditor.type}
                      onChange={(event) =>
                        setAccountEditor((current) =>
                          current
                            ? {
                                ...current,
                                type: event.target.value as Account["type"],
                              }
                            : current
                        )
                      }
                    >
                      <option value="bank">Bank</option>
                      <option value="ewallet">E-wallet</option>
                      <option value="cash">Tunai</option>
                      <option value="credit_card">Kartu kredit</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="account-balance">Saldo awal</Label>
                    <Input
                      id="account-balance"
                      min={0}
                      type="number"
                      value={accountEditor.balance}
                      onChange={(event) =>
                        setAccountEditor((current) =>
                          current
                            ? { ...current, balance: event.target.value }
                            : current
                        )
                      }
                    />
                  </div>
                </>
              ) : null}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="account-icon">Icon</Label>
                  <select
                    id="account-icon"
                    className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                    value={accountEditor.icon}
                    onChange={(event) =>
                      setAccountEditor((current) =>
                        current ? { ...current, icon: event.target.value } : current
                      )
                    }
                  >
                    {APP_ICON_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account-color">Warna</Label>
                  <Input
                    id="account-color"
                    type="color"
                    value={accountEditor.color}
                    onChange={(event) =>
                      setAccountEditor((current) =>
                        current ? { ...current, color: event.target.value } : current
                      )
                    }
                  />
                </div>
              </div>
            </div>
          ) : null}
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Batal</DialogClose>
            <Button
              disabled={saveAccountMutation.isPending}
              onClick={handleSaveAccount}
            >
              {saveAccountMutation.isPending ? "Menyimpan..." : "Simpan Akun"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

