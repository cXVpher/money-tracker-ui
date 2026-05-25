"use client";

import { FRONTEND_API_BASE_URL } from "@/shared/_config/runtime";

type ApiEnvelope<T> = {
  code: number;
  data: T;
  message: string;
};

type TokenLikePayload = {
  access_token?: unknown;
  accessToken?: unknown;
  expires_in?: unknown;
  expiresIn?: unknown;
  token?: unknown;
};

type RefreshPayload = TokenLikePayload & {
  data?: TokenLikePayload;
};

type RefreshResult =
  | {
      ok: true;
      accessToken: string | null;
    }
  | {
      ok: false;
      error: Error;
    };

let refreshPromise: Promise<RefreshResult> | null = null;

export function getAccessToken() {
  return null;
}

export function setAccessToken(nextAccessToken: string | null) {
  // no-op for httpOnly cookies
}

export function clearAccessToken() {
  // no-op for httpOnly cookies
}

export function getAuthHeaders(): Record<string, string> {
  return {};
}

export function storeAccessTokenFromPayload(payload: unknown) {
  // The token is handled automatically via HttpOnly cookies by the backend.
  return null;
}

export function hasActiveRefresh() {
  return refreshPromise != null;
}

export async function waitForActiveRefresh() {
  if (!refreshPromise) {
    return;
  }

  await refreshPromise;
}

export function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = runRefreshRequest().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

// removed mock logic

async function runRefreshRequest(): Promise<RefreshResult> {
  try {
    const response = await fetch(`${FRONTEND_API_BASE_URL}/api/auth/refresh`, {
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

    return {
      accessToken: null,
      ok: true,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error : new Error("Gagal refresh token."),
      ok: false,
    };
  }
}

function extractAccessToken(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const candidate = payload as TokenLikePayload & { data?: unknown };
  const token =
    candidate.access_token ?? candidate.accessToken ?? candidate.token;

  if (typeof token === "string" && token.trim()) {
    return token;
  }

  if (candidate.data) {
    return extractAccessToken(candidate.data);
  }

  return null;
}

async function safeJson(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function delay(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}
