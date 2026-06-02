"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Budget } from "@/shared/_types/finance";
import { Button } from "@/shared/_components/ui/button";
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
  limit: number;
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
        return updateBudget({ id: input.id, limit: input.limit });
      } else {
        return createBudget({
          kategori: input.kategori,
          limit: input.limit,
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

  const budgets = budgetsQuery.data ?? [];
  const categories = categoriesQuery.data ?? [];

  const budgetSpendingSummary = useMemo(
    () => getBudgetSpendingSummary(budgets),
    [budgets]
  );

  function openCreateDialog() {
    const firstCategory = categories[0]?.name ?? "Makan";
    setBudgetEditor({
      kategori: firstCategory,
      limit: 0,
      month: selectedMonth,
    });
  }

  function openEditDialog(budget: Budget) {
    setBudgetEditor({
      id: budget.id,
      kategori: budget.categoryName,
      limit: budget.limit,
      month: selectedMonth,
    });
  }

  function handleSaveBudget() {
    if (!budgetEditor?.kategori) {
      toast.error("Kategori wajib dipilih.");
      return;
    }

    if (budgetEditor.limit <= 0) {
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

      {categories.length === 0 && !categoriesQuery.isLoading ? (
        <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          Tambahkan kategori terlebih dahulu di halaman Pengaturan sebelum mengatur budget.
        </div>
      ) : null}

      {budgetsQuery.isLoading ? (
        <p className="text-sm text-muted-foreground">Memuat budget...</p>
      ) : null}

      {budgetsQuery.isError ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {budgetsQuery.error instanceof Error ? budgetsQuery.error.message : "Gagal memuat budget."}
        </div>
      ) : null}

      {!budgetsQuery.isLoading && !budgetsQuery.isError ? (
        <>
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
              <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground md:col-span-2 xl:col-span-3">
                Belum ada budget aktif untuk bulan ini.
              </div>
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
                      {category.icon} {category.name}
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
                        current ? { ...current, limit: Number(event.target.value) } : current
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
