"use client";

import { FRONTEND_API_BASE_URL } from "@/shared/_config/runtime";

type ApiEnvelope<T> = {
  code: number;
  data: T;
  message: string;
};



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
    if ((response.status === 401 || response.status === 403) && typeof window !== "undefined") {
      const pathname = window.location.pathname;
      if (pathname !== "/login" && pathname !== "/register") {
        window.location.href = "/login";
      }
    }

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
  return fetchWithDefaults(path, init);
}



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

  return headers;
}

async function safeJson<T>(response: Response): Promise<T | null> {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
}
