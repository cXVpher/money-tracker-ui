import { Badge } from "@/shared/_components/ui/badge";
import { AppIcon } from "@/shared/_components/icons/app-icon";
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
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
          <AppIcon name={row.original.categoryIcon} size={16} weight="fill" />
        </span>
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
