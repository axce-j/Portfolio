import { useState, useEffect, useRef } from "react";
import {
  Hero,
  Intro,
  Connector,
  Feature,
  Highlight,
  Challenges,
  Takeaway,
  FutureImprovements,
  MediaGalleryImages,
  MediaGalleryVideos,
  VIDEO_SLOT_LABEL,
} from "../projects/singleProjectPage";
import type { SingleProject, ProjectMedia, VideoRole } from "../projects/data/singleProjectData";
import { FeatureForm, type FeatureRow } from "./FeatureForm";

type ProjectOption = { slug: string; title: string };

// ─────────────────────────────────────────────
// Shared upload helper — identical signed-upload flow used
// everywhere else in the admin system (cloudinary-signature.ts +
// direct browser upload). Not duplicated logic, just reused inline
// since this file needs it in a few different handlers.
// ─────────────────────────────────────────────

async function uploadToCloudinary(password: string, file: File): Promise<string> {
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
// Hover-to-replace image overlay. Deliberately a SIBLING placed on
// top of the real component via an outer `relative group` wrapper in
// the parent — the real Hero/Highlight components are rendered
// completely unmodified underneath, so there's zero risk of this
// editor accidentally changing what the public site looks like.
// ─────────────────────────────────────────────

function ImageHoverOverlay({
  label,
  onFile,
  uploading,
}: {
  label: string;
  onFile: (file: File) => void;
  uploading: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div
      className="absolute inset-0 z-10 flex items-center justify-center bg-black/60
        opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"
    >
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="px-3 py-1.5 rounded-lg bg-teal-500/30 border border-teal-500/50
          text-teal-200 text-xs font-medium disabled:opacity-50"
      >
        {uploading ? "Uploading…" : label}
      </button>
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

function VideoHoverOverlay({
  hasVideo,
  onFile,
  uploading,
}: {
  hasVideo: boolean;
  onFile: (file: File) => void;
  uploading: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div
      className={`absolute inset-0 z-10 flex items-center justify-center bg-black/60 rounded-xl transition-opacity
        ${hasVideo ? "opacity-0 group-hover:opacity-100" : "opacity-100"}`}
    >
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="px-3 py-1.5 rounded-lg bg-teal-500/30 border border-teal-500/50
          text-teal-200 text-xs font-medium disabled:opacity-50"
      >
        {uploading ? "Uploading…" : hasVideo ? "Replace" : "Add Video"}
      </button>
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
function EditPencil({ onClick, label }: { onClick: () => void; label: string }) {
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
// Generic text-edit panel — config-driven so Intro, Highlight text,
// Challenges, Takeaway, and Future Improvements all reuse the same
// modal instead of five bespoke forms.
// ─────────────────────────────────────────────

type PanelField = { key: string; label: string; type: "text" | "textarea" };

function EditPanel({
  title,
  fields,
  initialValues,
  onSave,
  onClose,
  saving,
}: {
  title: string;
  fields: PanelField[];
  initialValues: Record<string, string>;
  onSave: (values: Record<string, string>) => void;
  onClose: () => void;
  saving: boolean;
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
            disabled={saving}
            onClick={() => onSave(values)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-teal-500/20 border border-teal-500/30
              text-teal-300 text-sm font-medium disabled:opacity-40"
          >
            {saving ? "Saving…" : "Save"}
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

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────

type PanelKey = "intro" | "highlightText" | "challenges" | "takeaway" | "future";

export default function VisualEditor({
  password,
  projects,
}: {
  password: string;
  projects: ProjectOption[];
}) {
  const [projectSlug, setProjectSlug] = useState(projects[0]?.slug ?? "");
  const [project, setProject] = useState<SingleProject | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [activePanel, setActivePanel] = useState<PanelKey | null>(null);
  const [savingPanel, setSavingPanel] = useState(false);
  const [editingFeature, setEditingFeature] = useState<FeatureRow | "new" | null>(null);

  async function loadProject(slug: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/get-full-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, projectSlug: slug }),
      });
      if (!res.ok) throw new Error("Could not load project");
      const data = await res.json();
      setProject(data.project);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (projectSlug) loadProject(projectSlug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectSlug]);

  async function handleImageUpload(target: "hero" | "highlight" | "gallery", file: File) {
    setUploadingKey(target);
    setError(null);
    try {
      const url = await uploadToCloudinary(password, file);
      const res = await fetch("/api/save-media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, projectSlug, mediaType: "image", url, imageTarget: target }),
      });
      if (!res.ok) throw new Error("Could not save image");
      await loadProject(projectSlug); // refetch — show the real, persisted state, not an optimistic guess
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingKey(null);
    }
  }

  async function handleVideoUpload(role: VideoRole, file: File) {
    setUploadingKey(`video-${role}`);
    setError(null);
    try {
      const url = await uploadToCloudinary(password, file);
      const res = await fetch("/api/save-media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, projectSlug, mediaType: "video", url, videoRole: role }),
      });
      if (!res.ok) throw new Error("Could not save video");
      await loadProject(projectSlug);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingKey(null);
    }
  }

  async function handlePanelSave(fields: { field: string; value: string }[]) {
    setSavingPanel(true);
    setError(null);
    try {
      const res = await fetch("/api/save-project-text-batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, projectSlug, fields }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Could not save");
      }
      setActivePanel(null);
      await loadProject(projectSlug);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSavingPanel(false);
    }
  }

  async function openFeatureEditor(featureId: string) {
    setError(null);
    try {
      const res = await fetch("/api/list-features", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, projectSlug }),
      });
      if (!res.ok) throw new Error("Could not load feature details");
      const data = await res.json();
      const match = (data.features as FeatureRow[]).find((f) => f.id === featureId);
      if (match) setEditingFeature(match);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not open feature editor");
    }
  }

  if (loading || !project) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="w-full max-w-xs p-6 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col gap-4">
          <p className="text-xs font-semibold tracking-widest uppercase text-white/30">Visual Editor</p>
          <select
            value={projectSlug}
            onChange={(e) => setProjectSlug(e.target.value)}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm outline-none"
          >
            {projects.map((p) => (
              <option key={p.slug} value={p.slug} className="bg-black text-white">{p.title}</option>
            ))}
          </select>
          {loading && <p className="text-xs text-white/40">Loading…</p>}
          {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
      </div>
    );
  }

  const images = project.media.filter((m) => m.type === "image");
  const videos = project.media.filter((m) => m.type === "video");
  const videoByRole: Partial<Record<VideoRole, ProjectMedia>> = {};
  for (const v of videos) if (v.videoRole) videoByRole[v.videoRole as VideoRole] = v;

  const hasHighlight = Boolean(project.highlight.title || project.highlight.description);
  const hasTakeaway = Boolean(project.takeaway.title || project.takeaway.description);

  return (
    <div className="min-h-screen text-white pb-32 bg-black">
      {/* Sticky control bar */}
      <div className="sticky top-0 z-30 bg-black/95 backdrop-blur border-b border-white/10 px-4 py-3 flex items-center gap-3">
        <select
          value={projectSlug}
          onChange={(e) => setProjectSlug(e.target.value)}
          className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs outline-none"
        >
          {projects.map((p) => (
            <option key={p.slug} value={p.slug} className="bg-black text-white">{p.title}</option>
          ))}
        </select>
        <span className="text-[10px] text-white/30 uppercase tracking-wider hidden sm:inline">
          Hover images to replace · hover text for the ✎ icon
        </span>
        {error && <span className="text-[10px] text-red-400 ml-auto">{error}</span>}
      </div>

      <div className="max-w-6xl mx-auto px-8 pt-8">

        {/* Hero */}
        <div className="relative group mb-16">
          <div className="relative group">
            <Hero project={project} onBack={() => {}} />
            <ImageHoverOverlay
              label={project.heroImage ? "Replace Hero" : "Add Hero Image"}
              uploading={uploadingKey === "hero"}
              onFile={(f) => handleImageUpload("hero", f)}
            />
          </div>
        </div>

        {/* Intro */}
        <div className="relative group mb-20">
          <Intro project={project} />
          <EditPencil label="Edit tagline & description" onClick={() => setActivePanel("intro")} />
        </div>

        {/* Features */}
        {project.features.length > 0 && (
          <div className="flex flex-col mb-10">
            <p className="text-xs font-semibold tracking-widest uppercase text-white/25 mb-8 px-1">
              Features (click a card to edit)
            </p>
            {project.features.map((feature, index) => (
              <div key={feature.id}>
                <div
                  className="relative cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => openFeatureEditor(feature.id)}
                >
                  <Feature feature={feature} />
                </div>
                {index < project.features.length - 1 && <Connector />}
              </div>
            ))}
          </div>
        )}
        <button
          onClick={() => setEditingFeature("new")}
          className="mb-16 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10
            text-white/50 text-xs font-medium hover:bg-white/10 transition-all"
        >
          + Add Feature
        </button>

        {/* Highlight */}
        {hasHighlight && (
          <div className="relative mb-8">
            <div className="relative group">
              <Highlight highlight={project.highlight} />
              {/* Image half only covers the left column visually — the overlay still spans
                  the whole card for simplicity; clicking anywhere on the image side replaces it. */}
              <ImageHoverOverlay
                label={project.highlight.image ? "Replace Image" : "Add Image"}
                uploading={uploadingKey === "highlight"}
                onFile={(f) => handleImageUpload("highlight", f)}
              />
              <EditPencil label="Edit highlight text" onClick={() => setActivePanel("highlightText")} />
            </div>
          </div>
        )}

        {/* Challenges */}
        {project.challenges.length > 0 && (
          <div className="relative group mb-8">
            <Challenges challenges={project.challenges} />
            <EditPencil label="Edit challenges" onClick={() => setActivePanel("challenges")} />
          </div>
        )}

        {/* Takeaway */}
        {hasTakeaway && (
          <div className="relative group mb-8">
            <Takeaway takeaway={project.takeaway} />
            <EditPencil label="Edit reflection" onClick={() => setActivePanel("takeaway")} />
          </div>
        )}

        {/* Future Improvements */}
        {project.futureImprovements.length > 0 && (
          <div className="relative group mb-16">
            <FutureImprovements items={project.futureImprovements} />
            <EditPencil label="Edit future improvements" onClick={() => setActivePanel("future")} />
          </div>
        )}

        {/* Gallery — v1: add-only. Replacing/deleting an individual
            existing gallery image isn't built yet (flagged as a
            known follow-up, not silently skipped). */}
        {images.length > 0 && <MediaGalleryImages images={images} />}
        <div className="mb-16 -mt-8">
          <ImageAddTile uploading={uploadingKey === "gallery"} onFile={(f) => handleImageUpload("gallery", f)} />
        </div>

        {/* Demo Videos */}
        <div className="mb-16">
          <p className="text-xs font-semibold tracking-widest uppercase text-white/25 mb-6 px-1">
            Demo Videos
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(Object.keys(VIDEO_SLOT_LABEL) as VideoRole[]).map((role) => {
              const existing = videoByRole[role];
              return (
                <div key={role} className="flex flex-col gap-2">
                  <div className="relative group rounded-xl overflow-hidden border border-white/[0.06] bg-black aspect-video">
                    {existing && (
                      <video src={existing.url} className="w-full h-full object-contain" muted />
                    )}
                    <VideoHoverOverlay
                      hasVideo={Boolean(existing)}
                      uploading={uploadingKey === `video-${role}`}
                      onFile={(f) => handleVideoUpload(role, f)}
                    />
                  </div>
                  <p className="text-xs text-white/40 px-1">{VIDEO_SLOT_LABEL[role]}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Text edit panels */}
      {activePanel === "intro" && (
        <EditPanel
          title="Tagline & Description"
          fields={[
            { key: "tagline", label: "Tagline", type: "text" },
            { key: "description", label: "Description (overrides GitHub's)", type: "textarea" },
          ]}
          initialValues={{ tagline: project.intro.tagline ?? "", description: project.intro.description ?? "" }}
          saving={savingPanel}
          onClose={() => setActivePanel(null)}
          onSave={(v) =>
            handlePanelSave([
              { field: "tagline", value: v.tagline },
              { field: "description", value: v.description },
            ])
          }
        />
      )}

      {activePanel === "highlightText" && (
        <EditPanel
          title="Highlight — Text"
          fields={[
            { key: "highlightTitle", label: "Title", type: "text" },
            { key: "highlightSubtitle", label: "Subtitle", type: "text" },
            { key: "highlightDescription", label: "Description (overrides README)", type: "textarea" },
          ]}
          initialValues={{
            highlightTitle: project.highlight.title ?? "",
            highlightSubtitle: project.highlight.subtitle ?? "",
            highlightDescription: project.highlight.description ?? "",
          }}
          saving={savingPanel}
          onClose={() => setActivePanel(null)}
          onSave={(v) =>
            handlePanelSave([
              { field: "highlightTitle", value: v.highlightTitle },
              { field: "highlightSubtitle", value: v.highlightSubtitle },
              { field: "highlightDescription", value: v.highlightDescription },
            ])
          }
        />
      )}

      {activePanel === "challenges" && (
        <EditPanel
          title="Challenges (one per line)"
          fields={[{ key: "challenges", label: "Challenges", type: "textarea" }]}
          initialValues={{ challenges: project.challenges.join("\n") }}
          saving={savingPanel}
          onClose={() => setActivePanel(null)}
          onSave={(v) => handlePanelSave([{ field: "challenges", value: v.challenges }])}
        />
      )}

      {activePanel === "takeaway" && (
        <EditPanel
          title="Reflection"
          fields={[
            { key: "takeawayTitle", label: "Title", type: "text" },
            { key: "takeawaySubtitle", label: "Subtitle", type: "text" },
            { key: "takeawayDescription", label: "Description (overrides README, one paragraph)", type: "textarea" },
          ]}
          initialValues={{
            takeawayTitle: project.takeaway.title ?? "",
            takeawaySubtitle: project.takeaway.subtitle ?? "",
            takeawayDescription: project.takeaway.description ?? "",
          }}
          saving={savingPanel}
          onClose={() => setActivePanel(null)}
          onSave={(v) =>
            handlePanelSave([
              { field: "takeawayTitle", value: v.takeawayTitle },
              { field: "takeawaySubtitle", value: v.takeawaySubtitle },
              { field: "takeawayDescription", value: v.takeawayDescription },
            ])
          }
        />
      )}

      {activePanel === "future" && (
        <EditPanel
          title="Future Improvements (one per line)"
          fields={[{ key: "futureImprovements", label: "Future Improvements", type: "textarea" }]}
          initialValues={{ futureImprovements: project.futureImprovements.join("\n") }}
          saving={savingPanel}
          onClose={() => setActivePanel(null)}
          onSave={(v) => handlePanelSave([{ field: "futureImprovements", value: v.futureImprovements }])}
        />
      )}

      {/* Feature add/edit — reuses the exact same form as the Edit
          Features tab, just triggered from clicking a card instead of
          a list row. */}
      {editingFeature !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 overflow-y-auto">
          <FeatureForm
            password={password}
            projectSlug={projectSlug}
            feature={editingFeature === "new" ? null : editingFeature}
            onDone={() => {
              setEditingFeature(null);
              loadProject(projectSlug);
            }}
            onCancel={() => setEditingFeature(null)}
          />
        </div>
      )}
    </div>
  );
}

function ImageAddTile({ uploading, onFile }: { uploading: boolean; onFile: (file: File) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      disabled={uploading}
      className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10
        text-white/50 text-xs font-medium hover:bg-white/10 transition-all disabled:opacity-40"
    >
      {uploading ? "Uploading…" : "+ Add Gallery Image"}
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