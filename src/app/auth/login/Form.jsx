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
    <div className="w-full max-w-md p-8 rounded-2xl bg-white/8 backdrop-blur-lg border border-white/20 shadow-lg relative z-10">
      <h1 className="text-2xl font-extrabold mb-2 text-white">Sign in</h1>
      <p className="text-sm text-white/85 mb-4">Access your account to post and find items on campus</p>
      {error && <p className="text-red-500 mb-2 text-sm">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-sm text-slate-700 dark:text-slate-300">Email</span>
          <input name="email" type="email" required className="mt-1 block w-full rounded-md border px-3 py-2 bg-white/6 placeholder-white/60 text-white" />
        </label>
        <label className="block">
          <span className="text-sm text-slate-700 dark:text-slate-300">Password</span>
          <input name="password" type="password" required className="mt-1 block w-full rounded-md border px-3 py-2 bg-white/6 placeholder-white/60 text-white" />
        </label>
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded" />
            <span className="text-white/85">Remember me</span>
          </label>
        </div>
        <button type="submit" disabled={loading} className="w-full py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 disabled:opacity-60 text-white font-semibold transition-all">
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
