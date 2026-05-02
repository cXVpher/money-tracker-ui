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
import { USE_MOCK_DATA } from "@/shared/_config/runtime";
import { MOCK_ACCOUNT } from "@/shared/_constants/mock-auth";
import { Input } from "@/shared/_components/ui/input";
import { Label } from "@/shared/_components/ui/label";
import { ApiClientError, shouldUseMockFallback } from "@/shared/_utils/api-client";
import { login } from "@/shared/_utils/backend-client";
import { loginWithMockAccount } from "@/shared/_utils/mock-auth";

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
      if (USE_MOCK_DATA) {
        const result = loginWithMockAccount(phone, password);

        if (!result.ok) {
          toast.error(result.message);
          return;
        }

        toast.success("Login mock berhasil.");
        router.push(nextPath || "/dashboard");
        return;
      }

      await login({ password, phone });
      toast.success("Login berhasil.");
      router.push(nextPath || "/dashboard");
    } catch (error) {
      if (!USE_MOCK_DATA && shouldUseMockFallback(error)) {
        const fallbackResult = loginWithMockAccount(phone, password);

        if (fallbackResult.ok) {
          toast.warning("API login belum aktif. Masuk dengan akun mock.");
          router.push(nextPath || "/dashboard");
          return;
        }
      }

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
    if (USE_MOCK_DATA) {
      toast.info("Google login aktif saat NEXT_PUBLIC_MOCK_DATA=false.");
      return;
    }

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
        {USE_MOCK_DATA ? (
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm">
            <p className="font-semibold text-foreground">Akun Mock</p>
            <p className="mt-1 text-muted-foreground">
              Nomor: <span className="font-medium text-foreground">{MOCK_ACCOUNT.phone}</span>
            </p>
            <p className="text-muted-foreground">
              Password: <span className="font-medium text-foreground">{MOCK_ACCOUNT.password}</span>
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground">Fallback Mock</p>
            <p className="mt-1">
              Jika API login belum aktif, gunakan akun mock:
              {" "}
              <span className="font-medium text-foreground">{MOCK_ACCOUNT.phone}</span>
              {" / "}
              <span className="font-medium text-foreground">{MOCK_ACCOUNT.password}</span>
            </p>
          </div>
        )}
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
        disabled={USE_MOCK_DATA || isGoogleSubmitting}
        onClick={() => void handleGoogleLogin()}
      >
        {USE_MOCK_DATA
          ? "Google aktif saat mode API"
          : isGoogleSubmitting
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

