"use client";

import { Bell, Search, Settings } from "lucide-react";
import { Avatar, AvatarFallback } from "@/shared/_components/ui/avatar";
import { Button } from "@/shared/_components/ui/button";
import { Input } from "@/shared/_components/ui/input";

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <div className="hidden min-w-0 flex-1 items-center lg:flex">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari transaksi, akun, atau kategori"
              className="h-10 rounded-full pl-9"
            />
          </div>
        </div>

        <div className="min-w-0 flex-1 lg:hidden">
          <p className="text-xs text-muted-foreground">Selamat datang</p>
          <h1 className="truncate font-[family-name:var(--font-heading)] text-lg font-bold">
            Dashboard Keuangan
          </h1>
        </div>

        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Settings className="h-4 w-4" />
        </Button>
        <Avatar className="h-9 w-9">
          <AvatarFallback className="bg-primary text-primary-foreground">
            BP
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
