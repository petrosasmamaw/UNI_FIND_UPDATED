import Link from "next/link";
import { headers } from "next/headers";
import { getServerSession } from "@/lib/session";
import NavbarClient from "./layout/NavbarClient";

export default async function Navbar() {
  let session = null;
  try {
    session = await getServerSession(await headers());
  } catch (error) {
    console.error("Failed to resolve auth session in Navbar:", error);
  }

  return <NavbarClient session={session} />;
}