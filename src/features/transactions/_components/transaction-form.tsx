"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch, type FieldErrors } from "react-hook-form";
import { z } from "zod";
import { Plus } from "@/shared/_components/icons/phosphor";
import { toast } from "sonner";
import { Button } from "@/shared/_components/ui/button";
import {
  type CreateTransactionInput,
  createTransaction,
} from "@/services/transaction.service";
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
import type { Account, Transaction } from "@/shared/_types";

type TransactionFormProps = {
  categoryOptions: ReadonlyArray<{
    color: string;
    displayIcon: string;
    icon: string;
    name: string;
  }>;
  accounts?: Account[];
  onTransactionCreated?: (transaction: Transaction) => void;
};

const transactionFormSchema = z
  .object({
    amount: z
      .string()
      .trim()
      .refine((value) => {
        const parsedAmount = Number(value);
        return !Number.isNaN(parsedAmount) && parsedAmount > 0;
      }, "Nominal transaksi harus lebih besar dari 0."),
    description: z
      .string()
      .trim()
      .min(1, "Deskripsi transaksi wajib diisi."),
    selectedCategoryName: z.string().min(1, "Kategori transaksi wajib dipilih."),
    transactionType: z.enum(["expense", "income", "transfer"]),
    selectedAccountId: z.string().optional(),
  })
  .superRefine((value, context) => {
    if (value.transactionType === "transfer") {
      context.addIssue({
        code: "custom",
        message: "Transaksi transfer belum tersedia.",
        path: ["transactionType"],
      });
    }
  });

type TransactionFormValues = z.infer<typeof transactionFormSchema>;

function getDefaultFormValues({
  categoryOptions,
  accounts = [],
}: {
  categoryOptions: TransactionFormProps["categoryOptions"];
  accounts?: Account[];
}): TransactionFormValues {
  return {
    amount: "",
    description: "",
    selectedCategoryName: categoryOptions[0]?.name ?? "",
    transactionType: "expense",
    selectedAccountId: accounts[0]?.id ?? "",
  };
}

export function TransactionForm({
  categoryOptions,
  accounts = [],
  onTransactionCreated,
}: TransactionFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<TransactionFormValues>({
    defaultValues: getDefaultFormValues({ categoryOptions, accounts }),
    resolver: zodResolver(transactionFormSchema),
  });
  const transactionType = useWatch({
    control: form.control,
    name: "transactionType",
  });

  function resetForm() {
    form.reset(getDefaultFormValues({ categoryOptions, accounts }));
  }

  async function handleSaveTransaction(values: TransactionFormValues) {
    const parsedAmount = Number(values.amount);
    const selectedCategory = categoryOptions.find(
      (category) => category.name === values.selectedCategoryName
    );

    if (!selectedCategory) {
      toast.error("Akun atau kategori transaksi tidak valid.");
      return;
    }

    try {
      if (values.transactionType === "transfer") {
        toast.error("Transaksi transfer belum tersedia.");
        return;
      }

      const transaction = await createTransaction({
        amount: parsedAmount,
        categoryName: selectedCategory.name,
        description: values.description.trim(),
        transactionType: values.transactionType as CreateTransactionInput["transactionType"],
        walletId: values.selectedAccountId || undefined,
      });
      onTransactionCreated?.(transaction);
      toast.success("Transaksi berhasil ditambahkan.");

      resetForm();
      setIsOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Transaksi belum bisa disimpan."
      );
    }
  }

  function handleInvalidSubmit(errors: FieldErrors<TransactionFormValues>) {
    const firstError =
      errors.amount?.message ??
      errors.description?.message ??
      errors.selectedCategoryName?.message ??
      errors.transactionType?.message ??
      "Periksa kembali data transaksi.";

    toast.error(firstError);
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
            Transaksi akan disimpan dan tersinkronisasi ke server.
          </DialogDescription>
        </DialogHeader>

        <form
          className="grid gap-4"
          onSubmit={form.handleSubmit(handleSaveTransaction, handleInvalidSubmit)}
        >
          <div className="grid grid-cols-3 gap-2">
            {["expense", "income"].map((type) => (
              <Button
                key={type}
                type="button"
                variant={type === transactionType ? "default" : "outline"}
                className="capitalize"
                disabled={form.formState.isSubmitting}
                onClick={() =>
                  form.setValue("transactionType", type as Transaction["type"], {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
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
                disabled={form.formState.isSubmitting}
                {...form.register("amount")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Kategori</Label>
              <select
                id="category"
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                disabled={form.formState.isSubmitting}
                {...form.register("selectedCategoryName")}
              >
                {categoryOptions.map((category) => (
                  <option key={category.name} value={category.name}>
                    {category.displayIcon} {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {accounts && accounts.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="account">Dompet / Rekening Finansial</Label>
              <select
                id="account"
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 animate-in fade-in slide-in-from-top-1 duration-200"
                disabled={form.formState.isSubmitting}
                {...form.register("selectedAccountId")}
              >
                <option value="">-- Pilih Rekening (Opsional) --</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.icon} {account.name} (Saldo: Rp{account.balance.toLocaleString("id-ID")})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              placeholder="Contoh: makan siang"
              disabled={form.formState.isSubmitting}
              {...form.register("description")}
            />
          </div>

          <DialogFooter>
            <DialogClose render={<Button variant="outline" type="button" />}>
              Batal
            </DialogClose>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Menyimpan..." : "Simpan Transaksi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
