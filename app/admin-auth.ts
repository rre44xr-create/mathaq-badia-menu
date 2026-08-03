import { redirect } from "next/navigation";
import { headers } from "next/headers";
import type { ChatGPTUser } from "./chatgpt-auth";

export async function getRestaurantAdmin(): Promise<ChatGPTUser | null> {
  const requestHeaders = await headers();
  if (requestHeaders.get("x-mathaq-admin") !== "1") return null;
  const name = requestHeaders.get("x-mathaq-admin-name") || "إدارة المطعم";
  return { displayName: name, email: "", fullName: name };
}

export async function requireRestaurantAdmin(
  returnTo = "/admin",
): Promise<ChatGPTUser> {
  const user = await getRestaurantAdmin();
  if (!user) redirect(`/admin/unauthorized?return_to=${encodeURIComponent(returnTo)}`);
  return user;
}
