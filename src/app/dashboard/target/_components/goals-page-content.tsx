"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { GOAL_ICON_OPTIONS } from "@/shared/_components/icons/app-icon";
import { Button } from "@/shared/_components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/_components/ui/dialog";
import { Input } from "@/shared/_components/ui/input";
import { Label } from "@/shared/_components/ui/label";
import type { Goal } from "@/shared/_types/finance";
import {
  contributeGoal,
  createGoal,
  deleteGoal,
  getGoals,
  updateGoal,
  type CreateGoalInput,
} from "@/services/goal.service";
import { GoalCard } from "./goal-card";

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

  const contributeGoalMutation = useMutation({
    mutationFn: contributeGoal,
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Gagal menambah kontribusi.");
    },
    onSuccess: () => {
      toast.success("Kontribusi berhasil disimpan.");
      void queryClient.invalidateQueries({ queryKey: goalsQueryKey });
    },
  });

  const deleteGoalMutation = useMutation({
    mutationFn: deleteGoal,
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Gagal menghapus target.");
    },
    onSuccess: () => {
      toast.success("Target berhasil dihapus.");
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
    const value = window.prompt(`Tambah kontribusi untuk "${goal.name}"?`);
    if (!value) {
      return;
    }

    const amount = Number(value);
    if (!Number.isFinite(amount) || amount === 0) {
      toast.error("Nominal kontribusi tidak valid.");
      return;
    }

    contributeGoalMutation.mutate({ amount, id: goal.id });
  }

  function handleDeleteGoal(goal: Goal) {
    if (!window.confirm(`Hapus target "${goal.name}"?`)) {
      return;
    }

    deleteGoalMutation.mutate(goal.id);
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
        )) : (
          <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground md:col-span-2">
            Belum ada target tabungan.
          </div>
        )}
      </div>

      <Dialog
        open={goalEditor !== null}
        onOpenChange={(open) => {
          if (!open) {
            setGoalEditor(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {goalEditor?.id ? "Edit Target" : "Target Baru"}
            </DialogTitle>
          </DialogHeader>
          {goalEditor ? (
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="goal-name">Nama target</Label>
                <Input
                  id="goal-name"
                  value={goalEditor.name}
                  onChange={(event) =>
                    setGoalEditor((current) =>
                      current ? { ...current, name: event.target.value } : current
                    )
                  }
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="goal-amount">Nominal target</Label>
                  <Input
                    id="goal-amount"
                    min={1}
                    type="number"
                    value={goalEditor.targetAmount}
                    onChange={(event) =>
                      setGoalEditor((current) =>
                        current
                          ? { ...current, targetAmount: Number(event.target.value) }
                          : current
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goal-deadline">Deadline</Label>
                  <Input
                    id="goal-deadline"
                    type="date"
                    value={goalEditor.deadline}
                    onChange={(event) =>
                      setGoalEditor((current) =>
                        current ? { ...current, deadline: event.target.value } : current
                      )
                    }
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="goal-icon">Icon</Label>
                  <select
                    id="goal-icon"
                    className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                    value={goalEditor.icon}
                    onChange={(event) =>
                      setGoalEditor((current) =>
                        current ? { ...current, icon: event.target.value } : current
                      )
                    }
                  >
                    {GOAL_ICON_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goal-color">Warna</Label>
                  <Input
                    id="goal-color"
                    type="color"
                    value={goalEditor.color}
                    onChange={(event) =>
                      setGoalEditor((current) =>
                        current ? { ...current, color: event.target.value } : current
                      )
                    }
                  />
                </div>
              </div>
            </div>
          ) : null}
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Batal</DialogClose>
            <Button disabled={saveGoalMutation.isPending} onClick={handleSaveGoal}>
              {saveGoalMutation.isPending ? "Menyimpan..." : "Simpan Target"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
