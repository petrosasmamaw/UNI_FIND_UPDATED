"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/authClient";

export default function LoginForm() {
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
      const { error: signInError } = await authClient.signIn.email({
        email: body.email,
        password: body.password,
        callbackURL: "/",
      });

      if (signInError) {
        const status = Number(signInError.status || 0);
        if (status >= 500) {
          setError("Server error during sign-in. Please try again in a minute.");
        } else {
          setError(signInError.message || "Incorrect email or password");
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
      <h1 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Sign in with email</h1>
      {error && <p className="text-red-500 mb-2 text-sm">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-sm text-slate-700 dark:text-slate-300">Email</span>
          <input name="email" type="email" required className="mt-1 block w-full rounded-md border px-3 py-2 dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
        </label>
        <label className="block">
          <span className="text-sm text-slate-700 dark:text-slate-300">Password</span>
          <input name="password" type="password" required className="mt-1 block w-full rounded-md border px-3 py-2 dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
        </label>
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded" />
            <span className="text-slate-700 dark:text-slate-300">Remember me</span>
          </label>
        </div>
        <button type="submit" disabled={loading} className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-medium transition-colors">
          {loading ? 'Signing in...' : 'Get Started'}
        </button>
      </form>
    </div>
  );
}
