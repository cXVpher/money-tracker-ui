import { mockDebts } from "@/shared/_constants/mock-data";
import { DebtCard } from "./debt-card";
import { DebtDialog } from "./debt-dialog";
import { DebtSummaryCard } from "./debt-summary-card";
import { getDebtSummaries } from "../_utils/debt-summary";

export function DebtsScreen() {
  const summaries = getDebtSummaries(mockDebts);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Tracking hutang dan piutang</p>
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight">
            Hutang
          </h1>
        </div>
        <DebtDialog />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {summaries.map((summary) => (
          <DebtSummaryCard key={summary.title} summary={summary} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {mockDebts.map((debt) => (
          <DebtCard key={debt.id} debt={debt} />
        ))}
      </div>
    </div>
  );
}
