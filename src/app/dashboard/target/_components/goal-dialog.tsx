"use client";

import { useState } from "react";
import { Plus, Target } from "lucide-react";
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
import type { Goal } from "@/shared/_types/finance";
import { addStoredGoal, createClientId } from "@/shared/_utils/mock-client-store";

type GoalDialogProps = {
  onGoalCreated?: (goal: Goal) => void;
};

export function GoalDialog({ onGoalCreated }: GoalDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("0");
  const [goalDeadline, setGoalDeadline] = useState("");
  const [goalIcon, setGoalIcon] = useState("🎯");

  function resetForm() {
    setGoalName("");
    setTargetAmount("");
    setCurrentAmount("0");
    setGoalDeadline("");
    setGoalIcon("🎯");
  }

  function handleSaveGoal(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedTargetAmount = Number(targetAmount);
    const parsedCurrentAmount = Number(currentAmount);

    if (!goalName.trim()) {
      toast.error("Nama target wajib diisi.");
      return;
    }

    if (Number.isNaN(parsedTargetAmount) || parsedTargetAmount <= 0) {
      toast.error("Nominal target harus lebih besar dari 0.");
      return;
    }

    if (Number.isNaN(parsedCurrentAmount) || parsedCurrentAmount < 0) {
      toast.error("Nominal terkumpul tidak valid.");
      return;
    }

    if (!goalDeadline) {
      toast.error("Deadline wajib diisi.");
      return;
    }

    const goal: Goal = {
      id: createClientId("goal"),
      name: goalName.trim(),
      targetAmount: parsedTargetAmount,
      currentAmount: parsedCurrentAmount,
      deadline: goalDeadline,
      icon: goalIcon || "🎯",
      color: "#22c55e",
    };

    addStoredGoal(goal);
    onGoalCreated?.(goal);
    toast.success("Target mock berhasil ditambahkan.");
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
        Target Baru
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Buat Target Tabungan</DialogTitle>
          <DialogDescription>
            Target baru disimpan lokal sampai API goals tersedia.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4" onSubmit={handleSaveGoal}>
          <div className="space-y-2">
            <Label htmlFor="goal-name">Nama target</Label>
            <Input
              id="goal-name"
              placeholder="Dana darurat"
              value={goalName}
              onChange={(event) => setGoalName(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="goal-icon">Icon</Label>
            <Input
              id="goal-icon"
              placeholder="🎯"
              value={goalIcon}
              onChange={(event) => setGoalIcon(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="target-amount">Nominal target</Label>
            <Input
              id="target-amount"
              placeholder="8000000"
              value={targetAmount}
              onChange={(event) => setTargetAmount(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="current-amount">Sudah terkumpul</Label>
            <Input
              id="current-amount"
              placeholder="0"
              value={currentAmount}
              onChange={(event) => setCurrentAmount(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="goal-deadline">Deadline</Label>
            <Input
              id="goal-deadline"
              type="date"
              value={goalDeadline}
              onChange={(event) => setGoalDeadline(event.target.value)}
            />
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" type="button" />}>
              Batal
            </DialogClose>
            <Button type="submit">
              <Target className="h-4 w-4" />
              Simpan Target
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
