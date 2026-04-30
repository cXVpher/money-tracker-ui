"use client";

import { useEffect, useMemo, useState } from "react";
import { TransactionForm } from "@/features/transactions/_components/transaction-form";
import { TransactionTable } from "@/features/transactions/_components/transaction-table";
import { USE_MOCK_DATA } from "@/shared/_config/runtime";
import type { Account, Transaction } from "@/shared/_types/finance";
import { shouldUseMockFallback } from "@/shared/_utils/api-client";
import {
  backendTransactionCategories,
  getMonthlyTransactions,
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
        const nextTransactions = await getMonthlyTransactions();
        if (isActive) {
          setTransactions(nextTransactions);
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
        transactions={transactions}
      />
    </div>
  );
}
