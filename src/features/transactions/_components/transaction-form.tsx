"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch, type FieldErrors } from "react-hook-form";
import { z } from "zod";
import { Plus } from "@/shared/_components/icons/phosphor";
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

type TransactionFormValues = {
  amount: string;
  date: string;
  description: string;
  selectedAccountName: string;
  selectedCategoryName: string;
  tags: string;
  transactionType: Transaction["type"];
};

function createTransactionFormSchema(isMockMode: boolean) {
  return z
    .object({
      amount: z
        .string()
        .trim()
        .refine((value) => {
          const parsedAmount = Number(value);
          return !Number.isNaN(parsedAmount) && parsedAmount > 0;
        }, "Nominal transaksi harus lebih besar dari 0."),
      date: z.string(),
      description: z
        .string()
        .trim()
        .min(1, "Deskripsi transaksi wajib diisi."),
      selectedAccountName: z.string(),
      selectedCategoryName: z.string().min(1, "Kategori transaksi wajib dipilih."),
      tags: z.string(),
      transactionType: z.enum(["expense", "income", "transfer"]),
    })
    .superRefine((value, context) => {
      if (isMockMode && !value.date) {
        context.addIssue({
          code: "custom",
          message: "Tanggal transaksi wajib diisi.",
          path: ["date"],
        });
      }

      if (!isMockMode && value.transactionType === "transfer") {
        context.addIssue({
          code: "custom",
          message: "Transaksi transfer belum tersedia.",
          path: ["transactionType"],
        });
      }
    });
}

function getDefaultFormValues({
  accounts,
  categoryOptions,
}: {
  accounts: Account[];
  categoryOptions: TransactionFormProps["categoryOptions"];
}): TransactionFormValues {
  return {
    amount: "",
    date: "",
    description: "",
    selectedAccountName: accounts[0]?.name ?? "",
    selectedCategoryName: categoryOptions[0]?.name ?? "",
    tags: "",
    transactionType: "expense",
  };
}

export function TransactionForm({
  accounts,
  categoryOptions,
  preferBackend = !USE_MOCK_DATA,
  onTransactionCreated,
}: TransactionFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isMockMode = !preferBackend;
  const form = useForm<TransactionFormValues>({
    defaultValues: getDefaultFormValues({ accounts, categoryOptions }),
    resolver: zodResolver(createTransactionFormSchema(isMockMode)),
  });
  const transactionType = useWatch({
    control: form.control,
    name: "transactionType",
  });

  function resetForm() {
    form.reset(getDefaultFormValues({ accounts, categoryOptions }));
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
      if (isMockMode) {
        const transaction = createMockTransaction({
          accounts,
          amount: parsedAmount,
          category: selectedCategory,
          date: values.date,
          description: values.description,
          selectedAccountName: values.selectedAccountName,
          tags: values.tags,
          transactionType: values.transactionType,
        });
        addStoredTransaction(transaction);
        onTransactionCreated?.(transaction);
        toast.success("Transaksi berhasil ditambahkan.");
      } else {
        if (values.transactionType === "transfer") {
          toast.error("Transaksi transfer belum tersedia.");
          return;
        }

        const transaction = await createTransaction({
          amount: parsedAmount,
          categoryName: selectedCategory.name,
          description: values.description.trim(),
          transactionType: values.transactionType as CreateTransactionInput["transactionType"],
        });
        onTransactionCreated?.(transaction);
        toast.success("Transaksi berhasil ditambahkan.");
      }

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
      errors.date?.message ??
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
            {preferBackend
              ? "Transaksi akan disimpan ke akun kamu."
              : "Transaksi baru disimpan di perangkat ini."}
          </DialogDescription>
        </DialogHeader>

        <form
          className="grid gap-4"
          onSubmit={form.handleSubmit(handleSaveTransaction, handleInvalidSubmit)}
        >
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
            {isMockMode ? (
              <div className="space-y-2">
                <Label htmlFor="date">Tanggal</Label>
                <Input
                  id="date"
                  type="date"
                  className="h-10"
                  disabled={form.formState.isSubmitting}
                  {...form.register("date")}
                />
              </div>
            ) : null}
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
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  disabled={form.formState.isSubmitting}
                  {...form.register("selectedAccountName")}
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
              disabled={form.formState.isSubmitting}
              {...form.register("description")}
            />
          </div>
          {isMockMode ? (
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                placeholder="kerja, reimbursable"
                disabled={form.formState.isSubmitting}
                {...form.register("tags")}
              />
            </div>
          ) : null}

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

