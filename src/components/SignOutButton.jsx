"use client";

import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      // Call backend directly to avoid Next proxy mismatches during dev.
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const target = `${API_URL.replace(/\/$/, '')}/api/auth/sign-out`;

      const res = await fetch(target, {
        method: 'POST',
        credentials: 'include',
        headers: { Accept: 'application/json' },
      });

      if (!res.ok) {
        console.error('Sign-out failed', res.status, res.statusText);
        throw new Error('Sign-out failed');
      }

      // navigate home and refresh session-aware UI
      router.push('/');
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