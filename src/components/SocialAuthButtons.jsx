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
    <div className="flex items-center gap-2">
      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="button"
        onClick={() => handleSocial("google")}
        disabled={loading}
        aria-label="Sign in with Google"
        className="flex items-center gap-2 py-2 px-3 rounded-lg bg-transparent border border-white/20 text-white text-sm font-medium hover:bg-white/5 transition"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M21.805 10.023h-9.78v3.954h5.604c-.243 1.486-1.82 4.36-5.604 4.36-3.37 0-6.114-2.782-6.114-6.206 0-3.425 2.744-6.207 6.114-6.207 1.922 0 3.207.82 3.946 1.526l2.687-2.593C17.98 2.87 15.3 1.5 11.99 1.5 6.824 1.5 2.75 5.78 2.75 11s4.074 9.5 9.24 9.5c5.343 0 8.88-3.744 8.88-9.023 0-.61-.07-1.073-.065-1.454z" fill="white" />
        </svg>
        <span>Google</span>
      </button>

      <button
        type="button"
        onClick={() => handleSocial("github")}
        disabled={loading}
        aria-label="Sign in with GitHub"
        className="flex items-center gap-2 py-2 px-3 rounded-lg bg-transparent border border-white/20 text-white text-sm font-medium hover:bg-white/5 transition"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path fillRule="evenodd" clipRule="evenodd" d="M12 .5C5.73.5.75 5.48.75 11.75c0 4.9 3.18 9.07 7.59 10.54.56.1.77-.24.77-.54 0-.27-.01-1-.02-1.96-3.09.67-3.74-1.49-3.74-1.49-.5-1.28-1.22-1.62-1.22-1.62-.99-.67.08-.66.08-.66 1.1.08 1.68 1.13 1.68 1.13.97 1.66 2.55 1.18 3.17.9.1-.7.38-1.18.69-1.45-2.47-.28-5.07-1.24-5.07-5.52 0-1.22.44-2.22 1.16-3-.12-.28-.5-1.42.11-2.96 0 0 .95-.3 3.12 1.15.9-.25 1.87-.37 2.83-.38.96.01 1.93.13 2.83.38 2.17-1.46 3.12-1.15 3.12-1.15.61 1.54.23 2.68.11 2.96.72.78 1.16 1.78 1.16 3 0 4.28-2.61 5.24-5.09 5.52.39.34.74 1.01.74 2.04 0 1.47-.01 2.66-.01 3.02 0 .3.2.65.78.54 4.4-1.47 7.58-5.64 7.58-10.54C23.25 5.48 18.27.5 12 .5z" />
        </svg>
        <span>GitHub</span>
      </button>
    </div>
  );
}
