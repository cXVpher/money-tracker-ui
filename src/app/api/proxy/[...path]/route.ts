import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/shared/_config/runtime";
import { cookies } from "next/headers";

// Cookie names that the backend sets / expects
const USER_ACCESS_COOKIE = "user_access_token";
const USER_REFRESH_COOKIE = "user_refresh_token";

async function handleProxy(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const cookieStore = await cookies();

  // Read the access token from the backend-named cookie
  const token = cookieStore.get(USER_ACCESS_COOKIE)?.value;

  const resolvedParams = await params;
  const pathString = resolvedParams.path.join("/");
  const backendUrl = new URL(
    `${API_BASE_URL}/${pathString}${request.nextUrl.search}`
  );

  // Build forwarded headers
  const headers = new Headers(request.headers);
  headers.delete("host");

  // Forward the backend cookies so refresh/logout endpoints receive them
  const allCookies = cookieStore.getAll();
  if (allCookies.length > 0) {
    headers.set(
      "cookie",
      allCookies.map((c) => `${c.name}=${c.value}`).join("; ")
    );
  }

  // Attach bearer token for authenticated endpoints
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const isAuthEndpoint =
    pathString === "api/auth/login" ||
    pathString === "api/admin/auth/login" ||
    pathString === "api/auth/register" ||
    pathString === "api/auth/refresh" ||
    pathString === "api/admin/auth/refresh";

  const isLogoutEndpoint =
    pathString === "api/auth/logout" ||
    pathString === "api/admin/auth/logout";

  try {
    const response = await fetch(backendUrl.toString(), {
      method: request.method,
      headers,
      body:
        request.method !== "GET" && request.method !== "HEAD"
          ? request.body
          : undefined,
      // @ts-ignore
      duplex: "half",
    });

    // For auth endpoints, strip tokens from the JSON response body
    // and forward the backend's Set-Cookie headers directly so that
    // the browser stores the correct cookie names the backend expects.
    if (isAuthEndpoint && response.ok) {
      const data = await response.json();

      // Strip tokens from the payload before forwarding to the browser
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

      // Forward the backend Set-Cookie headers unchanged so the browser
      // stores user_access_token / user_refresh_token with the correct
      // Path and attributes the backend intended.
      const nextResponse = NextResponse.json(sanitizedData, {
        status: response.status,
      });

      response.headers.forEach((value, key) => {
        if (key.toLowerCase() === "set-cookie") {
          nextResponse.headers.append("set-cookie", value);
        }
      });

      return nextResponse;
    }

    // For logout, clear the cookies on the Next.js side as well
    if (isLogoutEndpoint) {
      const nextResponse = new NextResponse(response.body, {
        status: response.status,
        headers: response.headers,
      });
      // Expire both cookie names
      const cookieOpts = "Path=/; Max-Age=0; HttpOnly; SameSite=Lax";
      nextResponse.headers.append("set-cookie", `${USER_ACCESS_COOKIE}=; ${cookieOpts}`);
      nextResponse.headers.append("set-cookie", `${USER_REFRESH_COOKIE}=; Path=/api/auth/refresh; Max-Age=0; HttpOnly; SameSite=Lax`);
      return nextResponse;
    }

    return new NextResponse(response.body, {
      status: response.status,
      headers: response.headers,
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
