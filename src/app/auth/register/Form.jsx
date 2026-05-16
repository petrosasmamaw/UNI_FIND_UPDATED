"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/authClient";
import SocialAuthButtons from "@/components/SocialAuthButtons";

export default function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const body = Object.fromEntries(form.entries());
    try {
      const { error: signUpError } = await authClient.signUp.email({
        name: body.name,
        email: body.email,
        password: body.password,
        callbackURL: "/",
      });

      if (signUpError) {
        const status = Number(signUpError.status || 0);
        if (status >= 500) {
          setError("Server error during registration. Please try again in a minute.");
        } else {
          setError(signUpError.message || "Registration failed");
        }
        setLoading(false);
        return;
      }
      router.push("/");
    } catch (err) {
      setError(err?.message || "Network error");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 rounded-2xl bg-white/8 backdrop-blur-lg border border-white/20 shadow-lg relative z-10">
      <h1 className="text-2xl font-extrabold mb-2 text-white">Create account</h1>
      <p className="text-sm text-white/85 mb-4">Join UniFind and help reunite items with their owners</p>
      {error && <p className="text-red-500 mb-2 text-sm">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-sm text-white/85">Name</span>
          <input name="name" type="text" required className="mt-1 block w-full rounded-md border px-3 py-2 bg-white/6 placeholder-white/60 text-white" />
        </label>
        <label className="block">
          <span className="text-sm text-white/85">Email</span>
          <input name="email" type="email" required className="mt-1 block w-full rounded-md border px-3 py-2 bg-white/6 placeholder-white/60 text-white" />
        </label>
        <label className="block">
          <span className="text-sm text-white/85">Password</span>
          <input name="password" type="password" required className="mt-1 block w-full rounded-md border px-3 py-2 bg-white/6 placeholder-white/60 text-white" />
        </label>
        <button type="submit" disabled={loading} className="w-full py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 disabled:opacity-60 text-white font-semibold transition-all">
          {loading ? 'Creating...' : 'Create account'}
        </button>

        <div className="mt-3 flex gap-3 justify-center">
          <SocialAuthButtons callbackURL="/" />
        </div>
      </form>
    </div>
  );
}
