"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { TransactionForm } from "@/features/transactions/_components/transaction-form";
import { TransactionTable } from "@/features/transactions/_components/transaction-table";
import { USE_MOCK_DATA } from "@/shared/_config/runtime";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/_components/ui/dialog";
import type { Account, Transaction } from "@/shared/_types/finance";
import { shouldUseMockFallback } from "@/shared/_utils/api-client";
import {
  backendTransactionCategories,
  deleteTransaction,
  getTransaction,
  getTransactions,
} from "@/shared/_utils/backend-client";
import {
  getAppAccounts,
  getAppTransactions,
  getCategoryOptions,
} from "@/shared/_utils/mock-client-store";

export function TransactionsPageContent() {
  const mockAccounts = useMemo<Account[]>(() => getAppAccounts(), []);
  const mockTransactions = useMemo<Transaction[]>(() => getAppTransactions(), []);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [deletingTransactionId, setDeletingTransactionId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [fallbackNotice, setFallbackNotice] = useState<string | null>(null);
  const [isUsingBackendData, setIsUsingBackendData] = useState(false);
  const categoryOptions = useMemo(
    () =>
      USE_MOCK_DATA || !isUsingBackendData
        ? getCategoryOptions()
        : [...backendTransactionCategories],
    [isUsingBackendData]
  );

  useEffect(() => {
    if (USE_MOCK_DATA) {
      return;
    }

    let isActive = true;

    async function loadTransactions() {
      try {
        const nextTransactions = await getTransactions({ page: 1, perPage: 50 });
        if (isActive) {
          setTransactions(nextTransactions.items);
          setIsUsingBackendData(true);
          setLoadError(null);
          setFallbackNotice(null);
        }
      } catch (error) {
        if (isActive) {
          if (shouldUseMockFallback(error)) {
            setTransactions(mockTransactions);
            setIsUsingBackendData(false);
            setFallbackNotice(
              "API transaksi belum aktif. Menampilkan transaksi mock sementara."
            );
            return;
          }

          setLoadError(
            error instanceof Error
              ? error.message
              : "Gagal memuat transaksi bulan berjalan."
          );
        }
      }
    }

    void loadTransactions();

    return () => {
      isActive = false;
    };
  }, [mockTransactions]);

  async function handleViewTransaction(transaction: Transaction) {
    if (!isUsingBackendData) {
      setSelectedTransaction(transaction);
      return;
    }

    try {
      const detailedTransaction = await getTransaction(transaction.id);
      setSelectedTransaction(detailedTransaction);
    } catch (error) {
      if (shouldUseMockFallback(error)) {
        setSelectedTransaction(transaction);
        toast.warning("Detail transaksi dari API belum tersedia. Menampilkan data lokal.");
        return;
      }

      toast.error(
        error instanceof Error ? error.message : "Gagal memuat detail transaksi."
      );
    }
  }

  async function handleDeleteTransaction(transaction: Transaction) {
    if (typeof window !== "undefined") {
      const shouldDelete = window.confirm(
        `Hapus transaksi "${transaction.description}"?`
      );

      if (!shouldDelete) {
        return;
      }
    }

    setDeletingTransactionId(transaction.id);

    try {
      if (!isUsingBackendData) {
        setTransactions((currentTransactions) =>
          currentTransactions.filter((item) => item.id !== transaction.id)
        );
        toast.success("Transaksi mock dihapus dari daftar saat ini.");
        return;
      }

      await deleteTransaction(transaction.id);
      setTransactions((currentTransactions) =>
        currentTransactions.filter((item) => item.id !== transaction.id)
      );
      toast.success("Transaksi berhasil dihapus.");
    } catch (error) {
      if (shouldUseMockFallback(error)) {
        setTransactions((currentTransactions) =>
          currentTransactions.filter((item) => item.id !== transaction.id)
        );
        toast.warning("API hapus transaksi belum aktif. Daftar lokal tetap diperbarui.");
        return;
      }

      toast.error(
        error instanceof Error ? error.message : "Gagal menghapus transaksi."
      );
    } finally {
      setDeletingTransactionId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Riwayat dan pencatatan</p>
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight">
            Transaksi
          </h1>
        </div>
        <TransactionForm
          accounts={isUsingBackendData ? [] : mockAccounts}
          preferBackend={!USE_MOCK_DATA}
          categoryOptions={categoryOptions}
          onTransactionCreated={(transaction) =>
            setTransactions((currentTransactions) => [transaction, ...currentTransactions])
          }
        />
      </div>
      {fallbackNotice ? (
        <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          {fallbackNotice}
        </div>
      ) : null}
      {loadError ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {loadError}
        </div>
      ) : null}
      <TransactionTable
        accounts={isUsingBackendData ? [] : mockAccounts}
        deletingTransactionId={deletingTransactionId}
        onDeleteTransaction={handleDeleteTransaction}
        onViewTransaction={handleViewTransaction}
        transactions={transactions}
      />
      <Dialog
        open={selectedTransaction !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedTransaction(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detail Transaksi</DialogTitle>
            <DialogDescription>
              Ringkasan transaksi yang dipilih.
            </DialogDescription>
          </DialogHeader>
          {selectedTransaction ? (
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Kategori</span>
                <span>
                  {selectedTransaction.categoryIcon} {selectedTransaction.categoryName}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Nominal</span>
                <span>{selectedTransaction.amount.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Tipe</span>
                <span>{selectedTransaction.type}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Akun</span>
                <span>{selectedTransaction.accountName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Tanggal</span>
                <span>{selectedTransaction.date}</span>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground">Deskripsi</span>
                <p>{selectedTransaction.description}</p>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
