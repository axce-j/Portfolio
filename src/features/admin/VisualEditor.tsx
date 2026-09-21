import { useState, useEffect, useMemo } from "react";
import {
  Hero,
  Intro,
  Connector,
  Feature,
  Highlight,
  Challenges,
  Takeaway,
  FutureImprovements,
  VIDEO_SLOT_LABEL,
} from "../projects/singleProjectPage";
import type { SingleProject, ProjectMedia, VideoRole } from "../projects/data/singleProjectData";
import { FeatureForm, type FeatureRow, type FeatureFormValues } from "./FeatureForm";
import { ImagePreviewDisabled } from "@/components/ImagePreviewContext";
import { RadialPicker } from "./RadialPicker";
import {
  uploadToCloudinary,
  useObjectUrl,
  useObjectUrls,
  useObjectUrlMap,
  ImageHoverOverlay,
  VideoHoverOverlay,
  EditPencil,
  EditPanel,
  ImageAddTile,
  AdminGalleryGrid,
} from "./VisualEditorControls";

type ProjectOption = { slug: string; title: string };

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────

type PanelKey = "intro" | "highlightText" | "challenges" | "takeaway" | "future";

// Every field the old "Edit Text" tab exposed, now all editable
// in-place here. role/client/duration/year live in the "Project
// Details" card inside Intro, so they're folded into the same
// "intro" panel that already handled tagline/description.
type TextFieldKey =
  | "tagline"
  | "description"
  | "role"
  | "duration"
  | "client"
  | "year"
  | "highlightTitle"
  | "highlightSubtitle"
  | "highlightDescription"
  | "takeawayTitle"
  | "takeawaySubtitle"
  | "takeawayDescription"
  | "challenges"
  | "futureImprovements";

type FeatureChange = FeatureFormValues & { isNew: boolean };

