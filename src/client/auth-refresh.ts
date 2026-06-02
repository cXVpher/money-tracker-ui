"use client";

import { FRONTEND_API_BASE_URL } from "@/shared/_config/runtime";

type TokenExpiryPayload = {
  data?: unknown;
  expires_in?: unknown;
  expiresIn?: unknown;
};

type RefreshResult =
  | {
      expiresIn: number;
      ok: true;
    }
  | {
      error: Error;
      ok: false;
    };

let refreshPromise: Promise<RefreshResult> | null = null;
let refreshTimeoutId: number | null = null;
let isPeriodicRefreshActive = false;

const DEFAULT_ACCESS_TOKEN_EXPIRES_IN_SECONDS = 15 * 60;
const REFRESH_SAFETY_WINDOW_MS = 60 * 1000;
const MIN_REFRESH_DELAY_MS = 30 * 1000;

export function startPeriodicAuthRefresh() {
  if (isPeriodicRefreshActive) return;

  isPeriodicRefreshActive = true;
  scheduleNextRefresh(0);
}

export function stopPeriodicAuthRefresh() {
  isPeriodicRefreshActive = false;

  if (refreshTimeoutId !== null) {
    clearTimeout(refreshTimeoutId);
    refreshTimeoutId = null;
  }
}

async function runRefreshRequest(): Promise<RefreshResult> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = performRefreshRequest().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}

async function performRefreshRequest(): Promise<RefreshResult> {
  try {
    const response = await fetch(`${FRONTEND_API_BASE_URL}/auth/refresh`, {
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (!response.ok) {
      return {
        error: new Error("Refresh token tidak valid atau sudah expired."),
        ok: false,
      };
    }

    const payload = await safeJson(response);

    return {
      expiresIn:
        extractExpiresIn(payload) ?? DEFAULT_ACCESS_TOKEN_EXPIRES_IN_SECONDS,
      ok: true,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error : new Error("Gagal refresh token."),
      ok: false,
    };
  }
}

async function refreshAndScheduleNext() {
  const result = await runRefreshRequest();

  if (!isPeriodicRefreshActive) {
    return;
  }

  scheduleNextRefresh(getRefreshDelayMs(result.ok ? result.expiresIn : null));
}

function scheduleNextRefresh(delayMs: number) {
  if (!isPeriodicRefreshActive) {
    return;
  }

  if (refreshTimeoutId !== null) {
    clearTimeout(refreshTimeoutId);
  }

  refreshTimeoutId = window.setTimeout(() => {
    refreshTimeoutId = null;
    void refreshAndScheduleNext();
  }, delayMs);
}

function getRefreshDelayMs(expiresInSeconds: number | null) {
  const expiresInMs =
    (expiresInSeconds ?? DEFAULT_ACCESS_TOKEN_EXPIRES_IN_SECONDS) * 1000;

  return Math.max(MIN_REFRESH_DELAY_MS, expiresInMs - REFRESH_SAFETY_WINDOW_MS);
}

function extractExpiresIn(payload: unknown): number | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const candidate = payload as TokenExpiryPayload;
  const expiresIn = toPositiveSeconds(
    candidate.expires_in ?? candidate.expiresIn
  );

  if (expiresIn !== null) {
    return expiresIn;
  }

  if (candidate.data) {
    return extractExpiresIn(candidate.data);
  }

  return null;
}

function toPositiveSeconds(value: unknown): number | null {
  const parsed = typeof value === "string" ? Number(value) : value;

  if (typeof parsed !== "number" || !Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return Math.floor(parsed);
}

async function safeJson(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}
