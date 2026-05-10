"use client";

import { useMemo, useState } from "react";
import { Button } from "@/shared/_components/ui/button";
import { USE_MOCK_DATA } from "@/shared/_config/runtime";
import type { Debt } from "@/shared/_types/finance";
import { DebtCard } from "./debt-card";
import { DebtDialog } from "./debt-dialog";
import { DebtBalanceSummaryCard } from "./debt-balance-summary-card";
import { getDebtBalanceSummaries } from "../_utils/debt-balance-summary";
import { getAppDebts } from "@/shared/_utils/mock-client-store";

export function DebtsPageContent() {
  const [debts, setDebts] = useState<Debt[]>(() =>
    USE_MOCK_DATA ? getAppDebts() : []
  );
  const debtBalanceSummaries = useMemo(
    () => getDebtBalanceSummaries(debts),
    [debts]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Tracking hutang dan piutang</p>
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight">
            Hutang
          </h1>
        </div>
        {USE_MOCK_DATA ? (
          <DebtDialog
            onDebtCreated={(debt) =>
              setDebts((currentDebts) => [...currentDebts, debt])
            }
          />
        ) : (
          <Button className="rounded-full" disabled>
            Tambah Catatan
          </Button>
        )}
      </div>

      {!USE_MOCK_DATA ? (
        <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          Catatan hutang belum tersedia untuk akun ini.
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {debtBalanceSummaries.map((debtBalanceSummary) => (
          <DebtBalanceSummaryCard
            key={debtBalanceSummary.title}
            debtBalanceSummary={debtBalanceSummary}
          />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {debts.length ? debts.map((debt) => (
          <DebtCard key={debt.id} debt={debt} />
        )) : (
          <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground lg:col-span-2">
            Belum ada catatan hutang atau piutang.
          </div>
        )}
      </div>
    </div>
  );
}