export default function VisualEditor({
  password,
  projects,
}: {
  password: string;
  projects: ProjectOption[];
}) {
  const [projectSlug, setProjectSlug] = useState<string>("");
  const [project, setProject] = useState<SingleProject | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activePanel, setActivePanel] = useState<PanelKey | null>(null);
  const [editingFeatureId, setEditingFeatureId] = useState<string | "new" | null>(null);

  // ── Staged edits — nothing here touches the network until Save ──
  const [textEdits, setTextEdits] = useState<Partial<Record<TextFieldKey, string>>>({});
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [highlightFile, setHighlightFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [videoFiles, setVideoFiles] = useState<Partial<Record<VideoRole, File>>>({});
  const [featureChanges, setFeatureChanges] = useState<Record<string, FeatureChange>>({});
  const [deletedFeatureIds, setDeletedFeatureIds] = useState<Set<string>>(new Set());
  const [heroDeleted, setHeroDeleted] = useState(false);
  const [highlightDeleted, setHighlightDeleted] = useState(false);
  const [deletedGalleryIds, setDeletedGalleryIds] = useState<Set<string>>(new Set());
  const [deletedVideoRoles, setDeletedVideoRoles] = useState<Set<VideoRole>>(new Set());

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  function resetDraft() {
    setTextEdits({});
    setHeroFile(null);
    setHighlightFile(null);
    setGalleryFiles([]);
    setVideoFiles({});
    setFeatureChanges({});
    setDeletedFeatureIds(new Set());
    setHeroDeleted(false);
    setHighlightDeleted(false);
    setDeletedGalleryIds(new Set());
    setDeletedVideoRoles(new Set());
    setSaveMessage(null);
  }

  const isDirty =
    Object.keys(textEdits).length > 0 ||
    heroFile !== null ||
    highlightFile !== null ||
    galleryFiles.length > 0 ||
    Object.keys(videoFiles).length > 0 ||
    Object.keys(featureChanges).length > 0 ||
    deletedFeatureIds.size > 0 ||
    heroDeleted ||
    highlightDeleted ||
    deletedGalleryIds.size > 0 ||
    deletedVideoRoles.size > 0;

  // Warn on an actual tab close/refresh with unsaved work — this is
  // the one guard the browser will let us show without a custom UI.
  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

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
      resetDraft();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function selectProject(slug: string) {
    if (isDirty && !window.confirm("You have unsaved changes that will be lost. Switch projects anyway?")) {
      return;
    }
    setProjectSlug(slug);
  }

  useEffect(() => {
    if (projectSlug) loadProject(projectSlug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectSlug]);

  // ── Local previews for every staged file — instant, no network ──
  const heroPreviewUrl = useObjectUrl(heroFile);
  const highlightPreviewUrl = useObjectUrl(highlightFile);
  const galleryPreviewUrls = useObjectUrls(galleryFiles);
  const videoPreviewUrls = useObjectUrlMap(videoFiles as Record<string, File>);
  const featureFileMap = useMemo(() => {
    const m: Record<string, File> = {};
    for (const [id, change] of Object.entries(featureChanges)) {
      if (change.file) m[id] = change.file;
    }
    return m;
  }, [featureChanges]);
  const featurePreviewUrls = useObjectUrlMap(featureFileMap);

  // ── Merge baseline + staged edits into what actually renders ──
  const displayProject: SingleProject | null = useMemo(() => {
    if (!project) return null;

    const displayFeatures: SingleProject["features"] = [
      ...project.features
        .filter((f) => !deletedFeatureIds.has(f.id))
        .map((f) => {
          const change = featureChanges[f.id];
          if (!change) return f;
          return {
            ...f,
            title: change.title,
            subtitle: change.subtitle,
            description: change.description,
            image: featurePreviewUrls[f.id] ?? f.image,
          };
        }),
      ...Object.entries(featureChanges)
        .filter(([id]) => id.startsWith("new-"))
        .map(([id, change]) => ({
          id,
          title: change.title,
          subtitle: change.subtitle,
          description: change.description,
          image: featurePreviewUrls[id] ?? null,
          imageAlt: null,
        })),
    ];

    const existingImages = project.media.filter((m) => m.type === "image" && !deletedGalleryIds.has(m.id));
    const stagedGalleryImages: ProjectMedia[] = galleryPreviewUrls.map((url, i) => ({
      id: `pending-gallery-${i}`,
      type: "image",
      url,
      caption: null,
    }));
    const existingVideos = project.media.filter(
      (m) =>
        m.type === "video" &&
        !(m.videoRole && videoFiles[m.videoRole as VideoRole]) &&
        !(m.videoRole && deletedVideoRoles.has(m.videoRole as VideoRole))
    );
    const stagedVideos: ProjectMedia[] = Object.entries(videoPreviewUrls).map(([role, url]) => ({
      id: `pending-video-${role}`,
      type: "video",
      url,
      videoRole: role as VideoRole,
    }));

    return {
      ...project,
      heroImage: heroDeleted ? null : heroPreviewUrl ?? project.heroImage,
      intro: {
        ...project.intro,
        tagline: textEdits.tagline ?? project.intro.tagline,
        description: textEdits.description ?? project.intro.description,
      },
      role: textEdits.role ?? project.role,
      client: textEdits.client ?? project.client,
      duration: textEdits.duration ?? project.duration,
      year: textEdits.year !== undefined ? Number(textEdits.year) || project.year : project.year,
      highlight: {
        ...project.highlight,
        title: textEdits.highlightTitle ?? project.highlight.title,
        subtitle: textEdits.highlightSubtitle ?? project.highlight.subtitle,
        description: textEdits.highlightDescription ?? project.highlight.description,
        image: highlightDeleted ? null : highlightPreviewUrl ?? project.highlight.image,
      },
      takeaway: {
        ...project.takeaway,
        title: textEdits.takeawayTitle ?? project.takeaway.title,
        subtitle: textEdits.takeawaySubtitle ?? project.takeaway.subtitle,
        description: textEdits.takeawayDescription ?? project.takeaway.description,
      },
      challenges:
        textEdits.challenges !== undefined
          ? textEdits.challenges.split("\n").map((s) => s.trim()).filter(Boolean)
          : project.challenges,
      futureImprovements:
        textEdits.futureImprovements !== undefined
          ? textEdits.futureImprovements.split("\n").map((s) => s.trim()).filter(Boolean)
          : project.futureImprovements,
      features: displayFeatures,
      media: [...existingImages, ...stagedGalleryImages, ...existingVideos, ...stagedVideos],
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    project,
    textEdits,
    heroPreviewUrl,
    highlightPreviewUrl,
    galleryPreviewUrls,
    videoPreviewUrls,
    featureChanges,
    featurePreviewUrls,
    deletedFeatureIds,
    heroDeleted,
    highlightDeleted,
    deletedGalleryIds,
    deletedVideoRoles,
  ]);

  function handlePanelSave(values: Record<string, TextFieldKey extends string ? string : never> | Record<string, string>) {
    setTextEdits((prev) => ({ ...prev, ...values }));
    setActivePanel(null);
  }

  function openFeatureEditor(id: string) {
    setEditingFeatureId(id);
  }

  function handleFeatureSave(id: string, isNew: boolean, values: FeatureFormValues) {
    setFeatureChanges((prev) => ({ ...prev, [id]: { ...values, isNew } }));
    setEditingFeatureId(null);
  }

  function handleFeatureDelete(id: string) {
    // A brand-new, never-saved feature just gets dropped from the
    // draft entirely — there's nothing on the server to delete yet.
    if (id.startsWith("new-")) {
      setFeatureChanges((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    } else {
      setDeletedFeatureIds((prev) => new Set(prev).add(id));
    }
    setEditingFeatureId(null);
  }

  // A staged-but-unsaved gallery pick ("pending-gallery-N") just gets
  // dropped from galleryFiles — it was never uploaded, nothing to
  // delete server-side. An already-saved image gets marked for
  // deletion instead, same staged-until-Save pattern as everything
  // else (including "Discard changes" being able to undo it).
  function handleDeleteGalleryImage(id: string) {
    if (id.startsWith("pending-gallery-")) {
      const index = Number(id.slice("pending-gallery-".length));
      setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    } else {
      setDeletedGalleryIds((prev) => new Set(prev).add(id));
    }
  }

  function handleDeleteAllGallery() {
    if (!project) return;
    const existingIds = project.media.filter((m) => m.type === "image").map((m) => m.id);
    if (existingIds.length === 0 && galleryFiles.length === 0) return;
    if (
      !window.confirm(
        `Permanently delete all ${existingIds.length} gallery image(s) when you Save? This can't be undone once saved.`
      )
    ) {
      return;
    }
    setDeletedGalleryIds((prev) => {
      const next = new Set(prev);
      existingIds.forEach((id) => next.add(id));
      return next;
    });
    setGalleryFiles([]);
  }

  // "Prune" is deliberately images only (hero, highlight, gallery) —
  // videos are the separate per-video delete below. Composes the
  // same staged flags/sets the individual controls use, so it's just
  // as undoable via "Discard changes" as a single delete would be.
  function handlePruneImages() {
    if (!project) return;
    if (
      !window.confirm(
        "Permanently delete the hero image, highlight image, and every gallery image when you Save? This can't be undone once saved."
      )
    ) {
      return;
    }
    setHeroDeleted(true);
    setHeroFile(null);
    setHighlightDeleted(true);
    setHighlightFile(null);
    const existingIds = project.media.filter((m) => m.type === "image").map((m) => m.id);
    setDeletedGalleryIds((prev) => {
      const next = new Set(prev);
      existingIds.forEach((id) => next.add(id));
      return next;
    });
    setGalleryFiles([]);
  }

  // Same staged-vs-saved distinction as the gallery: a pending
  // replacement file just gets un-staged; an existing saved video
  // gets marked for deletion.
  function handleDeleteVideo(role: VideoRole) {
    if (videoFiles[role]) {
      setVideoFiles((prev) => {
        const next = { ...prev };
        delete next[role];
        return next;
      });
    } else {
      setDeletedVideoRoles((prev) => new Set(prev).add(role));
    }
  }

  async function flushSave(): Promise<boolean> {
    if (!project || !projectSlug) return false;
    setSaving(true);
    setError(null);
    setSaveMessage(null);
    try {
      // 1. All text fields in one batched call.
      const fields = Object.entries(textEdits).map(([field, value]) => ({ field, value: value ?? "" }));
      if (fields.length > 0) {
        const res = await fetch("/api/save-project-text-batch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password, projectSlug, fields }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? "Could not save text fields");
        }
      }

      // 2. Hero / Highlight — upload then associate.
      if (heroFile) {
        const url = await uploadToCloudinary(password, heroFile);
        const res = await fetch("/api/save-media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password, projectSlug, mediaType: "image", url, imageTarget: "hero" }),
        });
        if (!res.ok) throw new Error("Could not save hero image");
      }
      if (highlightFile) {
        const url = await uploadToCloudinary(password, highlightFile);
        const res = await fetch("/api/save-media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password, projectSlug, mediaType: "image", url, imageTarget: "highlight" }),
        });
        if (!res.ok) throw new Error("Could not save highlight image");
      }

      // 3. Gallery additions — one upload + save per file, in order.
      for (const file of galleryFiles) {
        const url = await uploadToCloudinary(password, file);
        const res = await fetch("/api/save-media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password, projectSlug, mediaType: "image", url, imageTarget: "gallery" }),
        });
        if (!res.ok) throw new Error("Could not save a gallery image");
      }

      // 4. Videos, per role.
      for (const [role, file] of Object.entries(videoFiles) as [VideoRole, File][]) {
        const url = await uploadToCloudinary(password, file);
        const res = await fetch("/api/save-media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password, projectSlug, mediaType: "video", url, videoRole: role }),
        });
        if (!res.ok) throw new Error("Could not save a video");
      }

      // 5. Feature upserts.
      for (const [id, change] of Object.entries(featureChanges)) {
        const imageUrl = change.file ? await uploadToCloudinary(password, change.file) : undefined;
        const res = await fetch("/api/save-feature", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            password,
            projectSlug,
            featureId: id.startsWith("new-") ? undefined : id,
            title: change.title,
            subtitle: change.subtitle,
            description: change.description,
            image: imageUrl,
          }),
        });
        if (!res.ok) throw new Error(`Could not save feature "${change.title}"`);
      }

      // 6. Feature deletions.
      for (const id of deletedFeatureIds) {
        const res = await fetch("/api/delete-feature", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password, projectSlug, featureId: id }),
        });
        if (!res.ok) throw new Error("Could not delete a feature");
      }

      // 7. Deletions — hero/highlight, gallery images, then videos.
      // Comes after the upserts above; mutually exclusive by
      // construction (picking a replacement clears the matching
      // *Deleted flag, so a hero/highlight can never be both staged
      // for upload and staged for deletion at once).
      if (heroDeleted && project.heroImage) {
        const res = await fetch("/api/delete-media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password, projectSlug, target: "hero" }),
        });
        if (!res.ok) throw new Error("Could not delete hero image");
      }
      if (highlightDeleted && project.highlight.image) {
        const res = await fetch("/api/delete-media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password, projectSlug, target: "highlight" }),
        });
        if (!res.ok) throw new Error("Could not delete highlight image");
      }
      for (const id of deletedGalleryIds) {
        const res = await fetch("/api/delete-media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password, projectSlug, mediaId: id }),
        });
        if (!res.ok) throw new Error("Could not delete a gallery image");
      }
      for (const role of deletedVideoRoles) {
        const videoRow = project.media.find((m) => m.type === "video" && m.videoRole === role);
        if (videoRow) {
          const res = await fetch("/api/delete-media", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password, projectSlug, mediaId: videoRow.id }),
          });
          if (!res.ok) throw new Error("Could not delete a video");
        }
      }

      setSaveMessage("Saved ✓ — rebuild triggered");
      await loadProject(projectSlug); // one refresh, now that everything is actually committed
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed — your staged changes are still here, try again");
      return false;
    } finally {
      setSaving(false);
    }
  }

  // Returns to a genuinely empty picker — no project pre-selected,
  // nothing auto-navigated to. Used by both the plain "Exit" link and
  // (after a successful save) "Save and Exit".
  function exitToPicker() {
    setProjectSlug("");
    setProject(null);
    resetDraft();
  }

  function handleExit() {
    if (isDirty && !window.confirm("Discard unsaved changes and exit without saving?")) return;
    exitToPicker();
  }

  async function handleSaveAndExit() {
    const ok = await flushSave();
    if (ok) exitToPicker();
    // On failure, flushSave already set `error` and kept the draft —
    // stay put so nothing staged is lost.
  }

  if (!projectSlug || loading || !project || !displayProject) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 gap-6">
        <p className="text-xs font-semibold tracking-widest uppercase text-white/30">Visual Editor</p>
        <RadialPicker
  category="Project"
  hubLabel="Click to view and select project"
  items={projects.map((p) => ({ id: p.slug, label: p.title }))}
  onSelect={selectProject}
