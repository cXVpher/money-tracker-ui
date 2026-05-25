import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/shared/_config/runtime";
import { cookies } from "next/headers";

async function handleProxy(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  const resolvedParams = await params;
  const pathString = resolvedParams.path.join("/");
  const backendUrl = new URL(`${API_BASE_URL}/${pathString}${request.nextUrl.search}`);

  const headers = new Headers(request.headers);
  headers.delete("host");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const isAuthLoginOrRefresh = 
    pathString === "api/auth/login" || 
    pathString === "api/admin/auth/login" || 
    pathString === "api/auth/register" || 
    pathString === "api/auth/refresh";
  
  const isAuthLogout = pathString === "api/auth/logout";

  try {
    const response = await fetch(backendUrl.toString(), {
      method: request.method,
      headers,
      body: request.method !== "GET" && request.method !== "HEAD" ? request.body : undefined,
      // @ts-ignore
      duplex: "half",
    });

    if (isAuthLoginOrRefresh && response.ok) {
      const data = await response.json();
      
      if (data.code === 200 && data.data) {
        const { access_token, accessToken, refresh_token, refreshToken, ...restData } = data.data;
        const actualAccessToken = access_token || accessToken;
        const actualRefreshToken = refresh_token || refreshToken;
        
        if (actualAccessToken) {
          cookieStore.set("access_token", actualAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
          });
        }
        
        if (actualRefreshToken) {
          cookieStore.set("refresh_token", actualRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
          });
        }
        
        return NextResponse.json({ ...data, data: restData }, { status: response.status });
      }
      
      return NextResponse.json(data, { status: response.status });
    }

    if (isAuthLogout) {
      cookieStore.delete("access_token");
      cookieStore.delete("refresh_token");
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
