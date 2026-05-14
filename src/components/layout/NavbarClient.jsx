"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Bell, Menu, X } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import SignOutButton from "@/components/SignOutButton";

export default function NavbarClient({ session }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname() || "/";

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Lost Items", href: "/lost" },
    { label: "Found Items", href: "/found" },
    ...(session?.user ? [{ label: "Dashboard", href: "/dashboard" }] : []),
  ];

  return (
    <header className="w-full bg-white rounded-b-lg navbar-gradient-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-20 flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-3 min-w-fit group" aria-label="UniFind home">
            <motion.div whileHover={{ scale: 1.03 }} className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center text-white font-syne font-black text-lg">
              U
            </motion.div>
            {/* Desktop brand (visible on sm+) */}
            <div className="hidden sm:flex flex-col leading-tight">
              <div className="font-syne font-bold text-black transition-colors text-base">UniFind</div>
              <div className="text-xs text-black font-semibold -mt-0.5">Lost & Found</div>
            </div>
            {/* Mobile compact brand (visible on xs screens) */}
            <div className="flex sm:hidden flex-col leading-tight">
              <div className="font-syne font-bold text-black text-sm">UniFind</div>
            </div>
          </Link>

            <div className="hidden md:flex items-center gap-8 flex-1 justify-center">
              <div className="relative bg-white rounded-full px-1 py-1 shadow-sm border border-gray-100 flex items-center gap-3">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                  return (
                  <Link key={item.href} href={item.href} className="relative z-10 px-1">
                    {isActive && (
                      <motion.span layoutId="nav-active" className="absolute inset-0 m-1 bg-emerald-300 rounded-full shadow-md" />
                    )}
                    <span className={`relative inline-block px-4 py-2 rounded-full font-dm-sans font-bold text-sm transition-colors ${isActive ? 'text-black' : 'text-black/80 hover:text-black'}`}>
                      {item.label}
                    </span>
                  </Link>
                );
              })}
              </div>
            </div>

          <div className="flex items-center gap-4 min-w-fit">
            {session?.user && (
              <button className="relative p-2 hover:bg-glass-hover rounded-lg transition-colors text-black" aria-label="Notifications">
                <Bell size={20} className="text-black" />
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-accent-danger rounded-full border-2 border-bg-surface" />
              </button>
            )}

            {!session?.user ? (
              <div className="hidden sm:flex gap-3">
                <Link href="/auth/login" className="px-3 py-2 rounded-full text-sm bg-transparent text-black font-bold hover:bg-gray-100">Sign In</Link>
                <Link href="/auth/register" className="px-4 py-2 rounded-full text-sm bg-transparent border border-gray-200 text-black font-bold hover:bg-gray-100">Register</Link>
              </div>
            ) : (
              <div className="hidden sm:flex items-center pl-4 border-l border-glass-border">
                <span className="text-black font-bold mr-3">{session.user?.name || session.user?.email}</span>
                <SignOutButton />
              </div>
            )}

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Open menu">
              {mobileMenuOpen ? <X size={20} className="text-black" /> : <Menu size={20} className="text-black" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="md:hidden border-t border-glass-border bg-glass-bg/80 py-4">
            <div className="max-w-3xl mx-auto px-4 space-y-3">
              <div className="grid grid-cols-1 gap-2">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-lg hover:bg-gray-100 text-black font-bold">{item.label}</Link>
                ))}
              </div>
              <div className="pt-2">
                {!session?.user ? (
                  <div className="flex gap-2">
                    <Link href="/auth/login" className="flex-1 text-center px-3 py-2 rounded-full hover:bg-gray-100 text-black font-bold">Sign In</Link>
                    <Link href="/auth/register" className="flex-1 text-center px-3 py-2 rounded-full bg-transparent border border-gray-200 text-black font-bold">Register</Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-black font-bold">{session.user?.name || session.user?.email}</div>
                    <SignOutButton />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </nav>
    </header>
  );
}
