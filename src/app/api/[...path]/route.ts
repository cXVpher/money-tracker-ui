import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/shared/_config/runtime";
import { cookies } from "next/headers";

// Cookie names expected by the backend / browser
const USER_ACCESS_COOKIE = "user_access_token";
const USER_REFRESH_COOKIE = "user_refresh_token";

export async function handleProxy(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const cookieStore = await cookies();

  // 1. Get the path and build the backend URL
  const resolvedParams = await params;
  const pathString = resolvedParams.path.join("/");
  
  // The backend API is hosted at API_BASE_URL/api/...
  const backendUrl = new URL(
    `${API_BASE_URL}/api/${pathString}${request.nextUrl.search}`
  );

  // 2. Clone headers and prepare request to the backend
  const headers = new Headers(request.headers);
  headers.delete("host"); // Host header must be updated automatically by fetch
  headers.delete("content-length");
  headers.delete("connection");

  // Forward existing cookies to the backend
  const allCookies = cookieStore.getAll();
  if (allCookies.length > 0) {
    headers.set(
      "cookie",
      allCookies.map((c) => `${c.name}=${c.value}`).join("; ")
    );
  }

  // If there's an access token cookie stored in the browser, attach it as a Bearer token
  const token = cookieStore.get(USER_ACCESS_COOKIE)?.value;
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // 3. Determine if this is a login/register/refresh endpoint or logout
  const isAuthEndpoint = [
    "auth/login",
    "admin/auth/login",
    "auth/register",
    "auth/refresh",
    "admin/auth/refresh",
  ].includes(pathString);

  const isLogoutEndpoint = [
    "auth/logout",
    "admin/auth/logout",
  ].includes(pathString);

  // 4. Read body buffer for non-GET/HEAD requests
  const hasBody = request.method !== "GET" && request.method !== "HEAD";
  const bodyBuffer = hasBody ? await request.arrayBuffer() : undefined;

  try {
    // 5. Send request to backend
    const response = await fetch(backendUrl.toString(), {
      method: request.method,
      headers,
      body: bodyBuffer && bodyBuffer.byteLength > 0 ? bodyBuffer : undefined,
    });

    // 6. Handle Auth responses (extract tokens, set cookies, return sanitized payload)
    if (isAuthEndpoint && response.ok) {
      const data = await response.json();

      // Clean the response payload (strip actual tokens so they aren't exposed in Javascript)
      let sanitizedData = data;
      if (data?.data && typeof data.data === "object") {
        const {
          access_token,
          accessToken,
          refresh_token,
          refreshToken,
          ...rest
        } = data.data as Record<string, unknown>;
        void access_token; void accessToken; void refresh_token; void refreshToken;
        sanitizedData = { ...data, data: rest };
      }

      const nextResponse = NextResponse.json(sanitizedData, {
        status: response.status,
      });

      // Forward Set-Cookie headers from backend, rewriting their Path to /
      // so that they are accessible globally by the frontend pages and server-side layout.
      // We use response.headers.getSetCookie() to retrieve them as a clean array of individual strings,
      // avoiding Node/Fetch's behavior of joining multiple cookies with commas.
      const setCookies = response.headers.getSetCookie();
      setCookies.forEach((cookieStr) => {
        const rewritten = cookieStr.replace(/Path=\/([^;\s]*)/gi, "Path=/");
        nextResponse.headers.append("set-cookie", rewritten);
      });

      return nextResponse;
    }

    // 7. Handle Logout (clear all cookie sessions on client side)
    if (isLogoutEndpoint) {
      const nextResponse = new NextResponse(response.body, {
        status: response.status,
      });
      // Expire cookies by setting Max-Age=0 with Path=/
      const cookieOpts = "Path=/; Max-Age=0; HttpOnly; SameSite=Lax";
      nextResponse.headers.append("set-cookie", `${USER_ACCESS_COOKIE}=; ${cookieOpts}`);
      nextResponse.headers.append("set-cookie", `${USER_REFRESH_COOKIE}=; ${cookieOpts}`);
      return nextResponse;
    }

    // 8. General proxy for all other endpoints: forward headers and stream response
    const safeHeaders = new Headers();
    response.headers.forEach((value, key) => {
      const lower = key.toLowerCase();
      if (
        lower === "content-type" ||
        lower === "content-length" ||
        lower === "cache-control" ||
        lower === "etag" ||
        lower === "last-modified"
      ) {
        safeHeaders.set(key, value);
      }
    });

    return new NextResponse(response.body, {
      status: response.status,
      headers: safeHeaders,
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { code: 500, message: "Terjadi kesalahan pada proxy." },
      { status: 500 }
    );
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const PATCH = handleProxy;
export const DELETE = handleProxy;
