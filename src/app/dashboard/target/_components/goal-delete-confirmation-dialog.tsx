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
import type { Goal } from "@/shared/_types/finance";

interface GoalDeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  deleteTargetConfirmation: Goal | null;
  onConfirm: () => void;
}

export function GoalDeleteConfirmationDialog({
  isOpen,
  onClose,
  deleteTargetConfirmation,
  onConfirm,
}: GoalDeleteConfirmationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-destructive flex items-center gap-2">
            ⚠️ Hapus Target Tabungan?
          </DialogTitle>
          <DialogDescription className="pt-2 text-sm leading-relaxed">
            Apakah Anda yakin ingin menghapus target <strong>"{deleteTargetConfirmation?.name}"</strong>?
            <br /><br />
            Seluruh riwayat transaksi pengeluaran (*expense*) kontribusi yang terkait dengan target tabungan ini akan <strong>dihapus secara otomatis</strong> dari riwayat transaksi, dan saldo rekening bank/e-wallet Anda akan dikembalikan secara utuh.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4 gap-2 sm:gap-0">
          <DialogClose render={<Button variant="outline" />}>Batal</DialogClose>
          <Button
            variant="destructive"
            onClick={onConfirm}
          >
            Ya, Hapus Target
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
