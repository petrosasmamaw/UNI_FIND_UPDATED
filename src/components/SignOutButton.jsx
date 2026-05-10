"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/lib/authClient";

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="text-xs sm:text-sm md:text-base text-red-600 font-medium hover:text-red-700 transition-colors whitespace-nowrap"
    >
      Sign Out
    </button>
  );
}