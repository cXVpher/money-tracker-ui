"use client";

import { useState } from "react";
import { HandCoins, Plus } from "lucide-react";
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
import type { Debt } from "@/shared/_types/finance";
import { addStoredDebt, createClientId } from "@/shared/_utils/mock-client-store";

type DebtDialogProps = {
  onDebtCreated?: (debt: Debt) => void;
};

export function DebtDialog({ onDebtCreated }: DebtDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [personName, setPersonName] = useState("");
  const [debtType, setDebtType] = useState<Debt["type"]>("owed");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");

  function resetForm() {
    setPersonName("");
    setDebtType("owed");
    setAmount("");
    setDueDate("");
    setDescription("");
  }

  function handleSaveDebt(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedAmount = Number(amount);

    if (!personName.trim()) {
      toast.error("Nama wajib diisi.");
      return;
    }

    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Nominal harus lebih besar dari 0.");
      return;
    }

    if (!dueDate) {
      toast.error("Tanggal jatuh tempo wajib diisi.");
      return;
    }

    const debt: Debt = {
      id: createClientId("debt"),
      type: debtType,
      personName: personName.trim(),
      amount: parsedAmount,
      remainingAmount: parsedAmount,
      dueDate,
      description: description.trim() || "Catatan hutang lokal",
      status: "active",
    };

    addStoredDebt(debt);
    onDebtCreated?.(debt);
    toast.success("Catatan hutang mock berhasil ditambahkan.");
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
        Tambah Catatan
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Hutang atau Piutang</DialogTitle>
          <DialogDescription>
            Catatan baru disimpan lokal sebagai mock data.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4" onSubmit={handleSaveDebt}>
          <div className="space-y-2">
            <Label htmlFor="debt-type">Jenis</Label>
            <select
              id="debt-type"
              value={debtType}
              onChange={(event) =>
                setDebtType(event.target.value as Debt["type"])
              }
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="owed">Hutang</option>
              <option value="receivable">Piutang</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="person">Nama</Label>
            <Input
              id="person"
              placeholder="Nama orang"
              value={personName}
              onChange={(event) => setPersonName(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Nominal</Label>
            <Input
              id="amount"
              placeholder="500000"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="debt-due-date">Jatuh tempo</Label>
            <Input
              id="debt-due-date"
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="debt-description">Deskripsi</Label>
            <Input
              id="debt-description"
              placeholder="Keterangan singkat"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" type="button" />}>
              Batal
            </DialogClose>
            <Button type="submit">
              <HandCoins className="h-4 w-4" />
              Simpan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
