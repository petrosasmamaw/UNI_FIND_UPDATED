import Link from "next/link";

export default function Home() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-stone-50 text-emerald-900">
      {/* Simple centered hero */}
      <header className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold">UniFind</h1>
        <p className="mt-3 text-lg text-emerald-800/90">Campus lost & found made simple</p>
        <p className="mt-6 text-sm text-emerald-700 max-w-xl mx-auto">
          Report lost items, browse found posts, and reconnect quickly. Clean, focused experience with a calming dark-green and cream palette.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <Link href="/lost" className="px-5 py-2 rounded-full bg-emerald-800 text-stone-50 font-semibold hover:brightness-105 transition">Report Lost</Link>
          <Link href="/found" className="px-5 py-2 rounded-full bg-stone-100 text-emerald-800 border border-emerald-200 font-semibold hover:shadow-sm transition">Browse Found</Link>
        </div>
      </header>

      {/* Simple card grid */}
      <main className="max-w-6xl mx-auto px-6 pb-20">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <article className="rounded-xl bg-stone-100 p-6 shadow-sm border border-emerald-100">
            <div className="text-2xl">🔎</div>
            <h3 className="mt-3 font-bold text-emerald-900">Search & Browse</h3>
            <p className="mt-2 text-sm text-emerald-800/80">Quickly find recent found items posted by the community.</p>
          </article>

          <article className="rounded-xl bg-stone-100 p-6 shadow-sm border border-emerald-100">
            <div className="text-2xl">📸</div>
            <h3 className="mt-3 font-bold text-emerald-900">Post with Photos</h3>
            <p className="mt-2 text-sm text-emerald-800/80">Upload clear photos to improve match accuracy.</p>
          </article>

          <article className="rounded-xl bg-stone-100 p-6 shadow-sm border border-emerald-100">
            <div className="text-2xl">💬</div>
            <h3 className="mt-3 font-bold text-emerald-900">Connect Securely</h3>
            <p className="mt-2 text-sm text-emerald-800/80">Message owners securely to arrange safe returns.</p>
          </article>

          <article className="rounded-xl bg-stone-100 p-6 shadow-sm border border-emerald-100">
            <div className="text-2xl">⚡</div>
            <h3 className="mt-3 font-bold text-emerald-900">Fast Matches</h3>
            <p className="mt-2 text-sm text-emerald-800/80">Smart tagging surfaces likely matches instantly.</p>
          </article>

          <article className="rounded-xl bg-stone-100 p-6 shadow-sm border border-emerald-100">
            <div className="text-2xl">🔒</div>
            <h3 className="mt-3 font-bold text-emerald-900">Privacy First</h3>
            <p className="mt-2 text-sm text-emerald-800/80">Share just what's needed to reunite items safely.</p>
          </article>

          <article className="rounded-xl bg-stone-100 p-6 shadow-sm border border-emerald-100">
            <div className="text-2xl">🤝</div>
            <h3 className="mt-3 font-bold text-emerald-900">Community Driven</h3>
            <p className="mt-2 text-sm text-emerald-800/80">Students helping students — simple and effective.</p>
          </article>
        </section>
      </main>

      {/* Small footer hint area (keeps existing footer component separate) */}
      <div className="text-center text-xs text-emerald-700 pb-8">© {currentYear} UniFind — small, focused, delightful.</div>
    </div>
  );
}
