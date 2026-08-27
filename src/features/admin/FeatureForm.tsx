// src/features/admin/FeatureForm.tsx
//
// Extracted out of AdminUploadPage.tsx so both AdminUploadPage.tsx
// (the "Edit Features" tab) and VisualEditor.tsx (clicking a feature
// card) can import this from a common source. Originally this lived
// inside AdminUploadPage.tsx and VisualEditor imported it from there
// — but AdminUploadPage.tsx also imports VisualEditor (to render it
// as the "Visual Editor" tab), which made that a circular import.
// Function components in a cycle like that usually still work with
// Vite's bundler (nothing gets called until render, by which point
// both modules are initialized), but "usually works" isn't a bar
// worth relying on — breaking the cycle here removes the ambiguity
// entirely.

import { useState, type FormEvent } from "react";

export type FeatureRow = {
  id: string;
  title: string;
  subtitle: string | null;
  description: string;
  image: string | null;
  imageAlt: string | null;
  sortOrder: number;
  source: "manual" | "readme";
};

export function FeatureForm({
  password,
  projectSlug,
  feature,
  onDone,
  onCancel,
}: {
  password: string;
  projectSlug: string;
  feature: FeatureRow | null;
  onDone: () => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(feature?.title ?? "");
  const [subtitle, setSubtitle] = useState(feature?.subtitle ?? "");
  const [description, setDescription] = useState(feature?.description ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "deleting" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function uploadFileIfAny(): Promise<string | undefined> {
    if (!file) return undefined;
    const sigRes = await fetch("/api/cloudinary-signature", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!sigRes.ok) throw new Error("Could not get upload signature");
    const { cloudName, apiKey, timestamp, signature, folder } = await sigRes.json();

    const form = new FormData();
    form.append("file", file);
    form.append("api_key", apiKey);
    form.append("timestamp", String(timestamp));
    form.append("signature", signature);
    form.append("folder", folder);

    const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
      method: "POST",
      body: form,
    });
    if (!uploadRes.ok) throw new Error("Cloudinary upload failed");
    const uploaded = await uploadRes.json();
    return uploaded.secure_url as string;
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    setStatus("saving");
    try {
      const imageUrl = await uploadFileIfAny();
      const res = await fetch("/api/save-feature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          projectSlug,
          featureId: feature?.id,
          title,
          subtitle: subtitle || null,
          description,
          image: imageUrl,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Could not save feature");
      }
      onDone();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Save failed");
    }
  }

  async function handleDelete() {
    if (!feature) return;
    setStatus("deleting");
    setError(null);
    try {
      const res = await fetch("/api/delete-feature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, projectSlug, featureId: feature.id }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Could not delete feature");
      }
      onDone();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-16">
      <form
        onSubmit={handleSave}
        className="w-full max-w-md flex flex-col gap-5 p-8 rounded-2xl bg-white/[0.03] border border-white/10"
      >
        <p className="text-xs font-semibold tracking-widest uppercase text-white/30">
          {feature ? "Edit Feature" : "New Feature"}
        </p>

        {feature?.source === "readme" && (
          <p className="text-[11px] text-amber-400/80 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
            This feature came from your README. Editing it here makes it permanent — future README
            syncs won't touch it again. Deleting it, however, is NOT permanent: it'll reappear next
            sync unless you also remove it from the README itself.
          </p>
        )}

        <label className="flex flex-col gap-1.5 text-xs text-white/40">
          Title
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-xs text-white/40">
          Subtitle (optional)
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-xs text-white/40">
          Description
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm outline-none resize-y"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-xs text-white/40">
          Image {feature?.image ? "(replace)" : "(optional)"}
          {feature?.image && !file && (
            <div className="w-full aspect-video rounded-lg overflow-hidden border border-white/10 bg-white/5 mb-1">
              <img src={feature.image} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="text-sm text-white/60 file:mr-3 file:px-3 file:py-1.5 file:rounded-lg
              file:border-0 file:bg-white/10 file:text-white/70 file:text-xs"
          />
        </label>

        {error && <p className="text-xs text-red-400">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={status === "saving" || status === "deleting"}
            className="flex-1 px-4 py-2.5 rounded-xl bg-teal-500/20 border border-teal-500/30
              text-teal-300 text-sm font-medium hover:bg-teal-500/30 transition-all
              disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {status === "saving" ? "Saving…" : "Save"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10
              text-white/50 text-sm font-medium hover:bg-white/10 transition-all"
          >
            Cancel
          </button>
        </div>

        {feature && (
          <div className="pt-3 border-t border-white/10">
            {!confirmDelete ? (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="text-xs text-red-400/70 hover:text-red-400 transition-all"
              >
                Delete this feature
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <p className="text-xs text-red-400">Delete permanently?</p>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={status === "deleting"}
                  className="text-xs px-3 py-1 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300"
                >
                  {status === "deleting" ? "Deleting…" : "Yes, delete"}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="text-xs text-white/40"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
}