/>
        {projectSlug && loading && <p className="text-xs text-white/40">Loading…</p>}
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>

    );
  }

  const images = displayProject.media.filter((m) => m.type === "image");
  const videos = displayProject.media.filter((m) => m.type === "video");
  const videoByRole: Partial<Record<VideoRole, ProjectMedia>> = {};
  for (const v of videos) if (v.videoRole) videoByRole[v.videoRole as VideoRole] = v;

  const hasHighlight = Boolean(displayProject.highlight.title || displayProject.highlight.description);
  const hasTakeaway = Boolean(displayProject.takeaway.title || displayProject.takeaway.description);

  const editingFeature: FeatureRow | null =
    editingFeatureId === null || editingFeatureId === "new"
      ? null
      : (displayProject.features.find((f) => f.id === editingFeatureId) as FeatureRow) ?? null;

  return (
    <ImagePreviewDisabled>
    <div className="min-h-screen text-white pb-32 bg-black">
      {/* Sticky control bar — this IS the save model now: pick a
          project, make any number of edits (all local/instant), then
          hit Save Project once to actually write everything. */}
      <div className="sticky top-0 z-30 bg-black/95 backdrop-blur border-b border-white/10 px-4 py-3 flex items-center gap-3 flex-wrap">
        <select
          value={projectSlug}
          onChange={(e) => selectProject(e.target.value)}
          className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs outline-none"
        >
          {projects.map((p) => (
            <option key={p.slug} value={p.slug} className="bg-black text-white">{p.title}</option>
          ))}
        </select>
        <span className="text-[10px] text-white/30 uppercase tracking-wider hidden sm:inline">
          Hover images to replace · hover text for the ✎ icon
        </span>

        <div className="ml-auto flex items-center gap-3">
		<button
  type="button"
  onClick={handleExit}
  className="px-3 py-1.5 rounded-full text-xs font-bold bg-white/10 border border-white/25
    text-white hover:bg-white/20 transition-all"
>
  ← Exit
</button>
<button
  type="button"
  onClick={handlePruneImages}
  title="Delete hero, highlight, and every gallery image"
  className="px-3 py-1.5 rounded-full text-xs font-bold bg-red-500/25 border border-red-500/50
    text-red-300 hover:bg-red-500/40 hover:text-red-200 transition-all"
>
  Prune images
</button>
          {isDirty && (
          <button
		  type="button"
		  onClick={() => { if (window.confirm("Discard all unsaved changes on this project?")) resetDraft(); }}
		  className="px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500/20 border border-amber-500/40
			text-amber-300 hover:bg-amber-500/35 hover:text-amber-200 transition-all"
		>
		  Discard changes
		</button>
          )}
          {saveMessage && <span className="text-[11px] text-teal-400">{saveMessage}</span>}
          {error && <span className="text-[11px] text-red-400">{error}</span>}
          <button
            type="button"
            onClick={handleSaveAndExit}
            disabled={!isDirty || saving}
            className="px-4 py-1.5 rounded-full text-xs font-medium bg-teal-500/20 border border-teal-500/30
              text-teal-300 hover:bg-teal-500/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {saving ? "Saving…" : "Save and Exit"}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 pt-8">

        {/* Hero */}
        <div className="relative group mb-16">
          <div className="relative group">
            <Hero project={displayProject} onBack={() => {}} />
            <ImageHoverOverlay
              label={project.heroImage ? "Replace Hero" : "Add Hero Image"}
              pending={heroFile !== null}
              hasImage={Boolean(project.heroImage) && !heroDeleted}
              onFile={(f) => {
                setHeroFile(f);
                setHeroDeleted(false);
              }}
              onRemove={() => {
                setHeroDeleted(true);
                setHeroFile(null);
              }}
            />
          </div>
        </div>

        {/* Intro (tagline, description, role, client, duration, year all live here) */}
        <div className="relative group mb-20">
          <Intro project={displayProject} />
          <EditPencil label="Edit project info" onClick={() => setActivePanel("intro")} />
        </div>

        {/* Features */}
        {displayProject.features.length > 0 && (
          <div className="flex flex-col mb-10">
            <p className="text-xs font-semibold tracking-widest uppercase text-white/25 mb-8 px-1">
              Features (click a card to edit)
            </p>
            {displayProject.features.map((feature, index) => (
              <div key={feature.id}>
                <div
                  className="relative cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => openFeatureEditor(feature.id)}
                >
                  <Feature feature={feature} />
                </div>
                {index < displayProject.features.length - 1 && <Connector />}
              </div>
            ))}
          </div>
        )}
        <button
          onClick={() => setEditingFeatureId("new")}
          className="mb-16 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10
            text-white/50 text-xs font-medium hover:bg-white/10 transition-all"
        >
          + Add Feature
        </button>

        {/* Highlight */}
        {hasHighlight && (
          <div className="relative mb-8">
            <div className="relative group">
              <Highlight highlight={displayProject.highlight} />
              <ImageHoverOverlay
                label={project.highlight.image ? "Replace Image" : "Add Image"}
                pending={highlightFile !== null}
                hasImage={Boolean(project.highlight.image) && !highlightDeleted}
                onFile={(f) => {
                  setHighlightFile(f);
                  setHighlightDeleted(false);
                }}
                onRemove={() => {
                  setHighlightDeleted(true);
                  setHighlightFile(null);
                }}
              />
              <EditPencil label="Edit highlight text" onClick={() => setActivePanel("highlightText")} />
            </div>
          </div>
        )}

        {/* Challenges */}
        {displayProject.challenges.length > 0 && (
          <div className="relative group mb-8">
            <Challenges challenges={displayProject.challenges} />
            <EditPencil label="Edit challenges" onClick={() => setActivePanel("challenges")} />
          </div>
        )}

        {/* Takeaway */}
        {hasTakeaway && (
          <div className="relative group mb-8">
            <Takeaway takeaway={displayProject.takeaway} />
            <EditPencil label="Edit reflection" onClick={() => setActivePanel("takeaway")} />
          </div>
        )}

        {/* Future Improvements */}
        {displayProject.futureImprovements.length > 0 && (
          <div className="relative group mb-16">
            <FutureImprovements items={displayProject.futureImprovements} />
            <EditPencil label="Edit future improvements" onClick={() => setActivePanel("future")} />
          </div>
        )}

        {/* Gallery — AdminGalleryGrid (not the public MediaGalleryImages)
            so each thumbnail gets a delete affordance; staged picks
            show a "Staged" badge until Save. */}
        <div className="mb-16 -mt-8">
          <div className="flex items-center justify-between mb-6 px-1">
            <p className="text-xs font-semibold tracking-widest uppercase text-white/25">Gallery</p>
            {images.some((img) => !img.id.startsWith("pending-gallery-")) && (
              <button
                type="button"
                onClick={handleDeleteAllGallery}
                className="text-[11px] text-red-400/60 hover:text-red-400 transition-all"
              >
                Delete all gallery images
              </button>
            )}
          </div>
          {images.length > 0 && (
            <div className="mb-4">
              <AdminGalleryGrid images={images} onDelete={handleDeleteGalleryImage} />
            </div>
          )}
          <ImageAddTile onFile={(f) => setGalleryFiles((prev) => [...prev, f])} />
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
                      pending={Boolean(videoFiles[role])}
                      onFile={(f) => setVideoFiles((prev) => ({ ...prev, [role]: f }))}
                      onRemove={() => handleDeleteVideo(role)}
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
          title="Project Info"
          fields={[
            { key: "tagline", label: "Tagline", type: "text" },
            { key: "description", label: "Description (overrides GitHub's)", type: "textarea" },
            { key: "role", label: "Role", type: "text" },
            { key: "client", label: "Client", type: "text" },
            { key: "duration", label: "Duration", type: "text" },
            { key: "year", label: "Year", type: "text" },
          ]}
          initialValues={{
            tagline: textEdits.tagline ?? displayProject.intro.tagline ?? "",
            description: textEdits.description ?? displayProject.intro.description ?? "",
            role: textEdits.role ?? displayProject.role ?? "",
            client: textEdits.client ?? displayProject.client ?? "",
            duration: textEdits.duration ?? displayProject.duration ?? "",
            year: textEdits.year ?? String(displayProject.year ?? ""),
          }}
          onClose={() => setActivePanel(null)}
          onSave={handlePanelSave}
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
            highlightTitle: textEdits.highlightTitle ?? displayProject.highlight.title ?? "",
            highlightSubtitle: textEdits.highlightSubtitle ?? displayProject.highlight.subtitle ?? "",
            highlightDescription: textEdits.highlightDescription ?? displayProject.highlight.description ?? "",
          }}
          onClose={() => setActivePanel(null)}
          onSave={handlePanelSave}
        />
      )}

      {activePanel === "challenges" && (
        <EditPanel
          title="Challenges (one per line)"
          fields={[{ key: "challenges", label: "Challenges", type: "textarea" }]}
          initialValues={{ challenges: textEdits.challenges ?? displayProject.challenges.join("\n") }}
          onClose={() => setActivePanel(null)}
          onSave={handlePanelSave}
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
            takeawayTitle: textEdits.takeawayTitle ?? displayProject.takeaway.title ?? "",
            takeawaySubtitle: textEdits.takeawaySubtitle ?? displayProject.takeaway.subtitle ?? "",
            takeawayDescription: textEdits.takeawayDescription ?? displayProject.takeaway.description ?? "",
          }}
          onClose={() => setActivePanel(null)}
          onSave={handlePanelSave}
        />
      )}

      {activePanel === "future" && (
        <EditPanel
          title="Future Improvements (one per line)"
          fields={[{ key: "futureImprovements", label: "Future Improvements", type: "textarea" }]}
          initialValues={{ futureImprovements: textEdits.futureImprovements ?? displayProject.futureImprovements.join("\n") }}
          onClose={() => setActivePanel(null)}
          onSave={handlePanelSave}
        />
      )}

      {/* Feature add/edit — staged only, see handleFeatureSave/Delete */}
      {editingFeatureId !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 overflow-y-auto">
          <FeatureForm
            feature={editingFeatureId === "new" ? null : editingFeature}
            onSave={(values) =>
              handleFeatureSave(
                editingFeatureId === "new" ? `new-${crypto.randomUUID()}` : editingFeatureId,
                editingFeatureId === "new",
                values
              )
            }
            onDelete={
              editingFeatureId === "new" ? undefined : () => handleFeatureDelete(editingFeatureId)
            }
            onCancel={() => setEditingFeatureId(null)}
          />
        </div>
      )}
    </div>
    </ImagePreviewDisabled>
  );
}