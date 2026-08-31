import { useState, useEffect, type FormEvent } from "react";
import VisualEditor from "./VisualEditor";
import { FeatureForm, type FeatureRow } from "./FeatureForm";
import BlurredImageFrame from "@/components/blurredImageFrame";

type ProjectOption = { slug: string; title: string };
type MediaType = "image" | "video";
type VideoRole = "client_demo" | "architecture" | "reflection";
type ImageTarget = "gallery" | "hero" | "highlight";

const VIDEO_ROLE_LABELS: Record<VideoRole, string> = {
  client_demo: "Client Walkthrough",
  architecture: "Architecture & Decisions",
  reflection: "Developer Reflection",
};

const IMAGE_TARGET_LABELS: Record<ImageTarget, string> = {
  gallery: "Gallery (general photo strip)",
  hero: "Hero Image (top banner)",
  highlight: "Highlight Image",
};

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
// Upload form
// ─────────────────────────────────────────────

function UploadForm({ password, projects }: { password: string; projects: ProjectOption[] }) {
  const [projectSlug, setProjectSlug] = useState(projects[0]?.slug ?? "");
  const [mediaType, setMediaType] = useState<MediaType>("image");
  const [imageTarget, setImageTarget] = useState<ImageTarget>("gallery");
  const [videoRole, setVideoRole] = useState<VideoRole>("client_demo");
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [rebuildDetail, setRebuildDetail] = useState<string | null>(null);

  // Preview of what's CURRENTLY set for hero/highlight, so you don't
  // overwrite one blind. Only fetched when it's actually relevant —
  // gallery/video uploads never overwrite a single slot, so there's
  // nothing to preview for those.
  const [currentPreviewUrl, setCurrentPreviewUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  useEffect(() => {
    if (mediaType !== "image" || imageTarget === "gallery" || !projectSlug) {
      setCurrentPreviewUrl(null);
      return;
    }
    let cancelled = false;
    setPreviewLoading(true);
    fetch("/api/get-project-text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, projectSlug }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        setCurrentPreviewUrl(
          imageTarget === "hero" ? data.heroImage : data.highlightImage
        );
      })
      .catch(() => {
        if (!cancelled) setCurrentPreviewUrl(null);
      })
      .finally(() => {
        if (!cancelled) setPreviewLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [mediaType, imageTarget, projectSlug, password]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!file) {
      setError("Choose a file first");
      return;
    }
    if (!projectSlug) {
      setError("Choose a project");
      return;
    }

    setStatus("uploading");
    try {
      // 1. Get a signed upload payload — file bytes never touch our
      //    own server, only Cloudinary sees them directly.
      const sigRes = await fetch("/api/cloudinary-signature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!sigRes.ok) throw new Error("Could not get upload signature");
      const { cloudName, apiKey, timestamp, signature, folder } = await sigRes.json();

      // 2. Upload straight to Cloudinary.
      const cloudinaryForm = new FormData();
      cloudinaryForm.append("file", file);
      cloudinaryForm.append("api_key", apiKey);
      cloudinaryForm.append("timestamp", String(timestamp));
      cloudinaryForm.append("signature", signature);
      cloudinaryForm.append("folder", folder);

      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
        method: "POST",
        body: cloudinaryForm,
      });
      if (!uploadRes.ok) throw new Error("Cloudinary upload failed");
      const uploaded = await uploadRes.json();
      const url = uploaded.secure_url as string;

      // 3. Save the resulting URL against the project.
      const saveRes = await fetch("/api/save-media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          projectSlug,
          mediaType,
          url,
          caption: caption || null,
          videoRole: mediaType === "video" ? videoRole : undefined,
          imageTarget: mediaType === "image" ? imageTarget : undefined,
        }),
      });
      if (!saveRes.ok) {
        const body = await saveRes.json().catch(() => ({}));
        throw new Error(body.error ?? "Could not save media record");
      }
      const saved = await saveRes.json();

      setStatus("success");
      setRebuildDetail(saved.rebuild?.detail ?? null);
      setFile(null);
      setCaption("");
      setCurrentPreviewUrl(url); // reflect the just-saved image immediately
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Upload failed");
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md flex flex-col gap-5 p-8 rounded-2xl
          bg-white/[0.03] border border-white/10"
      >
        <p className="text-xs font-semibold tracking-widest uppercase text-white/30">
          Upload Media
        </p>

        <label className="flex flex-col gap-1.5 text-xs text-white/40">
          Project
          <select
            value={projectSlug}
            onChange={(e) => setProjectSlug(e.target.value)}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm outline-none"
          >
            {projects.map((p) => (
              <option key={p.slug} value={p.slug} className="bg-black text-white">{p.title}</option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-xs text-white/40">
          Media type
          <select
            value={mediaType}
            onChange={(e) => setMediaType(e.target.value as MediaType)}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm outline-none"
          >
            <option value="image" className="bg-black text-white">Image</option>
            <option value="video" className="bg-black text-white">Video</option>
          </select>
        </label>

        {mediaType === "image" && (
          <label className="flex flex-col gap-1.5 text-xs text-white/40">
            Where does this image go?
            <select
              value={imageTarget}
              onChange={(e) => setImageTarget(e.target.value as ImageTarget)}
              className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm outline-none"
            >
              {(Object.keys(IMAGE_TARGET_LABELS) as ImageTarget[]).map((target) => (
                <option key={target} value={target} className="bg-black text-white">
                  {IMAGE_TARGET_LABELS[target]}
                </option>
              ))}
            </select>
          </label>
        )}

        {mediaType === "image" && imageTarget !== "gallery" && (
          <div className="flex flex-col gap-1.5">
            <p className="text-xs text-white/40">
              Currently set{imageTarget === "hero" ? " (Hero)" : " (Highlight)"}
            </p>
            <div className="rounded-lg overflow-hidden border border-white/10 bg-white/5 aspect-video flex items-center justify-center">
              {previewLoading ? (
                <p className="text-xs text-white/30">Loading…</p>
			) : currentPreviewUrl ? (
                <BlurredImageFrame src={currentPreviewUrl} alt="" />
              ) : (
                <p className="text-xs text-white/30">Nothing set yet</p>
              )}
            </div>
            <p className="text-[11px] text-amber-400/80">
              Uploading here replaces this — there's no undo.
            </p>
          </div>
        )}

        {mediaType === "video" && (
          <label className="flex flex-col gap-1.5 text-xs text-white/40">
            Video role
            <select
              value={videoRole}
              onChange={(e) => setVideoRole(e.target.value as VideoRole)}
              className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm outline-none"
            >
              {(Object.keys(VIDEO_ROLE_LABELS) as VideoRole[]).map((role) => (
                <option key={role} value={role} className="bg-black text-white">{VIDEO_ROLE_LABELS[role]}</option>
              ))}
            </select>
          </label>
        )}

        <label className="flex flex-col gap-1.5 text-xs text-white/40">
          File
          <input
            type="file"
            accept={mediaType === "image" ? "image/*" : "video/*"}
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="text-sm text-white/60 file:mr-3 file:px-3 file:py-1.5 file:rounded-lg
              file:border-0 file:bg-white/10 file:text-white/70 file:text-xs"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-xs text-white/40">
          Caption (optional)
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm outline-none"
          />
        </label>

        {error && <p className="text-xs text-red-400">{error}</p>}
        {status === "success" && (
          <p className="text-xs text-teal-400">
            Uploaded ✓{rebuildDetail ? ` — ${rebuildDetail}` : ""}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "uploading"}
          className="px-4 py-2.5 rounded-xl bg-teal-500/20 border border-teal-500/30
            text-teal-300 text-sm font-medium hover:bg-teal-500/30 transition-all
            disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {status === "uploading" ? "Uploading…" : "Upload"}
        </button>
      </form>
    </div>
  );
}

// ─────────────────────────────────────────────
// Text edit form
// ─────────────────────────────────────────────

const TEXT_FIELDS = [
  { key: "tagline", label: "Tagline", type: "text" as const },
  { key: "description", label: "Description (overrides GitHub's)", type: "textarea" as const },
  { key: "role", label: "Role", type: "text" as const },
  { key: "duration", label: "Duration", type: "text" as const },
  { key: "client", label: "Client", type: "text" as const },
  { key: "year", label: "Year", type: "text" as const },
  { key: "highlightTitle", label: "Highlight — Title", type: "text" as const },
  { key: "highlightSubtitle", label: "Highlight — Subtitle", type: "text" as const },
  { key: "highlightDescription", label: "Highlight — Description (overrides README)", type: "textarea" as const },
  { key: "takeawayTitle", label: "Reflection — Title", type: "text" as const },
  { key: "takeawaySubtitle", label: "Reflection — Subtitle", type: "text" as const },
  { key: "takeawayDescription", label: "Reflection — Description (overrides README, one paragraph)", type: "textarea" as const },
  { key: "challenges", label: "Challenges (one per line, overrides README)", type: "textarea" as const },
  { key: "futureImprovements", label: "Future Improvements (one per line, overrides README)", type: "textarea" as const },
] as const;

type TextFieldKey = (typeof TEXT_FIELDS)[number]["key"];
type TextValues = Record<TextFieldKey, string>;

function TextEditForm({ password, projects }: { password: string; projects: ProjectOption[] }) {
  const [projectSlug, setProjectSlug] = useState(projects[0]?.slug ?? "");
  const [fieldKey, setFieldKey] = useState<TextFieldKey>(TEXT_FIELDS[0].key);
  const [values, setValues] = useState<TextValues | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [rebuildDetail, setRebuildDetail] = useState<string | null>(null);

  async function loadProjectValues(slug: string) {
    setLoading(true);
    setError(null);
    setStatus("idle");
    try {
      const res = await fetch("/api/get-project-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, projectSlug: slug }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Could not load current values");
      }
      const data = await res.json();
      setValues(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  // Load values whenever the selected project changes — NOT when the
  // field changes, since one fetch already returns every field for
  // that project.
  useEffect(() => {
    if (projectSlug) loadProjectValues(projectSlug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectSlug]);

  async function handleSave() {
    if (!values) return;
    setStatus("saving");
    setError(null);
    try {
      const res = await fetch("/api/save-project-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          projectSlug,
          field: fieldKey,
          value: values[fieldKey],
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Could not save");
      }
      const saved = await res.json();
      setStatus("success");
      setRebuildDetail(saved.rebuild?.detail ?? null);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Save failed");
    }
  }

  const activeField = TEXT_FIELDS.find((f) => f.key === fieldKey)!;
  const currentValue = values?.[fieldKey] ?? "";

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md flex flex-col gap-5 p-8 rounded-2xl bg-white/[0.03] border border-white/10">
        <p className="text-xs font-semibold tracking-widest uppercase text-white/30">
          Edit Text
        </p>

        <label className="flex flex-col gap-1.5 text-xs text-white/40">
          Project
          <select
            value={projectSlug}
            onChange={(e) => setProjectSlug(e.target.value)}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm outline-none"
          >
            {projects.map((p) => (
              <option key={p.slug} value={p.slug} className="bg-black text-white">{p.title}</option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-xs text-white/40">
          Field
          <select
            value={fieldKey}
            onChange={(e) => {
              setFieldKey(e.target.value as TextFieldKey);
              setStatus("idle");
            }}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm outline-none"
          >
            {TEXT_FIELDS.map((f) => (
              <option key={f.key} value={f.key} className="bg-black text-white">{f.label}</option>
            ))}
          </select>
        </label>

        {loading && <p className="text-xs text-white/40">Loading current value…</p>}

        {!loading && values && (
          <label className="flex flex-col gap-1.5 text-xs text-white/40">
            Value
            {activeField.type === "textarea" ? (
              <textarea
                rows={6}
                value={currentValue}
                onChange={(e) => setValues({ ...values, [fieldKey]: e.target.value })}
                className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm outline-none resize-y"
              />
            ) : (
              <input
                type="text"
                value={currentValue}
                onChange={(e) => setValues({ ...values, [fieldKey]: e.target.value })}
                className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm outline-none"
              />
            )}
          </label>
        )}

        {error && <p className="text-xs text-red-400">{error}</p>}
        {status === "success" && (
          <p className="text-xs text-teal-400">
            Saved ✓{rebuildDetail ? ` — ${rebuildDetail}` : ""}
          </p>
        )}

        <button
          onClick={handleSave}
          disabled={loading || status === "saving" || !values}
          className="px-4 py-2.5 rounded-xl bg-teal-500/20 border border-teal-500/30
            text-teal-300 text-sm font-medium hover:bg-teal-500/30 transition-all
            disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {status === "saving" ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Feature edit form (list → add/edit one feature)
// ─────────────────────────────────────────────
// FeatureRow and FeatureForm itself now live in ./FeatureForm.tsx —
// imported above — shared with VisualEditor.tsx.

function FeatureEditForm({ password, projects }: { password: string; projects: ProjectOption[] }) {
  const [projectSlug, setProjectSlug] = useState(projects[0]?.slug ?? "");
  const [features, setFeatures] = useState<FeatureRow[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [listError, setListError] = useState<string | null>(null);

  // null = showing the list. "new" = blank add form. A FeatureRow =
  // editing that existing feature.
  const [editing, setEditing] = useState<FeatureRow | "new" | null>(null);

  async function loadFeatures(slug: string) {
    setLoading(true);
    setListError(null);
    try {
      const res = await fetch("/api/list-features", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, projectSlug: slug }),
      });
      if (!res.ok) throw new Error("Could not load features");
      const data = await res.json();
      setFeatures(data.features);
    } catch (err) {
      setListError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (projectSlug) loadFeatures(projectSlug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectSlug]);

  if (editing !== null) {
    return (
      <FeatureForm
        password={password}
        projectSlug={projectSlug}
        feature={editing === "new" ? null : editing}
        onDone={() => {
          setEditing(null);
          loadFeatures(projectSlug);
        }}
        onCancel={() => setEditing(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg flex flex-col gap-5">
        <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col gap-5">
          <p className="text-xs font-semibold tracking-widest uppercase text-white/30">
            Edit Features
          </p>

          <label className="flex flex-col gap-1.5 text-xs text-white/40">
            Project
            <select
              value={projectSlug}
              onChange={(e) => setProjectSlug(e.target.value)}
              className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm outline-none"
            >
              {projects.map((p) => (
                <option key={p.slug} value={p.slug} className="bg-black text-white">{p.title}</option>
              ))}
            </select>
          </label>

          {loading && <p className="text-xs text-white/40">Loading…</p>}
          {listError && <p className="text-xs text-red-400">{listError}</p>}

          {!loading && features && features.length === 0 && (
            <p className="text-xs text-white/30">No features yet for this project.</p>
          )}

          {!loading && features && features.length > 0 && (
            <div className="flex flex-col gap-2">
              {features.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setEditing(f)}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/10
                    hover:bg-white/5 transition-all text-left"
                >
                  <div className="w-14 h-10 rounded-lg overflow-hidden bg-white/5 border border-white/10 shrink-0 flex items-center justify-center">
                    {f.image ? (
                      <img src={f.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white/20 text-[10px]">no img</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/80 truncate">{f.title}</p>
                    {f.subtitle && <p className="text-xs text-white/40 truncate">{f.subtitle}</p>}
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ${
                    f.source === "readme"
                      ? "bg-white/5 text-white/30 border border-white/10"
                      : "bg-teal-500/10 text-teal-400 border border-teal-500/20"
                  }`}>
                    {f.source === "readme" ? "auto" : "manual"}
                  </span>
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => setEditing("new")}
            className="px-4 py-2.5 rounded-xl bg-teal-500/20 border border-teal-500/30
              text-teal-300 text-sm font-medium hover:bg-teal-500/30 transition-all"
          >
            + Add Feature
          </button>
        </div>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────

export default function AdminUploadPage() {
  const [session, setSession] = useState<{ password: string; projects: ProjectOption[] } | null>(null);
  const [mode, setMode] = useState<"media" | "text" | "features" | "visual">("media");

  if (!session) {
    return <PasswordGate onUnlocked={(password, projects) => setSession({ password, projects })} />;
  }

  return (
    <div>
      <div className="flex justify-center gap-2 pt-8 bg-black">
        <button
          onClick={() => setMode("media")}
          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
            mode === "media"
              ? "bg-teal-500/20 border border-teal-500/30 text-teal-300"
              : "bg-white/5 border border-white/10 text-white/40 hover:text-white/60"
          }`}
        >
          Upload Media
        </button>
        <button
          onClick={() => setMode("text")}
          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
            mode === "text"
              ? "bg-teal-500/20 border border-teal-500/30 text-teal-300"
              : "bg-white/5 border border-white/10 text-white/40 hover:text-white/60"
          }`}
        >
          Edit Text
        </button>
        <button
          onClick={() => setMode("features")}
          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
            mode === "features"
              ? "bg-teal-500/20 border border-teal-500/30 text-teal-300"
              : "bg-white/5 border border-white/10 text-white/40 hover:text-white/60"
          }`}
        >
          Edit Features
        </button>
        <button
          onClick={() => setMode("visual")}
          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
            mode === "visual"
              ? "bg-teal-500/20 border border-teal-500/30 text-teal-300"
              : "bg-white/5 border border-white/10 text-white/40 hover:text-white/60"
          }`}
        >
          Visual Editor
        </button>
      </div>
      {mode === "media" && <UploadForm password={session.password} projects={session.projects} />}
      {mode === "text" && <TextEditForm password={session.password} projects={session.projects} />}
      {mode === "features" && <FeatureEditForm password={session.password} projects={session.projects} />}
      {mode === "visual" && <VisualEditor password={session.password} projects={session.projects} />}
    </div>
  );
}