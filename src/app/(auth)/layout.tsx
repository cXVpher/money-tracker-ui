import Link from "next/link";
import { Wallet } from "lucide-react";
import { APP_NAME } from "@/shared/_constants/brand";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto grid min-h-screen max-w-6xl lg:grid-cols-[0.95fr_1.05fr]">
        <section className="hidden border-r border-border bg-accent/30 px-10 py-12 lg:flex lg:flex-col lg:justify-between">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Wallet className="h-5 w-5" />
            </span>
            <span className="font-[family-name:var(--font-heading)] text-xl font-bold">
              {APP_NAME}
            </span>
          </Link>

          <div className="space-y-5">
            <p className="max-w-md font-[family-name:var(--font-heading)] text-4xl font-bold leading-tight">
              Satu tempat untuk mencatat, membaca, dan mengendalikan cashflow.
            </p>
            <p className="max-w-sm text-sm leading-7 text-muted-foreground">
              Mulai dari transaksi harian, budget, target tabungan, sampai
              laporan bulanan tanpa spreadsheet yang berantakan.
            </p>
          </div>

          <p className="text-sm text-muted-foreground">
            Data demo. Integrasi backend menyusul saat API siap.
          </p>
        </section>

        <section className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
          <div className="w-full max-w-md">
            <Link
              href="/"
              className="mb-8 inline-flex items-center gap-2 lg:hidden"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Wallet className="h-5 w-5" />
              </span>
              <span className="font-[family-name:var(--font-heading)] text-xl font-bold">
                {APP_NAME}
              </span>
            </Link>
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
