"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { TransactionForm } from "@/features/transactions/_components/transaction-form";
import { TransactionTable } from "@/features/transactions/_components/transaction-table";
import { USE_MOCK_DATA } from "@/shared/_config/runtime";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/_components/ui/dialog";
import type { Account, Transaction } from "@/shared/_types/finance";
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
  const mockAccounts = useMemo<Account[]>(
    () => (USE_MOCK_DATA ? getAppAccounts() : []),
    []
  );
  const mockTransactions = useMemo<Transaction[]>(
    () => (USE_MOCK_DATA ? getAppTransactions() : []),
    []
  );
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [deletingTransactionId, setDeletingTransactionId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isUsingBackendData, setIsUsingBackendData] = useState(false);
  const categoryOptions = useMemo(
    () =>
      USE_MOCK_DATA
        ? getCategoryOptions()
        : [...backendTransactionCategories],
    []
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
          setTransactions(nextTransactions.items ?? []);
          setIsUsingBackendData(true);
          setLoadError(null);
        }
      } catch (error) {
        if (isActive) {
          setTransactions([]);
          setIsUsingBackendData(false);
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
  }, []);

  async function handleViewTransaction(transaction: Transaction) {
    if (USE_MOCK_DATA) {
      setSelectedTransaction(transaction);
      return;
    }

    try {
      const detailedTransaction = await getTransaction(transaction.id);
      setSelectedTransaction(detailedTransaction);
    } catch (error) {
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
      if (USE_MOCK_DATA) {
        setTransactions((currentTransactions) =>
          currentTransactions.filter((item) => item.id !== transaction.id)
        );
        toast.success("Transaksi dihapus dari daftar saat ini.");
        return;
      }

      await deleteTransaction(transaction.id);
      setTransactions((currentTransactions) =>
        currentTransactions.filter((item) => item.id !== transaction.id)
      );
      toast.success("Transaksi berhasil dihapus.");
    } catch (error) {
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
