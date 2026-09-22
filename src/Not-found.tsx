import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";

// Shared catch-all for two cases:
//  1. Any genuinely unmatched route (wired as the last <Route path="*">
//     in App.tsx).
//  2. An invalid/expired admin link (AdminRouteGate renders this
//     instead of blank/null) — so a stale or guessed admin URL looks
//     identical to any other bad URL. A blank page at that specific
//     pattern would otherwise be a small tell that the route exists
//     at all, even without the password.
export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-black px-4 text-center">
      <p className="text-7xl font-bold text-white/15 tracking-tight">404</p>
      <div className="flex flex-col gap-1">
        <p className="text-lg text-white/60">This page doesn't exist</p>
        <p className="text-sm text-white/30">Check the URL, or head back home.</p>
      </div>
      <button
        type="button"
        onClick={() => navigate("/")}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500/15 border border-teal-500/30
          text-teal-300 text-sm font-medium hover:bg-teal-500/25 transition-all"
      >
        <Home className="w-4 h-4" />
        Take me home
      </button>
    </div>
  );
}