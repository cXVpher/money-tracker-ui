import { Plus, Wallet } from "@/shared/_components/icons/phosphor";
import { Button } from "@/shared/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/_components/ui/dialog";
import { Input } from "@/shared/_components/ui/input";
import { Label } from "@/shared/_components/ui/label";

export function AccountDialog() {
  return (
    <Dialog>
      <DialogTrigger render={<Button className="rounded-full" />}>
        <Plus className="h-4 w-4" />
        Tambah Akun
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Akun Finansial</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="account-name">Nama akun</Label>
            <Input id="account-name" placeholder="BCA, GoPay, Tunai" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="account-balance">Saldo awal</Label>
            <Input id="account-balance" placeholder="Rp0" />
          </div>
          <Button>
            <Wallet className="h-4 w-4" />
            Simpan Akun
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

