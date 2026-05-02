import Link from "next/link";
import { AtSign, GitFork, Globe, Mail, Wallet } from "@/shared/_components/icons/phosphor";
import { APP_DESCRIPTION, APP_NAME } from "@/shared/_constants/brand";

const footerLinkGroups = [
  {
    title: "Produk",
    links: [
      { label: "Fitur", href: "#fitur" },
      { label: "Perbandingan", href: "#perbandingan" },
      { label: "Harga", href: "#harga" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Aplikasi",
    links: [
      { label: "Masuk", href: "/login" },
      { label: "Daftar Gratis", href: "/register" },
      { label: "Dashboard", href: "/dashboard" },
      { label: "Pengaturan", href: "/dashboard/pengaturan" },
    ],
  },
  {
    title: "Bantuan",
    links: [
      { label: "Pusat Bantuan", href: "mailto:support@duitku.app" },
      { label: "Kontak", href: "mailto:hello@duitku.app" },
      { label: "Kebijakan Privasi", href: "/privacy" },
      { label: "Syarat Layanan", href: "/terms" },
    ],
  },
];

const socialLinks = [
  { label: "Website", href: "/", icon: Globe },
  { label: "Komunitas", href: "mailto:community@duitku.app", icon: AtSign },
  { label: "Roadmap", href: "/roadmap", icon: GitFork },
  { label: "Email", href: "mailto:hello@duitku.app", icon: Mail },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <Link href="/" className="mb-4 inline-flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Wallet className="h-5 w-5" />
              </div>
              <span className="font-[family-name:var(--font-heading)] text-xl font-bold tracking-tight">
                {APP_NAME}
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-7 text-muted-foreground">
              {APP_DESCRIPTION}. Catat transaksi, pantau budget, dan baca arus
              kas pribadi dari satu dashboard yang rapi.
            </p>
            <div className="mt-6 flex items-center gap-2">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                >
                  <social.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {footerLinkGroups.map((section) => (
              <div key={section.title}>
                <h3 className="mb-4 text-sm font-semibold">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright 2026 {APP_NAME}. All rights reserved.</p>
          <p>Dibuat untuk pengelolaan keuangan pribadi yang lebih teratur.</p>
        </div>
      </div>
    </footer>
  );
}

