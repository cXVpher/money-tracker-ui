"use client";

import { Bell, Moon, Search, Sun } from "@/shared/_components/icons/phosphor";
import { useEffect, useMemo, useState } from "react";
import { Avatar, AvatarFallback } from "@/shared/_components/ui/avatar";
import { Button } from "@/shared/_components/ui/button";
import { Input } from "@/shared/_components/ui/input";
import { useTheme } from "@/shared/_components/providers/theme-provider";
import { getProfile } from "@/services/profile.service";

const DEFAULT_PROFILE_NAME = "Dashboard Keuangan";
const DEFAULT_INITIALS = "DK";

export function Topbar() {
  const { resolvedTheme, setTheme, theme } = useTheme();
  const [backendName, setBackendName] = useState<string | null>(null);
  const isLightTheme = resolvedTheme === "light";

  useEffect(() => {
    let isActive = true;

    async function loadProfile() {
      try {
        const profile = await getProfile();

        if (isActive) {
          setBackendName(profile.user.name);
        }
      } catch {
        if (isActive) {
          setBackendName(null);
        }
      }
    }

    void loadProfile();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (theme === "system") {
      setTheme("dark");
    }
  }, [setTheme, theme]);

  function handleToggleTheme() {
    setTheme(isLightTheme ? "dark" : "light");
  }

  const greetingName = backendName ?? DEFAULT_PROFILE_NAME;
  const initials = getInitials(greetingName);

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
            {greetingName}
          </h1>
        </div>

        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={handleToggleTheme}
          aria-label={isLightTheme ? "Gunakan tema gelap" : "Gunakan tema terang"}
          title={isLightTheme ? "Tema gelap" : "Tema terang"}
        >
          {isLightTheme ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </Button>
        <Avatar className="h-9 w-9">
          <AvatarFallback className="bg-primary text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}

function getInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return initials || DEFAULT_INITIALS;
}

