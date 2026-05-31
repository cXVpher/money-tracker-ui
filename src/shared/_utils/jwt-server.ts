import { cookies } from "next/headers";

/**
 * Extracts the user role from the user_access_token cookie on the server-side.
 * Returns "user" if no token is found, if the token is invalid, or if the role is missing.
 */
export async function getUserRoleFromCookie(): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get("user_access_token")?.value;
  
  if (!token) {
    return "user";
  }

  try {
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) return "user";
    
    const payloadJson = Buffer.from(payloadBase64, "base64").toString();
    const payload = JSON.parse(payloadJson);
    
    return payload.role || "user";
  } catch (error) {
    console.error("Failed to decode JWT role from cookie:", error);
    return "user";
  }
}
