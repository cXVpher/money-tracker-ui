import { TransactionForm } from "@/features/transactions/_components/transaction-form";
import { TransactionTable } from "@/features/transactions/_components/transaction-table";

export function TransactionsPageContent() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Riwayat dan pencatatan</p>
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight">
            Transaksi
          </h1>
        </div>
        <TransactionForm />
      </div>
      <TransactionTable />
    </div>
  );
}
