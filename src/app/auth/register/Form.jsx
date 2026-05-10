"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/authClient";

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
    <div className="w-full max-w-md p-8 rounded-xl bg-transparent backdrop-blur-md border border-white/10 dark:border-slate-800/40 shadow-sm">
      <h1 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Create account</h1>
      {error && <p className="text-red-500 mb-2 text-sm">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-sm text-slate-700 dark:text-slate-300">Name</span>
          <input name="name" type="text" required className="mt-1 block w-full rounded-md border px-3 py-2 dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
        </label>
        <label className="block">
          <span className="text-sm text-slate-700 dark:text-slate-300">Email</span>
          <input name="email" type="email" required className="mt-1 block w-full rounded-md border px-3 py-2 dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
        </label>
        <label className="block">
          <span className="text-sm text-slate-700 dark:text-slate-300">Password</span>
          <input name="password" type="password" required className="mt-1 block w-full rounded-md border px-3 py-2 dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
        </label>
        <button type="submit" disabled={loading} className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-medium transition-colors">
          {loading ? 'Creating...' : 'Create account'}
        </button>
      </form>
    </div>
  );
}
