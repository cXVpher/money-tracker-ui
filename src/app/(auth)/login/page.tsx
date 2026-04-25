import Link from "next/link";
import { Mail } from "lucide-react";
import { AuthCard } from "@/features/auth/_components/auth-card";
import { OAuthButton } from "@/features/auth/_components/oauth-button";
import { Button } from "@/shared/_components/ui/button";
import { Input } from "@/shared/_components/ui/input";
import { Label } from "@/shared/_components/ui/label";

export default function LoginPage() {
  return (
    <AuthCard
      title="Masuk ke DuitKu"
      description="Lanjutkan pencatatan keuanganmu dari dashboard."
    >
      <form className="space-y-4">
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
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="#"
              className="text-xs font-medium text-primary hover:underline"
            >
              Lupa password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="Masukkan password"
            className="h-11"
          />
        </div>
        <Button type="button" className="h-11 w-full rounded-full font-semibold">
          <Mail className="h-4 w-4" />
          Masuk
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        atau
        <span className="h-px flex-1 bg-border" />
      </div>

      <OAuthButton>Masuk dengan Google</OAuthButton>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Belum punya akun?{" "}
        <Link href="/register" className="font-semibold text-primary">
          Daftar gratis
        </Link>
      </p>
    </AuthCard>
  );
}
