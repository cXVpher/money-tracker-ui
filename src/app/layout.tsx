import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@/shared/_components/providers/theme-provider";
import { TooltipProvider } from "@/shared/_components/ui/tooltip";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = localFont({
  src: [
    {
      path: "./fonts/geist-sans.woff2",
      style: "normal",
      weight: "400",
    },
    {
      path: "./fonts/geist-sans-ext.woff2",
      style: "normal",
      weight: "400",
    },
  ],
  variable: "--font-sans",
  display: "swap",
});

const geistHeading = localFont({
  src: [
    {
      path: "./fonts/geist-sans.woff2",
      style: "normal",
      weight: "600",
    },
    {
      path: "./fonts/geist-sans-ext.woff2",
      style: "normal",
      weight: "600",
    },
  ],
  variable: "--font-heading",
  display: "swap",
});

const geistMono = localFont({
  src: [
    {
      path: "./fonts/geist-mono.woff2",
      style: "normal",
      weight: "400",
    },
    {
      path: "./fonts/geist-mono-ext.woff2",
      style: "normal",
      weight: "400",
    },
  ],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DuitKu - Kelola Keuangan Pribadimu",
  description:
    "Aplikasi pencatatan keuangan pribadi. Catat pemasukan & pengeluaran, lacak budget, pantau investasi, dan capai tujuan finansialmu.",
  keywords: [
    "keuangan pribadi",
    "budget tracker",
    "pencatatan keuangan",
    "pengeluaran",
    "pemasukan",
    "tabungan",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistHeading.variable} ${geistMono.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
