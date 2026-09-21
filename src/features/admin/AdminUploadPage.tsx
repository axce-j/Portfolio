import { useState, type FormEvent } from "react";
import VisualEditor from "./VisualEditor";

type ProjectOption = { slug: string; title: string };

// ─────────────────────────────────────────────
// Password gate
// ─────────────────────────────────────────────

function PasswordGate({ onUnlocked }: { onUnlocked: (password: string, projects: ProjectOption[]) => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/list-projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Incorrect password");
      }
      const { projects } = await res.json();
      onUnlocked(password, projects);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xs flex flex-col gap-4 p-8 rounded-2xl
          bg-white/[0.03] border border-white/10"
      >
        <p className="text-xs font-semibold tracking-widest uppercase text-white/30">
          Admin
        </p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
          className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white
            text-sm placeholder:text-white/30 outline-none focus:border-teal-500/40"
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading || !password}
          className="px-4 py-2.5 rounded-xl bg-teal-500/20 border border-teal-500/30
            text-teal-300 text-sm font-medium hover:bg-teal-500/30 transition-all
            disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "Checking…" : "Unlock"}
        </button>
      </form>
    </div>
  );
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────
//
// Used to be a 4-tab switcher (Upload Media / Edit Text / Edit
// Features / Visual Editor). The other three are gone — everything
// they did (uploading hero/highlight/gallery/video media, editing
// every text field including role/client/duration/year, adding/
// editing/deleting features) is now reachable directly on the Visual
// Editor itself, in the actual visual context of the page, so there
// was nothing left only reachable from the old tabs. See
// VisualEditor.tsx for the staged-edit + single "Save Project" model.

export default function AdminUploadPage() {
  const [session, setSession] = useState<{ password: string; projects: ProjectOption[] } | null>(null);

  if (!session) {
    return <PasswordGate onUnlocked={(password, projects) => setSession({ password, projects })} />;
  }

  return <VisualEditor password={session.password} projects={session.projects} />;
}