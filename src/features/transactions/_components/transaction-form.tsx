"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/_components/ui/button";
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
  onTransactionCreated?: (transaction: Transaction) => void;
};

export function TransactionForm({
  accounts,
  categoryOptions,
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

  function resetForm() {
    setTransactionType("expense");
    setAmount("");
    setDate("");
    setSelectedCategoryName(categoryOptions[0]?.name ?? "");
    setSelectedAccountName(accounts[0]?.name ?? "");
    setDescription("");
    setTags("");
  }

  function handleSaveTransaction(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedAmount = Number(amount);
    const selectedAccount = accounts.find(
      (account) => account.name === selectedAccountName
    );
    const selectedCategory = categoryOptions.find(
      (category) => category.name === selectedCategoryName
    );

    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Nominal transaksi harus lebih besar dari 0.");
      return;
    }

    if (!date) {
      toast.error("Tanggal transaksi wajib diisi.");
      return;
    }

    if (!description.trim()) {
      toast.error("Deskripsi transaksi wajib diisi.");
      return;
    }

    if (!selectedAccount || !selectedCategory) {
      toast.error("Akun atau kategori transaksi tidak valid.");
      return;
    }

    const transaction: Transaction = {
      id: createClientId("transaction"),
      accountId: selectedAccount.id,
      categoryId: createClientId("category"),
      type: transactionType,
      amount: parsedAmount,
      description: tags.trim()
        ? `${description.trim()} [${tags.trim()}]`
        : description.trim(),
      date,
      categoryName: selectedCategory.name,
      categoryIcon: selectedCategory.icon,
      accountName: selectedAccount.name,
    };

    addStoredTransaction(transaction);
    onTransactionCreated?.(transaction);
    toast.success("Transaksi mock berhasil ditambahkan.");
    resetForm();
    setIsOpen(false);
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
            Transaksi baru disimpan lokal sebagai mock sampai API transaksi siap.
          </DialogDescription>
        </DialogHeader>

        <form className="grid gap-4" onSubmit={handleSaveTransaction}>
          <div className="grid grid-cols-3 gap-2">
            {["expense", "income", "transfer"].map((type) => (
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
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              placeholder="kerja, reimbursable"
              value={tags}
              onChange={(event) => setTags(event.target.value)}
            />
          </div>

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
