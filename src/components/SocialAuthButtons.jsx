"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/authClient";

export default function SocialAuthButtons({ callbackURL = "/" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSocial = async (provider) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authClient.signIn.social({ provider, callbackURL });
      if (res && res?.session) {
        router.push(callbackURL);
      }
    } catch (err) {
      setError(err?.message || `Failed to sign in with ${provider}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => handleSocial("google")}
          disabled={loading}
          className="flex-1 py-2 rounded-lg bg-white text-black font-medium border"
        >
          Sign in with Google
        </button>
        <button
          type="button"
          onClick={() => handleSocial("github")}
          disabled={loading}
          className="flex-1 py-2 rounded-lg bg-slate-800 text-white font-medium border"
        >
          Sign in with GitHub
        </button>
      </div>
    </div>
  );
}
