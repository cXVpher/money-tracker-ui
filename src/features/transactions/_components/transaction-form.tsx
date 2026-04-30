"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/_components/ui/button";
import { USE_MOCK_DATA } from "@/shared/_config/runtime";
import {
  type CreateTransactionInput,
  createTransaction,
} from "@/shared/_utils/backend-client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/_components/ui/dialog";
import { Input } from "@/shared/_components/ui/input";
import { Label } from "@/shared/_components/ui/label";
import { Textarea } from "@/shared/_components/ui/textarea";
import type { Account, Transaction } from "@/shared/_types/finance";
import { shouldUseMockFallback } from "@/shared/_utils/api-client";
import {
  addStoredTransaction,
  createClientId,
} from "@/shared/_utils/mock-client-store";

type TransactionFormProps = {
  accounts: Account[];
  categoryOptions: Array<{
    color: string;
    icon: string;
    name: string;
  }>;
  preferBackend?: boolean;
  onTransactionCreated?: (transaction: Transaction) => void;
};

export function TransactionForm({
  accounts,
  categoryOptions,
  preferBackend = !USE_MOCK_DATA,
  onTransactionCreated,
}: TransactionFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [transactionType, setTransactionType] =
    useState<Transaction["type"]>("expense");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [selectedCategoryName, setSelectedCategoryName] = useState(
    categoryOptions[0]?.name ?? ""
  );
  const [selectedAccountName, setSelectedAccountName] = useState(
    accounts[0]?.name ?? ""
  );
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const isMockMode = !preferBackend;

  function resetForm() {
    setTransactionType("expense");
    setAmount("");
    setDate("");
    setSelectedCategoryName(categoryOptions[0]?.name ?? "");
    setSelectedAccountName(accounts[0]?.name ?? "");
    setDescription("");
    setTags("");
  }

  async function handleSaveTransaction(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedAmount = Number(amount);
    const selectedCategory = categoryOptions.find(
      (category) => category.name === selectedCategoryName
    );

    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Nominal transaksi harus lebih besar dari 0.");
      return;
    }

    if (isMockMode && !date) {
      toast.error("Tanggal transaksi wajib diisi.");
      return;
    }

    if (!description.trim()) {
      toast.error("Deskripsi transaksi wajib diisi.");
      return;
    }

    if (!selectedCategory) {
      toast.error("Akun atau kategori transaksi tidak valid.");
      return;
    }

    try {
      if (isMockMode) {
        const transaction = createMockTransaction({
          accounts,
          amount: parsedAmount,
          category: selectedCategory,
          date,
          description,
          selectedAccountName,
          tags,
          transactionType,
        });
        addStoredTransaction(transaction);
        onTransactionCreated?.(transaction);
        toast.success("Transaksi mock berhasil ditambahkan.");
      } else {
        if (transactionType === "transfer") {
          toast.error("Mode backend belum mendukung transaksi transfer.");
          return;
        }

        const transaction = await createTransaction({
          amount: parsedAmount,
          categoryName: selectedCategory.name,
          description: description.trim(),
          transactionType: transactionType as CreateTransactionInput["transactionType"],
        });
        onTransactionCreated?.(transaction);
        toast.success("Transaksi berhasil ditambahkan.");
      }

      resetForm();
      setIsOpen(false);
    } catch (error) {
      if (preferBackend && shouldUseMockFallback(error)) {
        const fallbackTransaction = createMockTransaction({
          accounts,
          amount: parsedAmount,
          category: selectedCategory,
          date: date || new Date().toISOString().slice(0, 10),
          description,
          selectedAccountName,
          tags,
          transactionType,
        });
        addStoredTransaction(fallbackTransaction);
        onTransactionCreated?.(fallbackTransaction);
        toast.warning(
          "API transaksi belum aktif. Transaksi disimpan sebagai data mock."
        );
        resetForm();
        setIsOpen(false);
        return;
      }

      toast.error(
        error instanceof Error
          ? error.message
          : "Transaksi belum bisa disimpan."
      );
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          resetForm();
        }
      }}
    >
      <DialogTrigger render={<Button className="rounded-full" />}>
        <Plus className="h-4 w-4" />
        Tambah Transaksi
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Tambah Transaksi</DialogTitle>
          <DialogDescription>
            {preferBackend
              ? "Akan mencoba menyimpan ke API, lalu fallback ke mock bila endpoint belum aktif."
              : "Transaksi baru disimpan lokal sebagai mock sampai API transaksi siap."}
          </DialogDescription>
        </DialogHeader>

        <form className="grid gap-4" onSubmit={handleSaveTransaction}>
          <div className="grid grid-cols-3 gap-2">
            {(isMockMode
              ? ["expense", "income", "transfer"]
              : ["expense", "income"]
            ).map((type) => (
              <Button
                key={type}
                type="button"
                variant={type === transactionType ? "default" : "outline"}
                className="capitalize"
                onClick={() => setTransactionType(type as Transaction["type"])}
              >
                {type === "expense"
                  ? "Expense"
                  : type === "income"
                    ? "Income"
                    : "Transfer"}
              </Button>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="amount">Nominal</Label>
              <Input
                id="amount"
                placeholder="150000"
                className="h-10"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
              />
            </div>
            {isMockMode ? (
              <div className="space-y-2">
                <Label htmlFor="date">Tanggal</Label>
                <Input
                  id="date"
                  type="date"
                  className="h-10"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                />
              </div>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="category">Kategori</Label>
              <select
                id="category"
                value={selectedCategoryName}
                onChange={(event) => setSelectedCategoryName(event.target.value)}
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {categoryOptions.map((category) => (
                  <option key={category.name} value={category.name}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>
            {isMockMode ? (
              <div className="space-y-2">
                <Label htmlFor="account">Akun</Label>
                <select
                  id="account"
                  value={selectedAccountName}
                  onChange={(event) => setSelectedAccountName(event.target.value)}
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {accounts.map((account) => (
                    <option key={account.id} value={account.name}>
                      {account.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              placeholder="Contoh: makan siang"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>
          {isMockMode ? (
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                placeholder="kerja, reimbursable"
                value={tags}
                onChange={(event) => setTags(event.target.value)}
              />
            </div>
          ) : null}

          <DialogFooter>
            <DialogClose render={<Button variant="outline" type="button" />}>
              Batal
            </DialogClose>
            <Button type="submit">Simpan Transaksi</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function createMockTransaction({
  accounts,
  amount,
  category,
  date,
  description,
  selectedAccountName,
  tags,
  transactionType,
}: {
  accounts: Account[];
  amount: number;
  category: {
    color: string;
    icon: string;
    name: string;
  };
  date: string;
  description: string;
  selectedAccountName: string;
  tags: string;
  transactionType: Transaction["type"];
}) {
  const selectedAccount =
    accounts.find((account) => account.name === selectedAccountName) ?? null;
  const accountName = selectedAccount?.name ?? "DuitKu";
  const accountId = selectedAccount?.id ?? "mock-backend";

  return {
    id: createClientId("transaction"),
    accountId,
    categoryId: createClientId("category"),
    type: transactionType,
    amount,
    description: tags.trim()
      ? `${description.trim()} [${tags.trim()}]`
      : description.trim(),
    date,
    categoryName: category.name,
    categoryIcon: category.icon,
    accountName,
  } satisfies Transaction;
}
