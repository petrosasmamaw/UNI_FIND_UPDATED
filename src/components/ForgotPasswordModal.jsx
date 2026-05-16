"use client";

import React, { useState } from "react";
import { authClient } from "@/lib/authClient";
import { X, CheckCircle } from "lucide-react";

export default function ForgotPasswordModal({ isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { data, error: resetError } = await authClient.requestPasswordReset({
        email: email,
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (resetError) {
        setError(resetError.message || "Failed to send reset email. Please check your email and try again.");
      } else {
        setSuccess(true);
        setEmail("");
        setTimeout(() => {
          onClose();
          setSuccess(false);
        }, 3000);
      }
    } catch (err) {
      setError(err?.message || "Failed to send password reset email. Please try again.");
      console.error("Password reset request error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-black/70 backdrop-blur-xl rounded-xl shadow-2xl max-w-md w-full mx-4 p-8 border border-white/10 text-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Reset Password</h2>
          <button onClick={onClose} className="text-white/80 hover:text-white text-2xl leading-none">
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div className="text-center">
            <div className="mb-4 text-4xl">
              <CheckCircle size={32} color="#16a34a" />
            </div>
            <p className="text-white font-medium mb-2">Email sent successfully!</p>
            <p className="text-sm text-white/80">Check your email for the password reset link. The link will expire in 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-900/50 border border-red-800 rounded-lg">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            <p className="text-sm text-white/80 mb-4">Enter your email address and we'll send you a link to reset your password.</p>

            <label className="block">
              <span className="text-sm font-medium text-white/90">Email Address</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="mt-2 block w-full rounded-md border border-white/20 px-3 py-2 bg-white/6 placeholder-white/60 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
              />
            </label>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg bg-transparent border border-white/20 hover:bg-white/5 text-white font-medium transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={loading || !email} className="flex-1 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 disabled:opacity-60 text-white font-medium transition-colors">
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

