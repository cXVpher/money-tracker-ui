"use client";

import { Plus } from "lucide-react";
import { Button } from "@/shared/_components/ui/button";
import {
  Dialog,
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
import { mockAccounts } from "@/shared/_constants/mock-data";

const categories = [
  "Makanan & Minuman",
  "Transportasi",
  "Belanja",
  "Tagihan",
  "Gaji",
  "Freelance",
];

export function TransactionForm() {
  return (
    <Dialog>
      <DialogTrigger render={<Button className="rounded-full" />}>
        <Plus className="h-4 w-4" />
        Tambah Transaksi
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Tambah Transaksi</DialogTitle>
          <DialogDescription>
            Form UI untuk mencatat pemasukan, pengeluaran, atau transfer.
          </DialogDescription>
        </DialogHeader>

        <form className="grid gap-4">
          <div className="grid grid-cols-3 gap-2">
            {["expense", "income", "transfer"].map((type) => (
              <Button
                key={type}
                type="button"
                variant={type === "expense" ? "default" : "outline"}
                className="capitalize"
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
              <Input id="amount" placeholder="Rp0" className="h-10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Tanggal</Label>
              <Input id="date" type="date" className="h-10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Kategori</Label>
              <select
                id="category"
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="account">Akun</Label>
              <select
                id="account"
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {mockAccounts.map((account) => (
                  <option key={account.id}>{account.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea id="description" placeholder="Contoh: makan siang" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input id="tags" placeholder="kerja, reimbursable" />
          </div>
        </form>

        <DialogFooter>
          <Button variant="outline">Batal</Button>
          <Button>Simpan Transaksi</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
