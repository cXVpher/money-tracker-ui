"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Budget } from "@/shared/_types";
import { Button } from "@/shared/_components/ui/button";
import { EmptyState } from "@/shared/_components/ui/empty-state";
import { CardGridSkeleton, Skeleton } from "@/shared/_components/ui/skeleton";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/_components/ui/dialog";
import { Input } from "@/shared/_components/ui/input";
import { Label } from "@/shared/_components/ui/label";
import { BudgetCard } from "./budget-card";
import { BudgetHistory } from "./budget-history";
import { BudgetSpendingSummaryCard } from "./budget-spending-summary-card";
import { getBudgetSpendingSummary } from "../_utils/budget-spending-summary";
import {
  createBudget,
  deleteBudget,
  getBudgets,
  updateBudget,
} from "@/services/budget.service";
import { getCategories } from "@/services/category.service";

type BudgetEditorState = {
  id?: string;
  kategori: string;
  limit: string;
  month: string;
};

export function BudgetPageContent() {
  const queryClient = useQueryClient();
  const [selectedMonth, setSelectedMonth] = useState(() => new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [budgetEditor, setBudgetEditor] = useState<BudgetEditorState | null>(null);

  const budgetsQuery = useQuery({
    queryKey: ["budgets", selectedMonth],
    queryFn: () => getBudgets(selectedMonth),
  });

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const saveBudgetMutation = useMutation({
    mutationFn: async (input: BudgetEditorState) => {
      if (input.id) {
        return updateBudget({ id: input.id, limit: Number(input.limit || 0) });
      } else {
        return createBudget({
          kategori: input.kategori,
          limit: Number(input.limit || 0),
          month: input.month,
        });
      }
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Gagal menyimpan budget.");
    },
    onSuccess: () => {
      setBudgetEditor(null);
      toast.success("Budget berhasil disimpan.");
      void queryClient.invalidateQueries({ queryKey: ["budgets"] });
    },
  });

  const deleteBudgetMutation = useMutation({
    mutationFn: deleteBudget,
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Gagal menghapus budget.");
    },
    onSuccess: () => {
      toast.success("Budget berhasil dihapus.");
      void queryClient.invalidateQueries({ queryKey: ["budgets"] });
    },
  });

  const budgets = useMemo(() => budgetsQuery.data ?? [], [budgetsQuery.data]);
  const categories = categoriesQuery.data ?? [];

  const budgetSpendingSummary = useMemo(
    () => getBudgetSpendingSummary(budgets),
    [budgets]
  );

  function openCreateDialog() {
    const firstCategory = categories[0]?.name ?? "Makan";
    setBudgetEditor({
      kategori: firstCategory,
      limit: "",
      month: selectedMonth,
    });
  }

  function openEditDialog(budget: Budget) {
    setBudgetEditor({
      id: budget.id,
      kategori: budget.categoryName,
      limit: String(budget.limit),
      month: selectedMonth,
    });
  }

  function handleSaveBudget() {
    if (!budgetEditor?.kategori) {
      toast.error("Kategori wajib dipilih.");
      return;
    }

    if (Number(budgetEditor.limit || 0) <= 0) {
      toast.error("Batas anggaran (limit) harus lebih besar dari Rp0.");
      return;
    }

    saveBudgetMutation.mutate(budgetEditor);
  }

  function handleDeleteBudget(budget: Budget) {
    if (!window.confirm(`Hapus budget untuk kategori "${budget.categoryName}"?`)) {
      return;
    }

    deleteBudgetMutation.mutate(budget.id);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Kontrol batas pengeluaran bulanan</p>
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight">
            Budget
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-40 rounded-full text-sm h-10"
          />
          <Button
            className="rounded-full"
            onClick={openCreateDialog}
            disabled={categories.length === 0}
          >
            Atur Budget
          </Button>
        </div>
      </div>

      {budgetsQuery.isError ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {budgetsQuery.error instanceof Error ? budgetsQuery.error.message : "Gagal memuat budget."}
        </div>
      ) : null}

      {budgetsQuery.isLoading ? (
        <>
          <div className="rounded-xl bg-card p-4 ring-1 ring-foreground/10">
            <div className="grid gap-4 sm:grid-cols-3">
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <CardGridSkeleton count={3} />
          </div>
        </>
      ) : !budgetsQuery.isError ? (
        <>
          {categories.length === 0 && !categoriesQuery.isLoading ? (
            <EmptyState
              description="Tambahkan kategori di Pengaturan terlebih dahulu, lalu kembali ke halaman ini untuk menentukan limit bulanan."
              title="Kategori belum tersedia"
            />
          ) : null}

          <BudgetSpendingSummaryCard budgetSpendingSummary={budgetSpendingSummary} />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {budgets.length ? budgets.map((budget) => (
              <BudgetCard
                key={budget.id}
                budget={budget}
                onEdit={() => openEditDialog(budget)}
                onDelete={() => handleDeleteBudget(budget)}
              />
            )) : (
              <EmptyState
                className="md:col-span-2 xl:col-span-3"
                description="Buat limit pengeluaran untuk kategori yang paling sering dipakai agar progres bulanan lebih mudah dipantau."
                title="Belum ada budget aktif untuk bulan ini"
                action={
                  <Button
                    onClick={openCreateDialog}
                    disabled={categories.length === 0}
                  >
                    Atur Budget
                  </Button>
                }
              />
            )}
          </div>

          <BudgetHistory totalSpent={budgetSpendingSummary.totalSpent} />
        </>
      ) : null}

      <Dialog
        open={budgetEditor !== null}
        onOpenChange={(open) => {
          if (!open) {
            setBudgetEditor(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {budgetEditor?.id ? "Edit Budget" : "Atur Budget Baru"}
            </DialogTitle>
            <DialogDescription>
              Tentukan batas limit pengeluaran bulanan Anda untuk menghindari pengeluaran berlebih.
            </DialogDescription>
          </DialogHeader>

          {budgetEditor ? (
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget-category">Kategori</Label>
                <select
                  id="budget-category"
                  value={budgetEditor.kategori}
                  onChange={(event) =>
                    setBudgetEditor((current) =>
                      current ? { ...current, kategori: event.target.value } : current
                    )
                  }
                  disabled={budgetEditor.id !== undefined}
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.displayIcon} {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="budget-limit">Limit Bulanan</Label>
                  <Input
                    id="budget-limit"
                    type="number"
                    min={1}
                    value={budgetEditor.limit}
                    onChange={(event) =>
                      setBudgetEditor((current) =>
                        current ? { ...current, limit: event.target.value } : current
                      )
                    }
                    placeholder="Rp1.000.000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget-month">Bulan</Label>
                  <Input
                    id="budget-month"
                    type="month"
                    value={budgetEditor.month}
                    disabled={budgetEditor.id !== undefined}
                    onChange={(event) =>
                      setBudgetEditor((current) =>
                        current ? { ...current, month: event.target.value } : current
                      )
                    }
                  />
                </div>
              </div>
            </div>
          ) : null}

          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Batal</DialogClose>
            <Button
              disabled={saveBudgetMutation.isPending}
              onClick={handleSaveBudget}
            >
              {saveBudgetMutation.isPending ? "Menyimpan..." : "Simpan Budget"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
