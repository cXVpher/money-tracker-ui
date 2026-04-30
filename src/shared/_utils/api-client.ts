import { API_BASE_URL } from "@/shared/_config/runtime";

type ApiEnvelope<T> = {
  code: number;
  data: T;
  message: string;
};

export class ApiClientError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
  }
}

const MOCK_FALLBACK_STATUSES = new Set([404, 408, 425, 429, 500, 502, 503, 504]);

export function shouldUseMockFallback(error: unknown) {
  if (!(error instanceof ApiClientError)) {
    return true;
  }

  return error.status >= 500 || MOCK_FALLBACK_STATUSES.has(error.status);
}

export async function apiRequest<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(init?.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...init?.headers,
    },
    ...init,
  });

  let payload: ApiEnvelope<T> | null = null;

  try {
    payload = (await response.json()) as ApiEnvelope<T>;
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new ApiClientError(
      payload?.message ?? "Terjadi kesalahan saat menghubungi server.",
      response.status
    );
  }

  if (!payload) {
    throw new ApiClientError("Respons server tidak valid.", response.status);
  }

  return payload.data;
}
