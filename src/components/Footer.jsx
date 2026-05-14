export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="relative">
      <style>{`
        .flowing-border {
          height: 6px;
          width: 100%;
          background: linear-gradient(90deg, #06b6d4, #7c3aed, #f97316, #06b6d4);
          background-size: 200% 100%;
          animation: flow 6s linear infinite;
        }
        @keyframes flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .footer-card {
          background: linear-gradient(180deg, rgba(255,255,255,0.9), rgba(250,250,250,0.95));
          border: 1px solid rgba(2,6,23,0.06);
          border-radius: 12px;
          padding: 6px 10px;
          box-shadow: 0 6px 18px rgba(2,6,23,0.06);
          transform: translateY(6px);
          opacity: 0;
          animation: cardIn 420ms ease forwards;
          transition: transform 200ms ease, box-shadow 200ms ease;
        }
        .footer-cards .footer-card:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 0 10px 30px rgba(2,6,23,0.09);
        }
        .footer-card:nth-child(1) { animation-delay: 0s; }
        .footer-card:nth-child(2) { animation-delay: 0.06s; }
        .footer-card:nth-child(3) { animation-delay: 0.12s; }

        @keyframes cardIn {
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>

      <div className="flowing-border" aria-hidden="true" />

      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3">

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="footer-cards flex items-center gap-3">
              <div className="footer-card text-xs text-slate-700">Fast matches</div>
              <div className="footer-card text-xs text-slate-700">Secure</div>
              <div className="footer-card text-xs text-slate-700">Campus-wide</div>
            </div>

            <p className="text-sm text-slate-600 truncate">© {currentYear} <span className="font-medium text-slate-900">UniFind</span>. All rights reserved by Nehemiah00</p>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <a href="#terms" className="hover:text-slate-900">Terms</a>
            <a href="#privacy" className="hover:text-slate-900">Privacy</a>
            <a href="#cookies" className="hover:text-slate-900">Cookies</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
