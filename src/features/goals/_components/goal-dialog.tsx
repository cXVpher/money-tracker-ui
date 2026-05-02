import { Plus, Target } from "@/shared/_components/icons/phosphor";
import { Button } from "@/shared/_components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/_components/ui/dialog";
import { Input } from "@/shared/_components/ui/input";
import { Label } from "@/shared/_components/ui/label";

export function GoalDialog() {
  return (
    <Dialog>
      <DialogTrigger render={<Button className="rounded-full" />}>
        <Plus className="h-4 w-4" />
        Target Baru
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Buat Target Tabungan</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="goal-name">Nama target</Label>
            <Input id="goal-name" placeholder="Dana darurat" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="target-amount">Nominal target</Label>
            <Input id="target-amount" placeholder="Rp0" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="goal-deadline">Deadline</Label>
            <Input id="goal-deadline" type="date" />
          </div>
          <Button>
            <Target className="h-4 w-4" />
            Simpan Target
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

