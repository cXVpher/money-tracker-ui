"use client";

import { useMemo, useState } from "react";
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
import type { Budget } from "@/shared/_types/finance";
import { addStoredBudget, createClientId } from "@/shared/_utils/mock-client-store";

type BudgetDialogProps = {
  categoryOptions: Array<{
    color: string;
    icon: string;
    name: string;
  }>;
  onBudgetCreated?: (budget: Budget) => void;
};

export function BudgetDialog({
  categoryOptions,
  onBudgetCreated,
}: BudgetDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategoryName, setSelectedCategoryName] = useState(
    categoryOptions[0]?.name ?? ""
  );
  const [monthlyLimit, setMonthlyLimit] = useState("");

  const selectedCategory = useMemo(
    () =>
      categoryOptions.find((category) => category.name === selectedCategoryName) ??
      categoryOptions[0],
    [categoryOptions, selectedCategoryName]
  );

  function resetForm() {
    setSelectedCategoryName(categoryOptions[0]?.name ?? "");
    setMonthlyLimit("");
  }

  function handleSaveBudget(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedLimit = Number(monthlyLimit);

    if (!selectedCategory) {
      toast.error("Kategori budget belum tersedia.");
      return;
    }

    if (Number.isNaN(parsedLimit) || parsedLimit <= 0) {
      toast.error("Limit bulanan harus lebih besar dari 0.");
      return;
    }

    const budget: Budget = {
      id: createClientId("budget"),
      categoryName: selectedCategory.name,
      categoryIcon: selectedCategory.icon,
      limit: parsedLimit,
      spent: 0,
      color: selectedCategory.color,
    };

    addStoredBudget(budget);
    onBudgetCreated?.(budget);
    toast.success("Budget mock berhasil ditambahkan.");
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
        Atur Budget
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah atau Edit Budget</DialogTitle>
          <DialogDescription>
            Perubahan budget disimpan lokal sampai API budget tersedia.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4" onSubmit={handleSaveBudget}>
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
            <Label htmlFor="limit">Limit bulanan</Label>
            <Input
              id="limit"
              placeholder="2000000"
              value={monthlyLimit}
              onChange={(event) => setMonthlyLimit(event.target.value)}
            />
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" type="button" />}>
              Batal
            </DialogClose>
            <Button type="submit">Simpan Budget</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
