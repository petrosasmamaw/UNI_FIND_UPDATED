"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function signOutAction() {
  const requestHeaders = new Headers(await headers());
  requestHeaders.delete("host");

  await fetch(`${API_URL.replace(/\/$/, "")}/api/auth/sign-out`, {
    method: "POST",
    headers: requestHeaders,
    cache: "no-store",
  });

  redirect("/");
}
