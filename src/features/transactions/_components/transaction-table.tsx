"use client";

import { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type ColumnDef,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/shared/_components/ui/badge";
import { Button } from "@/shared/_components/ui/button";
import { Card, CardContent } from "@/shared/_components/ui/card";
import { Input } from "@/shared/_components/ui/input";
import { formatDate, formatRupiah } from "@/shared/_utils/formatters";
import { mockAccounts, mockTransactions, type Transaction } from "@/shared/_constants/mock-data";

const categories = Array.from(
  new Set(mockTransactions.map((transaction) => transaction.categoryName))
);

export function TransactionTable() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [account, setAccount] = useState("all");
  const [type, setType] = useState("all");
  const [sorting, setSorting] = useState<SortingState>([
    { id: "date", desc: true },
  ]);

  const data = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return mockTransactions.filter((transaction) => {
      const matchesQuery =
        !normalized ||
        transaction.description.toLowerCase().includes(normalized) ||
        transaction.categoryName.toLowerCase().includes(normalized) ||
        transaction.accountName.toLowerCase().includes(normalized);
      const matchesCategory =
        category === "all" || transaction.categoryName === category;
      const matchesAccount =
        account === "all" || transaction.accountName === account;
      const matchesType = type === "all" || transaction.type === type;

      return matchesQuery && matchesCategory && matchesAccount && matchesType;
    });
  }, [account, category, query, type]);

  const columns = useMemo<ColumnDef<Transaction>[]>(
    () => [
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
    ],
    []
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 6 } },
  });

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-[1.3fr_repeat(3,0.7fr)]">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari transaksi"
            className="h-10"
          />
          <FilterSelect value={category} onChange={setCategory}>
            <option value="all">Semua kategori</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </FilterSelect>
          <FilterSelect value={account} onChange={setAccount}>
            <option value="all">Semua akun</option>
            {mockAccounts.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </FilterSelect>
          <FilterSelect value={type} onChange={setType}>
            <option value="all">Semua tipe</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
            <option value="transfer">Transfer</option>
          </FilterSelect>
        </div>

        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-muted/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-4 py-3 text-left font-medium">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                      </button>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-t border-border">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {data.length} transaksi ditemukan
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function FilterSelect({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      {children}
    </select>
  );
}
