import { HandCoins, Plus } from "@/shared/_components/icons/phosphor";
import { Button } from "@/shared/_components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/_components/ui/dialog";
import { Input } from "@/shared/_components/ui/input";
import { Label } from "@/shared/_components/ui/label";

export function DebtDialog() {
  return (
    <Dialog>
      <DialogTrigger render={<Button className="rounded-full" />}>
        <Plus className="h-4 w-4" />
        Tambah Catatan
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Hutang atau Piutang</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="person">Nama</Label>
            <Input id="person" placeholder="Nama orang" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Nominal</Label>
            <Input id="amount" placeholder="Rp0" />
          </div>
          <Button>
            <HandCoins className="h-4 w-4" />
            Simpan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

