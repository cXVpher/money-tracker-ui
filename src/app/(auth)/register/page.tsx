import Link from "next/link";
import { UserPlus } from "lucide-react";
import { AuthCard } from "@/features/auth/_components/auth-card";
import { OAuthButton } from "@/features/auth/_components/oauth-button";
import { Button } from "@/shared/_components/ui/button";
import { Input } from "@/shared/_components/ui/input";
import { Label } from "@/shared/_components/ui/label";

export default function RegisterPage() {
  return (
    <AuthCard
      title="Buat Akun Baru"
      description="Mulai catat transaksi dan lihat arus kas dalam beberapa menit."
    >
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nama</Label>
          <Input id="name" placeholder="Nama lengkap" className="h-11" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="nama@email.com"
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Minimal 8 karakter"
            className="h-11"
          />
        </div>
        <Button type="button" className="h-11 w-full rounded-full font-semibold">
          <UserPlus className="h-4 w-4" />
          Daftar Gratis
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        atau
        <span className="h-px flex-1 bg-border" />
      </div>

      <OAuthButton>Daftar dengan Google</OAuthButton>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-semibold text-primary">
          Masuk
        </Link>
      </p>
    </AuthCard>
  );
}
