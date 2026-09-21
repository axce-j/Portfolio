// src/features/admin/FeatureForm.tsx
//
// Used only by VisualEditor now (the standalone "Edit Features" tab
// is gone — see AdminUploadPage.tsx). Previously this hit
// /api/save-feature and /api/delete-feature directly on submit; now
// it just collects the form values and hands them to the caller via
// onSave/onDelete, synchronously, with no network call. VisualEditor
// stages the result into its draft and flushes everything together
// when the project-level Save button is clicked.

import { useState, type FormEvent } from "react";
import BlurredImageFrame from "@/components/blurredImageFrame";

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

export type FeatureFormValues = {
  title: string;
  subtitle: string | null;
  description: string;
  /** A newly-picked file to use as the image, or null if unchanged. */
  file: File | null;
};

export function FeatureForm({
  feature,
  onSave,
  onDelete,
  onCancel,
}: {
  feature: FeatureRow | null;
  onSave: (values: FeatureFormValues) => void;
  /** Omitted for a brand-new (not-yet-saved) feature — nothing to delete yet. */
  onDelete?: () => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(feature?.title ?? "");
  const [subtitle, setSubtitle] = useState(feature?.subtitle ?? "");
  const [description, setDescription] = useState(feature?.description ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  function handleSave(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    onSave({ title, subtitle: subtitle || null, description, file });
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
        <p className="text-[11px] text-white/30 -mt-2">
          Changes here are staged, not saved yet — click "Save Project" on the main editor once you're happy.
        </p>

        {feature?.source === "readme" && (
          <p className="text-[11px] text-amber-400/80 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
            This feature came from your README. Editing it here makes it permanent — future README
            syncs won't touch it again. Deleting it is permanent — it will not reappear on the next
            README sync, even if it's still in your README.
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
              <BlurredImageFrame src={feature.image} alt="" />
            </div>
          )}
          {file && (
            <p className="text-[11px] text-teal-400/80">
              "{file.name}" staged — will upload when you save the project.
            </p>
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
            className="flex-1 px-4 py-2.5 rounded-xl bg-teal-500/20 border border-teal-500/30
              text-teal-300 text-sm font-medium hover:bg-teal-500/30 transition-all"
          >
            Use these changes
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

        {feature && onDelete && (
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
                <p className="text-xs text-red-400">Delete when project is saved?</p>
                <button
                  type="button"
                  onClick={onDelete}
                  className="text-xs px-3 py-1 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300"
                >
                  Yes, stage delete
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