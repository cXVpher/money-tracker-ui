import { Plus } from "lucide-react";
import { Button } from "@/shared/_components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/_components/ui/dialog";
import { Input } from "@/shared/_components/ui/input";
import { Label } from "@/shared/_components/ui/label";

export function BudgetDialog() {
  return (
    <Dialog>
      <DialogTrigger render={<Button className="rounded-full" />}>
        <Plus className="h-4 w-4" />
        Atur Budget
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah atau Edit Budget</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Kategori</Label>
            <Input id="category" placeholder="Makanan & Minuman" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="limit">Limit bulanan</Label>
            <Input id="limit" placeholder="Rp0" />
          </div>
          <Button>Simpan Budget</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
