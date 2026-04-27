"use client";

import { useMemo } from "react";
import { Badge } from "@/shared/_components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/_components/ui/card";
import { formatRelativeDate, formatRupiah } from "@/shared/_utils/formatters";
import { getAppTransactions } from "@/shared/_utils/mock-client-store";

export function RecentTransactions() {
  const recentTransactions = useMemo(
    () => getAppTransactions().slice(0, 5),
    []
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaksi Terakhir</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentTransactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-lg">
              {transaction.categoryIcon}
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
        ))}
      </CardContent>
    </Card>
  );
}
