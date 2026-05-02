"use client";

import { API_BASE_URL } from "@/shared/_config/runtime";

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

export type MockAuthSimulationOptions = {
  enabled?: boolean;
  failNextRequest?: boolean;
  refreshDelayMs?: number;
};

const MOCK_ACCESS_TOKEN = "mock-access-token";
const MOCK_REFRESHED_ACCESS_TOKEN = "mock-refreshed-access-token";
const DEFAULT_MOCK_REFRESH_DELAY_MS = 150;

let accessToken: string | null = null;
let refreshPromise: Promise<RefreshResult> | null = null;
let mockSimulationEnabled =
  process.env.NEXT_PUBLIC_AUTH_SIMULATION === "true" ||
  process.env.NEXT_PUBLIC_AUTH_SIMULATE_401 === "true";
let mockShouldFailNextRequest = mockSimulationEnabled;
let mockRefreshDelayMs = DEFAULT_MOCK_REFRESH_DELAY_MS;
let mockRefreshCount = 0;

if (mockSimulationEnabled) {
  accessToken = MOCK_ACCESS_TOKEN;
}

export function getAccessToken() {
  return accessToken;
}

export function setAccessToken(nextAccessToken: string | null) {
  accessToken = nextAccessToken;
}

export function clearAccessToken() {
  accessToken = null;
}

export function getAuthHeaders() {
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
}

export function storeAccessTokenFromPayload(payload: unknown) {
  const nextAccessToken = extractAccessToken(payload);

  if (nextAccessToken) {
    setAccessToken(nextAccessToken);
  }

  return nextAccessToken;
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

export function configureMockAuthSimulation(options: MockAuthSimulationOptions = {}) {
  mockSimulationEnabled = options.enabled ?? true;
  mockShouldFailNextRequest = options.failNextRequest ?? true;
  mockRefreshDelayMs = options.refreshDelayMs ?? DEFAULT_MOCK_REFRESH_DELAY_MS;

  if (mockSimulationEnabled && !accessToken) {
    accessToken = MOCK_ACCESS_TOKEN;
  }
}

export function simulateNextMockRequest401() {
  configureMockAuthSimulation({ enabled: true, failNextRequest: true });
}

export function isMockAuthSimulationEnabled() {
  return mockSimulationEnabled;
}

export function shouldSimulateMock401() {
  if (!mockSimulationEnabled || !mockShouldFailNextRequest) {
    return false;
  }

  mockShouldFailNextRequest = false;
  return true;
}

export function getMockAuthSimulationSnapshot() {
  return {
    accessToken,
    enabled: mockSimulationEnabled,
    refreshCount: mockRefreshCount,
    shouldFailNextRequest: mockShouldFailNextRequest,
  };
}

async function runRefreshRequest(): Promise<RefreshResult> {
  if (mockSimulationEnabled) {
    await delay(mockRefreshDelayMs);
    mockRefreshCount += 1;
    accessToken = MOCK_REFRESHED_ACCESS_TOKEN;

    return {
      accessToken,
      ok: true,
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (!response.ok) {
      clearAccessToken();
      return {
        error: new Error("Refresh token tidak valid atau sudah expired."),
        ok: false,
      };
    }

    const payload = (await safeJson(response)) as ApiEnvelope<RefreshPayload> | null;
    const nextAccessToken = storeAccessTokenFromPayload(payload?.data ?? payload);

    return {
      accessToken: nextAccessToken,
      ok: true,
    };
  } catch (error) {
    clearAccessToken();

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
