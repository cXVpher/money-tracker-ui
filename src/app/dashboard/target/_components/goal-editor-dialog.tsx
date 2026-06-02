"use client";

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
import type { CreateGoalInput } from "@/services/goal.service";

interface GoalEditorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  goalEditor: (CreateGoalInput & { id?: string }) | null;
  setGoalEditor: React.Dispatch<React.SetStateAction<(CreateGoalInput & { id?: string }) | null>>;
  onSave: () => void;
  isPending: boolean;
}

export function GoalEditorDialog({
  isOpen,
  onClose,
  goalEditor,
  setGoalEditor,
  onSave,
  isPending,
}: GoalEditorDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
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
                  value={goalEditor.targetAmount || ""}
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
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
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
          <Button disabled={isPending} onClick={onSave}>
            {isPending ? "Menyimpan..." : "Simpan Target"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
