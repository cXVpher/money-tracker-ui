"use client";

import { useMemo, useState } from "react";
import { TransactionForm } from "@/features/transactions/_components/transaction-form";
import { TransactionTable } from "@/features/transactions/_components/transaction-table";
import type { Account, Transaction } from "@/shared/_types/finance";
import {
  getAppAccounts,
  getAppTransactions,
  getCategoryOptions,
} from "@/shared/_utils/mock-client-store";

export function TransactionsPageContent() {
  const [accounts] = useState<Account[]>(getAppAccounts);
  const [transactions, setTransactions] = useState<Transaction[]>(getAppTransactions);
  const categoryOptions = useMemo(() => getCategoryOptions(), []);

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
          accounts={accounts}
          categoryOptions={categoryOptions}
          onTransactionCreated={(transaction) =>
            setTransactions((currentTransactions) => [transaction, ...currentTransactions])
          }
        />
      </div>
      <TransactionTable accounts={accounts} transactions={transactions} />
    </div>
  );
}
