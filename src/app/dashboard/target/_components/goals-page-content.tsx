"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/shared/_components/ui/button";
import type { Goal } from "@/shared/_types";
import {
  contributeGoal,
  createGoal,
  deleteGoal,
  getGoals,
  updateGoal,
  type CreateGoalInput,
} from "@/services/goal.service";
import { getCategories, createCategory } from "@/services/category.service";
import { createTransaction, getTransactions, deleteTransaction } from "@/services/transaction.service";
import { GoalCard } from "./goal-card";
import { GoalEditorDialog } from "./goal-editor-dialog";
import { GoalContributionDialog } from "./goal-contribution-dialog";
import { GoalDeleteConfirmationDialog } from "./goal-delete-confirmation-dialog";

const goalsQueryKey = ["goals"] as const;

const emptyGoalForm: CreateGoalInput = {
  color: "#6366F1",
  deadline: "",
  icon: "target",
  name: "",
  targetAmount: 0,
};

export function GoalsPageContent() {
  const queryClient = useQueryClient();
  const [goalEditor, setGoalEditor] =
    useState<(CreateGoalInput & { id?: string }) | null>(null);
  const [contributionEditor, setContributionEditor] = useState<{
    id: string;
    name: string;
    amount: number;
  } | null>(null);
  const [isContributing, setIsContributing] = useState(false);
  const [deleteTargetConfirmation, setDeleteTargetConfirmation] = useState<Goal | null>(null);

  const goalsQuery = useQuery({
    queryFn: getGoals,
    queryKey: goalsQueryKey,
  });

  const saveGoalMutation = useMutation({
    mutationFn: async (input: CreateGoalInput & { id?: string }) =>
      input.id ? updateGoal({ ...input, id: input.id }) : createGoal(input),
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Gagal menyimpan target.");
    },
    onSuccess: () => {
      setGoalEditor(null);
      toast.success("Target berhasil disimpan.");
      void queryClient.invalidateQueries({ queryKey: goalsQueryKey });
    },
  });

  const goals = goalsQuery.data ?? [];

  function openCreateDialog() {
    setGoalEditor(emptyGoalForm);
  }

  function openEditDialog(goal: Goal) {
    setGoalEditor({
      color: goal.color,
      deadline: goal.deadline,
      icon: goal.icon,
      id: goal.id,
      name: goal.name,
      targetAmount: goal.targetAmount,
    });
  }

  function handleSaveGoal() {
    if (!goalEditor?.name.trim()) {
      toast.error("Nama target wajib diisi.");
      return;
    }

    if (!goalEditor.deadline) {
      toast.error("Deadline wajib diisi.");
      return;
    }

    if (goalEditor.targetAmount <= 0) {
      toast.error("Nominal target harus lebih dari 0.");
      return;
    }

    saveGoalMutation.mutate(goalEditor);
  }

  function handleContribute(goal: Goal) {
    setContributionEditor({
      id: goal.id,
      name: goal.name,
      amount: 0,
    });
  }

  async function handleSaveContribution() {
    if (!contributionEditor) return;
    if (contributionEditor.amount <= 0) {
      toast.error("Nominal kontribusi harus lebih besar dari Rp0.");
      return;
    }

    setIsContributing(true);
    const targetCategoryName = `Kontribusi ${contributionEditor.name}`;

    try {
      // 1. Get existing categories to check if we need to create it
      const currentCategories = await getCategories();
      const exists = currentCategories.some(
        (cat) => cat.name.toLowerCase() === targetCategoryName.toLowerCase()
      );

      // 2. Create the category if it doesn't exist
      if (!exists) {
        await createCategory({
          name: targetCategoryName,
          icon: "target",
          color: "#6366F1",
          description: `Kategori otomatis untuk tabungan ${contributionEditor.name}`,
        });
        // Invalidate categories query so the settings page or forms show it
        void queryClient.invalidateQueries({ queryKey: ["categories"] });
      }

      // 3. Create the expense transaction
      await createTransaction({
        amount: contributionEditor.amount,
        categoryName: targetCategoryName,
        description: `Setoran tabungan untuk ${contributionEditor.name}`,
        transactionType: "expense",
      });
      // Invalidate transactions query
      void queryClient.invalidateQueries({ queryKey: ["transactions"] });

      // 4. Contribute to the savings goal
      await contributeGoal({
        amount: contributionEditor.amount,
        id: contributionEditor.id,
      });

      toast.success("Kontribusi berhasil dan otomatis dicatat sebagai transaksi pengeluaran.");
      void queryClient.invalidateQueries({ queryKey: goalsQueryKey });
      setContributionEditor(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal menyelesaikan proses kontribusi."
      );
    } finally {
      setIsContributing(false);
    }
  }

  function handleDeleteGoal(goal: Goal) {
    setDeleteTargetConfirmation(goal);
  }

  async function handleConfirmDeleteGoal() {
    if (!deleteTargetConfirmation) return;
    const goal = deleteTargetConfirmation;
    setDeleteTargetConfirmation(null);

    const targetCategoryName = `Kontribusi ${goal.name}`;

    try {
      toast.loading("Sedang menghapus target dan menyelaraskan riwayat transaksi...");

      // 1. Fetch transactions to find ones associated with this target's category
      const response = await getTransactions({ page: 1, perPage: 500 });
      const associatedTx = (response.items ?? []).filter(
        (tx) => tx.categoryName.toLowerCase() === targetCategoryName.toLowerCase()
      );

      // 2. Delete all associated transactions
      if (associatedTx.length > 0) {
        await Promise.all(
          associatedTx.map((tx) => deleteTransaction(tx.id))
        );
        // Invalidate transactions query
        void queryClient.invalidateQueries({ queryKey: ["transactions"] });
      }

      // 3. Delete the savings goal itself
      await deleteGoal(goal.id);

      toast.dismiss();
      toast.success("Target tabungan dan transaksi kontribusi terkait berhasil dihapus.");
      void queryClient.invalidateQueries({ queryKey: goalsQueryKey });
      void queryClient.invalidateQueries({ queryKey: ["budgets"] }); // also refresh budget spent if category was tracked
      void queryClient.invalidateQueries({ queryKey: ["accounts"] }); // refresh wallets balance
    } catch (error) {
      toast.dismiss();
      toast.error(
        error instanceof Error ? error.message : "Gagal menghapus target dan transaksi terkait."
      );
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Tabungan dengan progres dan deadline</p>
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight">
            Target
          </h1>
        </div>
        <Button className="rounded-full" onClick={openCreateDialog}>
          Target Baru
        </Button>
      </div>

      {goalsQuery.isLoading ? (
        <p className="text-sm text-muted-foreground">Memuat target...</p>
      ) : null}
      {goalsQuery.isError ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {goalsQuery.error instanceof Error
            ? goalsQuery.error.message
            : "Gagal memuat target."}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {goals.length ? goals.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            onContribute={() => handleContribute(goal)}
            onDelete={() => handleDeleteGoal(goal)}
            onEdit={() => openEditDialog(goal)}
          />
        )) : !goalsQuery.isLoading ? (
          <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground md:col-span-2">
            Belum ada target tabungan.
          </div>
        ) : null}
      </div>

      <GoalEditorDialog
        isOpen={goalEditor !== null}
        onClose={() => setGoalEditor(null)}
        goalEditor={goalEditor}
        setGoalEditor={setGoalEditor}
        onSave={handleSaveGoal}
        isPending={saveGoalMutation.isPending}
      />

      <GoalContributionDialog
        isOpen={contributionEditor !== null}
        onClose={() => setContributionEditor(null)}
        contributionEditor={contributionEditor}
        setContributionEditor={setContributionEditor}
        onSave={handleSaveContribution}
        isPending={isContributing}
      />

      <GoalDeleteConfirmationDialog
        isOpen={deleteTargetConfirmation !== null}
        onClose={() => setDeleteTargetConfirmation(null)}
        deleteTargetConfirmation={deleteTargetConfirmation}
        onConfirm={handleConfirmDeleteGoal}
      />
    </div>
  );
}
