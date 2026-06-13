"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { TransactionForm } from "@/features/transactions/_components/transaction-form";
import { TransactionTable } from "@/features/transactions/_components/transaction-table";
import { EmptyState } from "@/shared/_components/ui/empty-state";
import { TableSkeleton } from "@/shared/_components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/_components/ui/dialog";
import { Badge } from "@/shared/_components/ui/badge";
import { AppIcon } from "@/shared/_components/icons/app-icon";
import type { Transaction } from "@/shared/_types";
import { formatDate, formatRupiah } from "@/shared/_utils/formatters";
import {
  deleteTransaction,
  getTransaction,
  getTransactions,
} from "@/services/transaction.service";
import { getCategories } from "@/services/category.service";
import { getAccounts } from "@/services/account.service";

const transactionListQueryKey = ["transactions", { page: 1, perPage: 50 }] as const;

function getTransactionTypeLabel(type: Transaction["type"]) {
  if (type === "income") return "Pemasukan";
  if (type === "expense") return "Pengeluaran";
  return "Transfer";
}

export function TransactionsPageContent() {
  const queryClient = useQueryClient();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const accountsQuery = useQuery({
    queryKey: ["accounts"],
    queryFn: getAccounts,
  });

  const categoryOptions = categoriesQuery.data ?? [];
  const accounts = accountsQuery.data ?? [];

  const transactionsQuery = useQuery({
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
      void queryClient.invalidateQueries({ queryKey: ["budgets"] }); // also invalidate budgets
      void queryClient.invalidateQueries({ queryKey: ["accounts"] }); // and accounts balance
    },
    onSuccess: () => {
      toast.success("Transaksi berhasil dihapus.");
    },
  });

  const transactions = transactionsQuery.data ?? [];
  const deletingTransactionId = deleteTransactionMutation.isPending
    ? deleteTransactionMutation.variables
    : null;
  const loadError =
    transactionsQuery.isError
      ? transactionsQuery.error instanceof Error
        ? transactionsQuery.error.message
        : "Gagal memuat transaksi bulan berjalan."
      : null;

  async function handleViewTransaction(transaction: Transaction) {
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

    deleteTransactionMutation.mutate(transaction.id);
  }

  function handleTransactionCreated(transaction: Transaction) {
    queryClient.setQueryData<Transaction[]>(
      transactionListQueryKey,
      (currentTransactions = []) => [transaction, ...currentTransactions]
    );
    void queryClient.invalidateQueries({ queryKey: transactionListQueryKey });
    void queryClient.invalidateQueries({ queryKey: ["budgets"] }); // also invalidate budgets
    void queryClient.invalidateQueries({ queryKey: ["accounts"] }); // and accounts balance
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
          categoryOptions={categoryOptions}
          accounts={accounts}
          onTransactionCreated={handleTransactionCreated}
        />
      </div>
      {loadError ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {loadError}
        </div>
      ) : null}
      {transactionsQuery.isLoading ? (
        <TableSkeleton />
      ) : transactions.length ? (
        <TransactionTable
          accounts={accounts}
          deletingTransactionId={deletingTransactionId}
          onDeleteTransaction={handleDeleteTransaction}
          onViewTransaction={handleViewTransaction}
          transactions={transactions}
        />
      ) : (
        <EmptyState
          description="Catat pemasukan atau pengeluaran pertama Anda agar ringkasan, budget, dan grafik mulai terisi."
          title="Belum ada transaksi"
          action={
            <TransactionForm
              categoryOptions={categoryOptions}
              accounts={accounts}
              onTransactionCreated={handleTransactionCreated}
            />
          }
        />
      )}

      <Dialog
        open={selectedTransaction !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedTransaction(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-lg overflow-hidden p-0">
          <DialogHeader>
            <div className="px-6 pt-6">
              <DialogTitle>Detail Transaksi</DialogTitle>
              <DialogDescription>
              Ringkasan transaksi yang dipilih.
              </DialogDescription>
            </div>
          </DialogHeader>
          {selectedTransaction ? (
            <div className="space-y-5 px-6 pb-6">
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <AppIcon name={selectedTransaction.categoryIcon} size={24} weight="fill" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-semibold">
                        {selectedTransaction.categoryName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(selectedTransaction.date)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={
                        selectedTransaction.type === "income"
                          ? "text-xl font-bold text-success"
                          : "text-xl font-bold text-destructive"
                      }
                    >
                      {selectedTransaction.type === "income" ? "+" : "-"}
                      {formatRupiah(selectedTransaction.amount)}
                    </p>
                    <Badge variant="outline">
                      {getTransactionTypeLabel(selectedTransaction.type)}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <TransactionDetailItem
                  label="Akun"
                  value={selectedTransaction.accountName}
                />
                <TransactionDetailItem
                  label="Tanggal"
                  value={formatDate(selectedTransaction.date)}
                />
              </div>

              <div className="rounded-lg border border-border p-4">
                <p className="text-xs font-medium uppercase text-muted-foreground">
                  Deskripsi
                </p>
                <p className="mt-2 leading-relaxed">
                  {selectedTransaction.description}
                </p>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TransactionDetailItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border p-4">
      <p className="text-xs font-medium uppercase text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 truncate font-medium">{value}</p>
    </div>
  );
}
