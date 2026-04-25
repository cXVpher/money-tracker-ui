import { Badge } from "@/shared/_components/ui/badge";
import { formatDate, formatRupiah } from "@/shared/_utils/formatters";
import type { Transaction } from "@/features/transactions/_types/transaction";
import type { ColumnDef } from "@tanstack/react-table";

export const transactionColumns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "date",
    header: "Tanggal",
    cell: ({ row }) => formatDate(row.original.date),
  },
  {
    accessorKey: "categoryName",
    header: "Kategori",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="text-lg">{row.original.categoryIcon}</span>
        <span>{row.original.categoryName}</span>
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: "Deskripsi",
  },
  {
    accessorKey: "accountName",
    header: "Akun",
    cell: ({ row }) => <Badge variant="outline">{row.original.accountName}</Badge>,
  },
  {
    accessorKey: "amount",
    header: "Nominal",
    cell: ({ row }) => (
      <span
        className={
          row.original.type === "income"
            ? "font-semibold text-success"
            : "font-semibold text-destructive"
        }
      >
        {row.original.type === "income" ? "+" : "-"}
        {formatRupiah(row.original.amount)}
      </span>
    ),
  },
];
