"use client";

import {
  AppIcon,
  GOAL_ICON_OPTIONS,
} from "@/shared/_components/icons/app-icon";
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
                <Label>Icon</Label>
                <div className="grid grid-cols-7 gap-2 rounded-lg border border-input bg-background p-2">
                  {GOAL_ICON_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      aria-label={option.label}
                      title={option.label}
                      className={
                        goalEditor.icon === option.value
                          ? "flex h-10 w-10 items-center justify-center rounded-lg border border-primary bg-primary/15 text-primary ring-2 ring-primary/40"
                          : "flex h-10 w-10 items-center justify-center rounded-lg border border-transparent text-muted-foreground hover:border-border hover:bg-muted hover:text-foreground"
                      }
                      onClick={() =>
                        setGoalEditor((current) =>
                          current ? { ...current, icon: option.value } : current
                        )
                      }
                    >
                      <AppIcon name={option.value} size={22} weight="fill" />
                    </button>
                  ))}
                </div>
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
