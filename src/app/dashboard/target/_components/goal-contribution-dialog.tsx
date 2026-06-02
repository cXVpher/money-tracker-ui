"use client";

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

type ContributionEditorState = {
  id: string;
  name: string;
  amount: number;
};

interface GoalContributionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  contributionEditor: ContributionEditorState | null;
  setContributionEditor: React.Dispatch<React.SetStateAction<ContributionEditorState | null>>;
  onSave: () => void;
  isPending: boolean;
}

export function GoalContributionDialog({
  isOpen,
  onClose,
  contributionEditor,
  setContributionEditor,
  onSave,
  isPending,
}: GoalContributionDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Kontribusi Tabungan</DialogTitle>
          <DialogDescription>
            Masukkan jumlah dana yang ingin Anda sisihkan untuk target <strong>"{contributionEditor?.name}"</strong>.
          </DialogDescription>
        </DialogHeader>

        {contributionEditor ? (
          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="contribution-amount">Jumlah Dana (Rp)</Label>
              <Input
                id="contribution-amount"
                type="number"
                min={1}
                value={contributionEditor.amount || ""}
                onChange={(event) =>
                  setContributionEditor((current) =>
                    current ? { ...current, amount: Number(event.target.value) } : current
                  )
                }
                placeholder="e.g. 50000"
                className="h-10 text-lg font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <span className="text-xs text-muted-foreground">Pilih Cepat Nominal:</span>
              <div className="grid grid-cols-4 gap-2">
                {[10_000, 50_000, 100_000, 500_000].map((nominal) => (
                  <Button
                    key={nominal}
                    type="button"
                    variant="outline"
                    className="text-xs py-1.5"
                    onClick={() =>
                      setContributionEditor((current) =>
                        current ? { ...current, amount: (current.amount || 0) + nominal } : current
                      )
                    }
                  >
                    +Rp{(nominal / 1000).toLocaleString("id-ID")}k
                  </Button>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Batal</DialogClose>
          <Button disabled={isPending} onClick={onSave}>
            {isPending ? "Menyimpan..." : "Simpan Kontribusi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
