"use client";

import { useMemo, useState } from "react";
import type { Debt } from "@/shared/_types/finance";
import { DebtCard } from "./debt-card";
import { DebtDialog } from "./debt-dialog";
import { DebtBalanceSummaryCard } from "./debt-balance-summary-card";
import { getDebtBalanceSummaries } from "../_utils/debt-balance-summary";
import { getAppDebts } from "@/shared/_utils/mock-client-store";

export function DebtsPageContent() {
  const [debts, setDebts] = useState<Debt[]>(getAppDebts);
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
        <DebtDialog
          onDebtCreated={(debt) =>
            setDebts((currentDebts) => [...currentDebts, debt])
          }
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {debtBalanceSummaries.map((debtBalanceSummary) => (
          <DebtBalanceSummaryCard
            key={debtBalanceSummary.title}
            debtBalanceSummary={debtBalanceSummary}
          />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {debts.map((debt) => (
          <DebtCard key={debt.id} debt={debt} />
        ))}
      </div>
    </div>
  );
}
