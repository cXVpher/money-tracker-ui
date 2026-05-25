"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { Mail } from "@/shared/_components/icons/phosphor";
import { toast } from "sonner";
import { AuthCard } from "@/features/auth/_components/auth-card";
import { OAuthButton } from "@/features/auth/_components/oauth-button";
import { Button } from "@/shared/_components/ui/button";
import { Input } from "@/shared/_components/ui/input";
import { Label } from "@/shared/_components/ui/label";
import { ApiClientError } from "@/shared/_utils/api-client";
import { login } from "@/shared/_utils/backend-client";

export default function LoginPage() {
  const router = useRouter();
  const nextPath = useMemo(() => {
    if (typeof window === "undefined") {
      return null;
    }

    return new URLSearchParams(window.location.search).get("next");
  }, []);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!phone.trim() || !password.trim()) {
      toast.error("Nomor telepon dan password wajib diisi.");
      return;
    }

    setIsSubmitting(true);

    try {
      await login({ password, phone });
      toast.success("Login berhasil.");
      router.push(nextPath || "/dashboard");
    } catch (error) {
      const message =
        error instanceof ApiClientError
          ? error.message
          : "Login gagal. Coba lagi.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogleLogin() {
    setIsGoogleSubmitting(true);
    await signIn("google", {
      callbackUrl: nextPath || "/dashboard",
    });
  }

  return (
    <AuthCard
      title="Masuk ke DuitKu"
      description="Lanjutkan pencatatan keuanganmu dari dashboard."
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="phone">Nomor WhatsApp</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="628123456789"
            className="h-11"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
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
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <Button
          type="submit"
          className="h-11 w-full rounded-full font-semibold"
          disabled={isSubmitting}
        >
          <Mail className="h-4 w-4" />
          {isSubmitting ? "Memproses..." : "Masuk"}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        atau
        <span className="h-px flex-1 bg-border" />
      </div>

      <OAuthButton
        disabled={isGoogleSubmitting}
        onClick={() => void handleGoogleLogin()}
      >
        {isGoogleSubmitting
            ? "Menghubungkan..."
            : "Masuk dengan Google"}
      </OAuthButton>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Belum punya akun?{" "}
        <Link href="/register" className="font-semibold text-primary">
          Daftar gratis
        </Link>
      </p>
    </AuthCard>
  );
}

