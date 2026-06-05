import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/server/api/runtime";

const USER_ACCESS_COOKIE = "user_access_token";
const USER_REFRESH_COOKIE = "user_refresh_token";
const ADMIN_ACCESS_COOKIE = "admin_access_token";
const ADMIN_REFRESH_COOKIE = "admin_refresh_token";

const AUTH_ENDPOINTS = new Set([
  "auth/login",
  "admin/auth/login",
  "auth/register",
  "auth/refresh",
  "admin/auth/refresh",
]);

const LOGOUT_ENDPOINTS = new Set([
  "auth/logout",
  "admin/auth/logout",
]);

const SAFE_RESPONSE_HEADERS = new Set([
  "content-type",
  "content-length",
  "cache-control",
  "etag",
  "last-modified",
]);

export async function handleApiProxy(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const pathString = (await params).path.join("/");
  const body = await readRequestBody(request);

  try {
    const response = await fetch(buildBackendUrl(request, pathString), {
      body,
      headers: await buildBackendHeaders(request),
      method: request.method,
    });

    if (AUTH_ENDPOINTS.has(pathString) && response.ok) {
      return authResponse(response);
    }

    if (LOGOUT_ENDPOINTS.has(pathString)) {
      return logoutResponse(response);
    }

    return generalResponse(response);
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { code: 500, message: "Terjadi kesalahan pada proxy." },
      { status: 500 }
    );
  }
}

function buildBackendUrl(request: NextRequest, pathString: string) {
  return `${API_BASE_URL}/api/${pathString}${request.nextUrl.search}`;
}

async function buildBackendHeaders(request: NextRequest) {
  const cookieStore = await cookies();
  const headers = new Headers(request.headers);

  headers.delete("host");
  headers.delete("content-length");
  headers.delete("connection");

  const allCookies = cookieStore.getAll();
  if (allCookies.length > 0) {
    headers.set(
      "cookie",
      allCookies.map((cookie) => `${cookie.name}=${cookie.value}`).join("; ")
    );
  }

  const accessToken = cookieStore.get(USER_ACCESS_COOKIE)?.value;
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return headers;
}

async function readRequestBody(request: NextRequest) {
  if (request.method === "GET" || request.method === "HEAD") {
    return undefined;
  }

  const body = await request.arrayBuffer();
  return body.byteLength > 0 ? body : undefined;
}

async function authResponse(response: Response) {
  const data = await response.json();
  const nextResponse = NextResponse.json(sanitizeAuthPayload(data), {
    status: response.status,
  });

  appendRewrittenSetCookies(nextResponse, response);

  return nextResponse;
}

function logoutResponse(response: Response) {
  const nextResponse = new NextResponse(response.body, {
    status: response.status,
  });

  appendExpiredAuthCookie(nextResponse, USER_ACCESS_COOKIE);
  appendExpiredAuthCookie(nextResponse, USER_REFRESH_COOKIE);
  appendExpiredAuthCookie(nextResponse, ADMIN_ACCESS_COOKIE);
  appendExpiredAuthCookie(nextResponse, ADMIN_REFRESH_COOKIE);

  return nextResponse;
}

function generalResponse(response: Response) {
  return new NextResponse(response.body, {
    headers: safeResponseHeaders(response),
    status: response.status,
  });
}

function sanitizeAuthPayload(data: unknown) {
  if (!data || typeof data !== "object" || !("data" in data)) {
    return data;
  }

  const envelope = data as { data?: unknown };

  if (!envelope.data || typeof envelope.data !== "object") {
    return data;
  }

  const {
    access_token,
    accessToken,
    refresh_token,
    refreshToken,
    ...rest
  } = envelope.data as Record<string, unknown>;

  void access_token;
  void accessToken;
  void refresh_token;
  void refreshToken;

  return { ...data, data: rest };
}

function appendRewrittenSetCookies(
  nextResponse: NextResponse,
  backendResponse: Response
) {
  backendResponse.headers.getSetCookie().forEach((cookie) => {
    nextResponse.headers.append(
      "set-cookie",
      cookie.replace(/Path=\/([^;\s]*)/gi, "Path=/")
    );
  });
}

function appendExpiredAuthCookie(response: NextResponse, name: string) {
  response.headers.append(
    "set-cookie",
    `${name}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`
  );
}

function safeResponseHeaders(response: Response) {
  const headers = new Headers();

  response.headers.forEach((value, key) => {
    if (SAFE_RESPONSE_HEADERS.has(key.toLowerCase())) {
      headers.set(key, value);
    }
  });

  return headers;
}
