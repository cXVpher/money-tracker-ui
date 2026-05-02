"use client";

import { API_BASE_URL, USE_MOCK_DATA } from "@/shared/_config/runtime";
import {
  configureMockAuthSimulation,
  getAuthHeaders,
  getMockAuthSimulationSnapshot,
  hasActiveRefresh,
  isMockAuthSimulationEnabled,
  refreshAccessToken,
  simulateNextMockRequest401,
  shouldSimulateMock401,
  storeAccessTokenFromPayload,
  waitForActiveRefresh,
} from "@/features/auth/_utils/jwt-session";

type ApiEnvelope<T> = {
  code: number;
  data: T;
  message: string;
};

declare global {
  interface Window {
    __duitkuAuthSimulation?: {
      run: typeof runMockAuthQueueSimulation;
      simulateNext401: typeof simulateNextMockRequest401;
      snapshot: typeof getMockAuthSimulationSnapshot;
    };
  }
}

export class ApiClientError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
  }
}

const MOCK_FALLBACK_STATUSES = new Set([404, 408, 425, 429, 500, 502, 503, 504]);
const REFRESH_PATH = "/api/auth/refresh";
const MOCK_SIMULATION_PATH = "/__mock/auth-simulation";

export function shouldUseMockFallback(error: unknown) {
  if (!(error instanceof ApiClientError)) {
    return true;
  }

  return error.status >= 500 || MOCK_FALLBACK_STATUSES.has(error.status);
}

export type ApiFetchOptions = RequestInit & {
  skipAuthRefresh?: boolean;
  skipAuthToken?: boolean;
};

export type MockAuthSimulationResponse = {
  authorization: string | null;
  ok: true;
  refreshCount: number;
};

export async function apiRequest<T>(
  path: string,
  init?: ApiFetchOptions
): Promise<T> {
  const response = await apiFetch(path, init);
  const payload = (await safeJson<ApiEnvelope<T>>(response)) ?? null;

  if (!response.ok) {
    throw new ApiClientError(
      payload?.message ?? "Terjadi kesalahan saat menghubungi server.",
      response.status
    );
  }

  if (!payload) {
    throw new ApiClientError("Respons server tidak valid.", response.status);
  }

  storeAccessTokenFromPayload(payload.data);

  return payload.data;
}

export async function apiFetch(
  path: string,
  init: ApiFetchOptions = {}
): Promise<Response> {
  if (USE_MOCK_DATA && !isMockAuthSimulationEnabled()) {
    return fetchWithDefaults(path, init);
  }

  if (!init.skipAuthRefresh && hasActiveRefresh()) {
    await waitForActiveRefresh();
  }

  const response = await fetchWithDefaults(path, init);

  if (
    response.status !== 401 ||
    init.skipAuthRefresh ||
    isRefreshRequest(path)
  ) {
    return response;
  }

  const refreshResult = await refreshAccessToken();

  if (!refreshResult.ok) {
    throw new ApiClientError(refreshResult.error.message, 401);
  }

  return fetchWithDefaults(path, {
    ...init,
    skipAuthRefresh: true,
  });
}

export async function runMockAuthQueueSimulation(requestCount = 3) {
  configureMockAuthSimulation({
    enabled: true,
    failNextRequest: true,
  });

  const firstRequest = apiRequest<MockAuthSimulationResponse>(MOCK_SIMULATION_PATH);

  await Promise.resolve();

  const queuedRequests = Array.from(
    { length: Math.max(0, requestCount - 1) },
    () => apiRequest<MockAuthSimulationResponse>(MOCK_SIMULATION_PATH)
  );

  return Promise.all([firstRequest, ...queuedRequests]);
}

async function fetchWithDefaults(path: string, init: ApiFetchOptions) {
  const headers = buildHeaders(init);

  if (USE_MOCK_DATA && isMockAuthSimulationEnabled() && shouldSimulateMock401()) {
    return createJsonResponse(
      {
        code: 401,
        data: null,
        message: "Simulated mock 401.",
      },
      401
    );
  }

  if (USE_MOCK_DATA && isMockAuthSimulationEnabled() && path === MOCK_SIMULATION_PATH) {
    return createJsonResponse(
      {
        code: 200,
        data: {
          authorization: headers.get("Authorization"),
          ok: true,
          refreshCount: getMockAuthSimulationSnapshot().refreshCount,
        } satisfies MockAuthSimulationResponse,
        message: "Mock auth simulation request succeeded.",
      },
      200
    );
  }

  return fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    ...init,
    headers,
  });
}

function buildHeaders(init: ApiFetchOptions) {
  const headers = new Headers(init.headers);

  headers.set("Accept", headers.get("Accept") ?? "application/json");

  if (!(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (!USE_MOCK_DATA && !init.skipAuthToken) {
    const authHeaders = getAuthHeaders();

    Object.entries(authHeaders).forEach(([key, value]) => {
      headers.set(key, value);
    });
  }

  if (USE_MOCK_DATA && isMockAuthSimulationEnabled() && !init.skipAuthToken) {
    const authHeaders = getAuthHeaders();

    Object.entries(authHeaders).forEach(([key, value]) => {
      headers.set(key, value);
    });
  }

  return headers;
}

function isRefreshRequest(path: string) {
  return path === REFRESH_PATH || path.endsWith(REFRESH_PATH);
}

async function safeJson<T>(response: Response): Promise<T | null> {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

function createJsonResponse(payload: unknown, status: number) {
  return new Response(JSON.stringify(payload), {
    headers: {
      "Content-Type": "application/json",
    },
    status,
  });
}

if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
  window.__duitkuAuthSimulation = {
    run: runMockAuthQueueSimulation,
    simulateNext401: simulateNextMockRequest401,
    snapshot: getMockAuthSimulationSnapshot,
  };
}
