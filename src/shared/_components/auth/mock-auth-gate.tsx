"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { USE_MOCK_DATA } from "@/shared/_config/runtime";
import {
  type MockSession,
  subscribeToMockSession,
  getMockSessionSnapshot,
} from "@/shared/_utils/mock-auth";

const getMockSessionServerSnapshot = () =>
  (USE_MOCK_DATA ? undefined : null) as string | null | undefined;

export function MockAuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const rawSession = useSyncExternalStore(
    subscribeToMockSession,
    getMockSessionSnapshot,
    getMockSessionServerSnapshot
  );
  const session = useMemo<MockSession | null | undefined>(() => {
    if (rawSession === undefined) {
      return undefined;
    }

    if (!rawSession) {
      return null;
    }

    try {
      return JSON.parse(rawSession) as MockSession;
    } catch {
      return null;
    }
  }, [rawSession]);

  useEffect(() => {
    if (!USE_MOCK_DATA) {
      return;
    }

    if (!session) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [pathname, router, session]);

  if (USE_MOCK_DATA && session === undefined) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
        Memeriksa sesi...
      </div>
    );
  }

  if (USE_MOCK_DATA && !session) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
        Memeriksa sesi...
      </div>
    );
  }

  return <>{children}</>;
}
