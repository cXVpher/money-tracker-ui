"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

const transactionListQueryKey = ["transactions", { page: 1, perPage: 50 }] as const;

export function TransactionsPageContent() {
  const queryClient = useQueryClient();
  const mockAccounts = useMemo<Account[]>(
    () => (USE_MOCK_DATA ? getAppAccounts() : []),
    []
  );
  const initialMockTransactions = useMemo<Transaction[]>(
    () => (USE_MOCK_DATA ? getAppTransactions() : []),
    []
  );
  const [mockTransactions, setMockTransactions] = useState<Transaction[]>(
    initialMockTransactions
  );
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const categoryOptions = useMemo(
    () =>
      USE_MOCK_DATA
        ? getCategoryOptions()
        : [...backendTransactionCategories],
    []
  );

  const transactionsQuery = useQuery({
    enabled: !USE_MOCK_DATA,
    queryFn: async () => {
      const nextTransactions = await getTransactions({ page: 1, perPage: 50 });
      return nextTransactions.items ?? [];
    },
    queryKey: transactionListQueryKey,
  });

  const transactionDetailMutation = useMutation({
    mutationFn: getTransaction,
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Gagal memuat detail transaksi."
      );
    },
    onSuccess: setSelectedTransaction,
  });

  const deleteTransactionMutation = useMutation({
    mutationFn: deleteTransaction,
    onError: (error, _transactionId, context: { previousTransactions?: Transaction[] } | undefined) => {
      if (context?.previousTransactions) {
        queryClient.setQueryData(
          transactionListQueryKey,
          context.previousTransactions
        );
      }

      toast.error(
        error instanceof Error ? error.message : "Gagal menghapus transaksi."
      );
    },
    onMutate: async (transactionId) => {
      await queryClient.cancelQueries({ queryKey: transactionListQueryKey });

      const previousTransactions =
        queryClient.getQueryData<Transaction[]>(transactionListQueryKey);

      queryClient.setQueryData<Transaction[]>(
        transactionListQueryKey,
        (currentTransactions = []) =>
          currentTransactions.filter((item) => item.id !== transactionId)
      );

      return { previousTransactions };
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: transactionListQueryKey });
    },
    onSuccess: () => {
      toast.success("Transaksi berhasil dihapus.");
    },
  });

  const transactions = USE_MOCK_DATA
    ? mockTransactions
    : (transactionsQuery.data ?? []);
  const deletingTransactionId = deleteTransactionMutation.isPending
    ? deleteTransactionMutation.variables
    : null;
  const loadError =
    !USE_MOCK_DATA && transactionsQuery.isError
      ? transactionsQuery.error instanceof Error
        ? transactionsQuery.error.message
        : "Gagal memuat transaksi bulan berjalan."
      : null;

  async function handleViewTransaction(transaction: Transaction) {
    if (USE_MOCK_DATA) {
      setSelectedTransaction(transaction);
      return;
    }

    transactionDetailMutation.mutate(transaction.id);
  }

  function handleDeleteTransaction(transaction: Transaction) {
    if (typeof window !== "undefined") {
      const shouldDelete = window.confirm(
        `Hapus transaksi "${transaction.description}"?`
      );

      if (!shouldDelete) {
        return;
      }
    }

    if (USE_MOCK_DATA) {
      setMockTransactions((currentTransactions) =>
        currentTransactions.filter((item) => item.id !== transaction.id)
      );
      toast.success("Transaksi dihapus dari daftar saat ini.");
      return;
    }

    deleteTransactionMutation.mutate(transaction.id);
  }

  function handleTransactionCreated(transaction: Transaction) {
    if (USE_MOCK_DATA) {
      setMockTransactions((currentTransactions) => [
        transaction,
        ...currentTransactions,
      ]);
      return;
    }

    queryClient.setQueryData<Transaction[]>(
      transactionListQueryKey,
      (currentTransactions = []) => [transaction, ...currentTransactions]
    );
    void queryClient.invalidateQueries({ queryKey: transactionListQueryKey });
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
          accounts={USE_MOCK_DATA ? mockAccounts : []}
          preferBackend={!USE_MOCK_DATA}
          categoryOptions={categoryOptions}
          onTransactionCreated={handleTransactionCreated}
        />
      </div>
      {loadError ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {loadError}
        </div>
      ) : null}
      {!USE_MOCK_DATA && transactionsQuery.isLoading ? (
        <p className="text-sm text-muted-foreground">Memuat transaksi...</p>
      ) : null}
      <TransactionTable
        accounts={USE_MOCK_DATA ? mockAccounts : []}
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
