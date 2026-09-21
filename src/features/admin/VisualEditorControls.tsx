import { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────
// Shared upload helper — identical signed-upload flow used
// everywhere else in the admin system. Only ever called from
// VisualEditor's flushSave(), at the moment the project-level Save
// button is clicked — never eagerly on file pick. See the "Save
// model" note in VisualEditor.tsx for why.
// ─────────────────────────────────────────────

export async function uploadToCloudinary(password: string, file: File): Promise<string> {
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

// ─────────────────────────────────────────────
// Object-URL helpers — local, instant previews for staged files with
// no network round trip. Every hook here revokes its own URL(s) on
// cleanup so we don't leak memory as files get replaced.
// ─────────────────────────────────────────────

export function useObjectUrl(file: File | null): string | null {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!file) {
      setUrl(null);
      return;
    }
    const u = URL.createObjectURL(file);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);
  return url;
}

export function useObjectUrls(files: File[]): string[] {
  const [urls, setUrls] = useState<string[]>([]);
  useEffect(() => {
    const created = files.map((f) => URL.createObjectURL(f));
    setUrls(created);
    return () => created.forEach((u) => URL.revokeObjectURL(u));
  }, [files]);
  return urls;
}

export function useObjectUrlMap<K extends string>(fileMap: Record<K, File>): Record<K, string> {
  const [urls, setUrls] = useState<Record<string, string>>({});
  useEffect(() => {
    const next: Record<string, string> = {};
    for (const [k, f] of Object.entries<File>(fileMap)) next[k] = URL.createObjectURL(f);
    setUrls(next);
    return () => {
      Object.values(next).forEach((u) => URL.revokeObjectURL(u));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileMap]);
  return urls as Record<K, string>;
}

// ─────────────────────────────────────────────
// Hover-to-replace image overlay. Deliberately a SIBLING placed on
// top of the real component via an outer `relative group` wrapper in
// the parent — the real Hero/Highlight components are rendered
// completely unmodified underneath, so there's zero risk of this
// editor accidentally changing what the public site looks like.
// Picking a file here only stages it (onFile is synchronous, no
// network) — nothing uploads until the project-level Save.
// ─────────────────────────────────────────────

export function ImageHoverOverlay({
  label,
  onFile,
  pending,
  hasImage,
  onRemove,
}: {
  label: string;
  onFile: (file: File) => void;
  pending: boolean;
  /** When true and onRemove is given, shows a second "Remove" action. */
  hasImage?: boolean;
  onRemove?: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div
      className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-1.5 bg-black/60
        opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="px-3 py-1.5 rounded-lg bg-teal-500/30 border border-teal-500/50
            text-teal-200 text-xs font-medium"
        >
          {label}
        </button>
        {hasImage && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/40
              text-red-300 text-xs font-medium hover:bg-red-500/30"
          >
            Remove
          </button>
        )}
      </div>
      {pending && (
        <span className="text-[10px] text-amber-300/90 bg-black/50 px-2 py-0.5 rounded-full">
          Staged — uploads on Save
        </span>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}

export function VideoHoverOverlay({
  hasVideo,
  pending,
  onFile,
  onRemove,
}: {
  hasVideo: boolean;
  pending: boolean;
  onFile: (file: File) => void;
  onRemove?: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div
      className={`absolute inset-0 z-10 flex flex-col items-center justify-center gap-1.5 bg-black/60 rounded-xl transition-opacity
        ${hasVideo && !pending ? "opacity-0 group-hover:opacity-100" : "opacity-100"}`}
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="px-3 py-1.5 rounded-lg bg-teal-500/30 border border-teal-500/50
            text-teal-200 text-xs font-medium"
        >
          {hasVideo ? "Replace" : "Add Video"}
        </button>
        {hasVideo && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/40
              text-red-300 text-xs font-medium hover:bg-red-500/30"
          >
            Remove
          </button>
        )}
      </div>
      {pending && (
        <span className="text-[10px] text-amber-300/90 bg-black/50 px-2 py-0.5 rounded-full">
          Staged — uploads on Save
        </span>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}

// Small corner pencil for text sections — deliberately NOT a full
// overlay, so the real text stays fully visible/readable underneath
// while you decide whether to edit it.
export function EditPencil({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/70 border border-white/20
        text-white/60 text-xs opacity-0 group-hover:opacity-100 transition-opacity
        flex items-center justify-center hover:text-white hover:bg-black/90"
    >
      ✎
    </button>
  );
}

// ─────────────────────────────────────────────
// Generic text-edit panel — config-driven so Intro (+ Project
// Details), Highlight text, Challenges, Takeaway, and Future
// Improvements all reuse the same modal. onSave here just merges
// values into VisualEditor's local draft — no network call, no
// closing-then-refetching-the-whole-project flicker.
// ─────────────────────────────────────────────

export type PanelField = { key: string; label: string; type: "text" | "textarea" };

export function EditPanel({
  title,
  fields,
  initialValues,
  onSave,
  onClose,
}: {
  title: string;
  fields: PanelField[];
  initialValues: Record<string, string>;
  onSave: (values: Record<string, string>) => void;
  onClose: () => void;
}) {
  const [values, setValues] = useState(initialValues);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-xs font-semibold tracking-widest uppercase text-white/30">{title}</p>
        {fields.map((f) => (
          <label key={f.key} className="flex flex-col gap-1.5 text-xs text-white/40">
            {f.label}
            {f.type === "textarea" ? (
              <textarea
                rows={5}
                value={values[f.key] ?? ""}
                onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm outline-none resize-y"
              />
            ) : (
              <input
                type="text"
                value={values[f.key] ?? ""}
                onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm outline-none"
              />
            )}
          </label>
        ))}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => onSave(values)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-teal-500/20 border border-teal-500/30
              text-teal-300 text-sm font-medium"
          >
            Use these changes
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 text-sm font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export function ImageAddTile({ onFile }: { onFile: (file: File) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10
        text-white/50 text-xs font-medium hover:bg-white/10 transition-all"
    >
      + Add Gallery Image
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
          e.target.value = "";
        }}
      />
    </button>
  );
}

// ─────────────────────────────────────────────
// Admin-only gallery grid. Deliberately a SEPARATE component from
// singleProjectPage.tsx's MediaGalleryImages rather than adding a
// delete button to it — that component is shared with the public
// site, and a delete-image button has no business ever rendering
// there. Same visual layout, plus a per-image delete affordance.
// ─────────────────────────────────────────────

export function AdminGalleryGrid({
  images,
  onDelete,
}: {
  images: { id: string; url: string; caption?: string | null }[];
  onDelete: (id: string) => void;
}) {
  if (images.length === 0) return null;
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {images.map((img) => (
        <div
          key={img.id}
          className="relative group aspect-[4/3] rounded-xl overflow-hidden border border-white/[0.06] bg-white/5"
        >
          <img src={img.url} alt={img.caption ?? ""} className="w-full h-full object-cover" />
		  <button
  type="button"
  onClick={() => onDelete(img.id)}
  title="Delete image"
  className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-amber-400 border-2 border-amber-300
    shadow-[0_0_0_2px_rgba(0,0,0,0.6),0_2px_8px_rgba(0,0,0,0.5)]
    text-red-600 text-base font-extrabold opacity-0 group-hover:opacity-100 transition-opacity
    flex items-center justify-center hover:bg-amber-300 hover:scale-110"
>
  ✕
</button>
          {img.id.startsWith("pending-gallery-") && (
            <span className="absolute bottom-2 left-2 text-[10px] text-amber-300/90 bg-black/50 px-2 py-0.5 rounded-full">
              Staged
            </span>
          )}
        </div>
      ))}
    </div>
  );
}