"use client";

import { useState } from "react";
import { Plus, Wallet } from "lucide-react";
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
import type { Account } from "@/shared/_types/finance";
import { addStoredAccount, createClientId } from "@/shared/_utils/mock-client-store";

const accountTypeOptions: Array<{
  color: string;
  icon: string;
  label: string;
  value: Account["type"];
}> = [
  { value: "bank", label: "Bank", icon: "🏦", color: "#0060af" },
  { value: "ewallet", label: "E-Wallet", icon: "📱", color: "#00aed6" },
  { value: "cash", label: "Tunai", icon: "💵", color: "#22c55e" },
  { value: "credit_card", label: "Kartu Kredit", icon: "💳", color: "#ef4444" },
];

type AccountDialogProps = {
  onAccountCreated?: (account: Account) => void;
};

export function AccountDialog({ onAccountCreated }: AccountDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [accountName, setAccountName] = useState("");
  const [accountType, setAccountType] = useState<Account["type"]>("bank");
  const [openingBalance, setOpeningBalance] = useState("");

  function resetForm() {
    setAccountName("");
    setAccountType("bank");
    setOpeningBalance("");
  }

  function handleSaveAccount(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedBalance = Number(openingBalance);
    const selectedType = accountTypeOptions.find((option) => option.value === accountType);

    if (!accountName.trim()) {
      toast.error("Nama akun wajib diisi.");
      return;
    }

    if (Number.isNaN(parsedBalance)) {
      toast.error("Saldo awal harus berupa angka.");
      return;
    }

    if (!selectedType) {
      toast.error("Tipe akun tidak valid.");
      return;
    }

    const account: Account = {
      id: createClientId("account"),
      name: accountName.trim(),
      type: accountType,
      balance: parsedBalance,
      icon: selectedType.icon,
      color: selectedType.color,
    };

    addStoredAccount(account);
    onAccountCreated?.(account);
    toast.success("Akun mock berhasil ditambahkan.");
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
        Tambah Akun
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Akun Finansial</DialogTitle>
          <DialogDescription>
            Data disimpan lokal sebagai mock sampai integrasi API akun siap.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4" onSubmit={handleSaveAccount}>
          <div className="space-y-2">
            <Label htmlFor="account-name">Nama akun</Label>
            <Input
              id="account-name"
              placeholder="BCA, GoPay, Tunai"
              value={accountName}
              onChange={(event) => setAccountName(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="account-type">Tipe akun</Label>
            <select
              id="account-type"
              value={accountType}
              onChange={(event) =>
                setAccountType(event.target.value as Account["type"])
              }
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {accountTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="account-balance">Saldo awal</Label>
            <Input
              id="account-balance"
              placeholder="1500000"
              value={openingBalance}
              onChange={(event) => setOpeningBalance(event.target.value)}
            />
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" type="button" />}>
              Batal
            </DialogClose>
            <Button type="submit">
              <Wallet className="h-4 w-4" />
              Simpan Akun
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
