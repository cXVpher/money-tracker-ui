"use client";

import { FRONTEND_API_BASE_URL } from "@/shared/_config/runtime";
import {
  getAuthHeaders,
  hasActiveRefresh,
  refreshAccessToken,
  waitForActiveRefresh,
} from "@/features/auth/_utils/jwt-session";

type ApiEnvelope<T> = {
  code: number;
  data: T;
  message: string;
};

// removed global mock typings

export class ApiClientError extends Error {
  details: unknown;
  status: number;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiClientError";
    this.details = details;
    this.status = status;
  }
}

const REFRESH_PATH = "/api/auth/refresh";

export type ApiFetchOptions = RequestInit & {
  skipAuthRefresh?: boolean;
  skipAuthToken?: boolean;
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
      response.status,
      payload?.data
    );
  }

  if (!payload) {
    throw new ApiClientError("Respons server tidak valid.", response.status);
  }

  return payload.data;
}

async function apiFetch(
  path: string,
  init: ApiFetchOptions = {}
): Promise<Response> {

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

// removed mock simulation runs

async function fetchWithDefaults(path: string, init: ApiFetchOptions) {
  const headers = buildHeaders(init);

  return fetch(`${FRONTEND_API_BASE_URL}${path}`, {
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

  if (!init.skipAuthToken) {
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

// removed window global assignments
