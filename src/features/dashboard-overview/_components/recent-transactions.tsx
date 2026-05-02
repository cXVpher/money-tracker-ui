"use client";

import { useMemo } from "react";
import { AppIcon } from "@/shared/_components/icons/app-icon";
import { Badge } from "@/shared/_components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/_components/ui/card";
import type { Transaction } from "@/shared/_types/finance";
import { formatRelativeDate, formatRupiah } from "@/shared/_utils/formatters";
import { getAppTransactions } from "@/shared/_utils/mock-client-store";

type RecentTransactionsProps = {
  transactions?: Transaction[];
};

export function RecentTransactions({ transactions: providedTransactions }: RecentTransactionsProps) {
  const recentTransactions = useMemo(
    () => providedTransactions ?? getAppTransactions().slice(0, 5),
    [providedTransactions]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaksi Terakhir</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentTransactions.length ? recentTransactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-lg">
              <AppIcon name={transaction.categoryIcon} size={20} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {transaction.description}
              </p>
              <p className="text-xs text-muted-foreground">
                {transaction.categoryName} - {transaction.accountName}
              </p>
            </div>
            <div className="text-right">
              <p
                className={
                  transaction.type === "income"
                    ? "text-sm font-semibold text-success"
                    : "text-sm font-semibold text-destructive"
                }
              >
                {transaction.type === "income" ? "+" : "-"}
                {formatRupiah(transaction.amount)}
              </p>
              <Badge variant="outline" className="mt-1">
                {formatRelativeDate(transaction.date)}
              </Badge>
            </div>
          </div>
        )) : (
          <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
            Belum ada transaksi untuk ditampilkan.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
