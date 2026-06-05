import { cookies } from "next/headers";

/**
 * Extracts the active dashboard role from auth cookies on the server-side.
 * Admin cookies are checked first so admin and user sessions can coexist.
 * Returns "user" if no token is found, if the token is invalid, or if the role is missing.
 */
export async function getUserRoleFromCookie(): Promise<string> {
  const cookieStore = await cookies();
  const token =
    cookieStore.get("admin_access_token")?.value ??
    cookieStore.get("user_access_token")?.value;
  
  if (!token) {
    return "user";
  }

  try {
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) return "user";
    
    const payloadJson = Buffer.from(toBase64(payloadBase64), "base64").toString();
    const payload = JSON.parse(payloadJson);
    
    return payload.role || "user";
  } catch (error) {
    console.error("Failed to decode JWT role from cookie:", error);
    return "user";
  }
}

export function isAdminRole(role: string) {
  return role === "admin" || role === "superadmin" || role === "super_admin";
}

function toBase64(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const paddingLength = (4 - (base64.length % 4)) % 4;

  return `${base64}${"=".repeat(paddingLength)}`;
}
