"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { UserPlus } from "@/shared/_components/icons/phosphor";
import { toast } from "sonner";
import { AuthCard } from "@/features/auth/_components/auth-card";
import { OAuthButton } from "@/features/auth/_components/oauth-button";
import { Button } from "@/shared/_components/ui/button";
import { USE_MOCK_DATA } from "@/shared/_config/runtime";
import { Input } from "@/shared/_components/ui/input";
import { Label } from "@/shared/_components/ui/label";
import { ApiClientError, shouldUseMockFallback } from "@/shared/_utils/api-client";
import { register } from "@/shared/_utils/backend-client";
import { registerMockAccount } from "@/shared/_utils/mock-auth";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim() || !phone.trim() || !password.trim()) {
      toast.error("Nama, nomor telepon, dan password wajib diisi.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (USE_MOCK_DATA) {
        registerMockAccount({
          email,
          name,
          password,
          phone,
        });
        toast.success("Akun mock berhasil dibuat dan langsung login.");
        router.push("/dashboard");
        return;
      }

      await register({
        email,
        name,
        password,
        phone,
        referralCode,
      });
      toast.success("Registrasi berhasil.");
      router.push("/dashboard");
    } catch (error) {
      if (!USE_MOCK_DATA && shouldUseMockFallback(error)) {
        registerMockAccount({
          email,
          name,
          password,
          phone,
        });
        toast.warning("API registrasi belum aktif. Akun mock lokal dibuat.");
        router.push("/dashboard");
        return;
      }

      const message =
        error instanceof ApiClientError
          ? error.message
          : "Registrasi gagal. Coba lagi.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthCard
      title="Buat Akun Baru"
      description="Mulai catat transaksi dan lihat arus kas dalam beberapa menit."
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="name">Nama</Label>
          <Input
            id="name"
            placeholder="Nama lengkap"
            className="h-11"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
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
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="nama@email.com"
            className="h-11"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Minimal 8 karakter"
            className="h-11"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="referral-code">Kode Referral</Label>
          <Input
            id="referral-code"
            placeholder="Opsional"
            className="h-11"
            value={referralCode}
            onChange={(event) => setReferralCode(event.target.value)}
          />
        </div>
        <Button
          type="submit"
          className="h-11 w-full rounded-full font-semibold"
          disabled={isSubmitting}
        >
          <UserPlus className="h-4 w-4" />
          {isSubmitting ? "Memproses..." : "Daftar Gratis"}
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

