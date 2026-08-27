import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Github, Globe, Figma, ExternalLink } from "lucide-react";
import {
  getSingleProjectById,
  type SingleProject,
  type ProjectFeature,
  type ProjectHighlight,
  type ProjectTakeaway,
  type ProjectMedia,
  type VideoRole,
} from "./data/singleProjectData";

// ─────────────────────────────────────────────
// Hero
// ─────────────────────────────────────────────

export const Hero = ({ project, onBack }: { project: SingleProject; onBack: () => void }) => (
  <section className="relative w-full mb-16">
    <button
      onClick={onBack}
      className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full
        bg-black/40 border border-white/10 text-white/70 hover:text-white hover:bg-black/60
        text-xs backdrop-blur-sm transition-all duration-200"
    >
      <ArrowLeft className="w-3 h-3" />
      Back
    </button>
    <div className="relative w-full aspect-[16/7] rounded-2xl overflow-hidden bg-white/5 border border-white/5">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-900/40 via-gray-900/60 to-blue-900/40" />
      {project.heroImage && (
        <img
          src={project.heroImage}
          alt={project.heroImageAlt ?? project.intro.title}
          className="relative z-10 w-full h-full object-cover"
        />
      )}
    </div>
  </section>
);

// ─────────────────────────────────────────────
// Intro
// ─────────────────────────────────────────────

export const Intro = ({ project }: { project: SingleProject }) => {
  const { intro, links, techStack, year, client, role, duration } = project;

  const linkItems = [
    { href: links.github,    icon: Github,       label: "GitHub"     },
    { href: links.live,      icon: Globe,        label: "Live"       },
    { href: links.figma,     icon: Figma,        label: "Figma"      },
    { href: links.behance,   icon: ExternalLink, label: "Behance"    },
    { href: links.dribbble,  icon: ExternalLink, label: "Dribbble"   },
    { href: links.caseStudy, icon: ExternalLink, label: "Case Study" },
  ].filter((l) => Boolean(l.href));

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 px-2">
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-teal-400 text-xs font-semibold tracking-widest uppercase mb-2">
            {role ?? "Project"}
          </p>
          <h1 className="text-5xl font-bold text-white leading-tight mb-3">
            {intro.title}
          </h1>
          {/* tagline has no GitHub fallback — only render if hand-written */}
          {intro.tagline && (
            <p className="text-white/50 text-lg italic">{intro.tagline}</p>
          )}
        </div>
        <p className="text-white/60 text-sm leading-relaxed">{intro.description}</p>
        <div className="flex flex-wrap gap-2">
          {intro.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-xs rounded-full bg-white/5 border border-white/10 text-white/60
                hover:bg-white/10 hover:text-white/80 transition-all cursor-default"
            >
              {tag}
            </span>
          ))}
        </div>
        {linkItems.length > 0 && (
          <div className="flex flex-wrap gap-3 pt-2">
            {linkItems.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href!}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium
                  bg-white/5 border border-white/10 text-white/60
                  hover:bg-white/10 hover:text-white hover:border-white/20
                  transition-all duration-200"
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Meta card */}
      <div className="flex flex-col gap-4 p-6 rounded-2xl self-start
        bg-white/[0.03] border border-white/5
        shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
      >
        <p className="text-xs font-semibold tracking-widest uppercase text-white/30">
          Project Details
        </p>
        {[
          { label: "Year",     value: String(year) },
          { label: "Role",     value: role         },
          { label: "Client",   value: client       },
          { label: "Duration", value: duration     },
        ]
          .filter((r) => Boolean(r.value))
          .map(({ label, value }) => (
            <div
              key={label}
              className="flex justify-between items-center border-b border-white/5 pb-3 last:border-0 last:pb-0"
            >
              <span className="text-xs text-white/30">{label}</span>
              <span className="text-xs text-white/70 font-medium">{value}</span>
            </div>
          ))}
        <div className="pt-2">
          <p className="text-xs text-white/30 mb-3">Tech Stack</p>
          <div className="flex flex-wrap gap-1.5">
            {techStack.map((t) => (
              <span
                key={t}
                className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────
// Connector — shown between feature cards
// ─────────────────────────────────────────────

export const Connector = () => (
  <div className="flex flex-col items-center py-3 select-none">
    <div className="w-px h-5 bg-white/10" />
    <div className="flex items-center justify-center w-7 h-7 rounded-full
      bg-white/[0.04] border border-white/10
      shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M6 2v8M3 7l3 3 3-3" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
    <div className="w-px h-5 bg-white/10" />
  </div>
);

// ─────────────────────────────────────────────
// Feature card — text left, image right
// ─────────────────────────────────────────────

export const Feature = ({ feature }: { feature: ProjectFeature }) => (
  <div
    className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center
      rounded-2xl p-10 border border-white/[0.07]
      bg-gradient-to-br from-slate-800/60 via-slate-900/80 to-indigo-950/60
      shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.4)]
      backdrop-blur-md"
  >
    <div className="flex flex-col justify-center gap-5">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-1.5">{feature.title}</h2>
        {feature.subtitle && (
          <p className="text-sm text-white/35 italic">{feature.subtitle}</p>
        )}
      </div>
      {feature.description && (
        <p className="text-sm text-white/60 leading-relaxed">{feature.description}</p>
      )}
    </div>

    <div className="rounded-xl overflow-hidden border border-white/[0.06] aspect-[4/3]
      bg-gradient-to-br from-slate-700/40 to-slate-900/60"
    >
      {feature.image ? (
        <img
          src={feature.image}
          alt={feature.imageAlt ?? feature.title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full" />
      )}
    </div>
  </div>
);

// ─────────────────────────────────────────────
// Highlight — OPTIONAL, only renders if you've written one
// ─────────────────────────────────────────────

export const Highlight = ({ highlight }: { highlight: ProjectHighlight }) => {
  const lines = (highlight.description ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  // Same rationale as Takeaway below — Architecture Highlights is
  // usually one paragraph per the template, but a bullet list is
  // allowed too, and forcing many bullets into one prose paragraph
  // reads badly.
  const isListLike = lines.length > 3;

  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center
        rounded-2xl p-10 mb-8 border border-teal-500/15
        bg-gradient-to-br from-teal-900/20 via-white/[0.02] to-cyan-900/10"
    >
      <div className="rounded-xl overflow-hidden bg-white/5 border border-white/5 aspect-[4/3]">
        {highlight.image ? (
          <img
            src={highlight.image}
            alt={highlight.imageAlt ?? highlight.title ?? ""}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-teal-900/30 to-cyan-900/10" />
        )}
      </div>

      <div className="flex flex-col justify-center gap-4">
        <div>
          <p className="text-teal-400 text-xs font-semibold tracking-widest uppercase mb-2">
            Highlight
          </p>
          {highlight.title && (
            <h2 className="text-2xl font-semibold text-white mb-1">{highlight.title}</h2>
          )}
          {highlight.subtitle && (
            <p className="text-sm text-white/40 italic">{highlight.subtitle}</p>
          )}
        </div>
        {isListLike ? (
          <ul className="flex flex-col gap-2.5">
            {lines.map((line, i) => (
              <li key={i} className="flex gap-3 items-baseline text-sm text-white/60 leading-relaxed">
                <span className="w-1 h-1 rounded-full bg-teal-500/50 shrink-0 translate-y-[-2px]" />
                {line}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-white/60 leading-relaxed whitespace-pre-line">
            {highlight.description}
          </p>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Challenges — OPTIONAL, list of bullets from README's ## Challenges.
// Amber accent: distinct from Highlight's teal (the "good" moment)
// and Future Improvements' violet (the "ahead" moment) — this one
// reads as friction encountered, so it gets the warm/caution tone.
// ─────────────────────────────────────────────

export const Challenges = ({ challenges }: { challenges: string[] }) => (
  <div
    className="rounded-2xl p-10 mb-8 border border-amber-500/15
      bg-gradient-to-br from-amber-950/20 via-white/[0.02] to-transparent"
  >
    <p className="text-amber-400 text-xs font-semibold tracking-widest uppercase mb-6">
      Challenges
    </p>
    <ul className="flex flex-col gap-4">
      {challenges.map((item, i) => (
        <li key={i} className="flex gap-4 items-baseline">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500/50 shrink-0 translate-y-[-2px]" />
          <span className="text-sm text-white/65 leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

// ─────────────────────────────────────────────
// Takeaway — OPTIONAL, only renders if you've written one
// ─────────────────────────────────────────────

export const Takeaway = ({ takeaway }: { takeaway: ProjectTakeaway }) => {
  const lines = (takeaway.description ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  // Heuristic: takeaway.description is "What I Learned" bullets +
  // "Looking Back" prose, joined by readmeAdapter.ts. When both
  // sections were actually written as bullet lists (rather than
  // Looking Back being flowing prose, as the template asks for), the
  // result is many short lines — that reads terribly forced into a
  // single centered "quote" paragraph, so render it as a real list
  // instead once it's past a handful of lines.
  const isListLike = lines.length > 3;

  return (
    <section className="text-center py-20 px-4 mb-8 border-t border-white/5">
      <p className="text-xs font-semibold tracking-widest uppercase text-teal-400 mb-4">
        Reflection
      </p>
      {takeaway.title && (
        <h2 className="text-3xl font-bold text-white mb-2">{takeaway.title}</h2>
      )}
      {takeaway.subtitle && (
        <p className="text-white/40 text-base italic mb-8">{takeaway.subtitle}</p>
      )}
      {isListLike ? (
        <ul className="max-w-xl mx-auto text-left flex flex-col gap-2.5">
          {lines.map((line, i) => (
            <li key={i} className="flex gap-3 items-baseline text-sm text-white/60 leading-relaxed">
              <span className="w-1 h-1 rounded-full bg-teal-500/50 shrink-0 translate-y-[-2px]" />
              {line}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-white/60 text-sm leading-relaxed max-w-2xl mx-auto whitespace-pre-line">
          {takeaway.description}
        </p>
      )}
    </section>
  );
};

// ─────────────────────────────────────────────
// Future Improvements — OPTIONAL, list of bullets from README's
// ## Future Improvements. Violet accent — forward-looking counterpart
// to Challenges' amber.
// ─────────────────────────────────────────────

export const FutureImprovements = ({ items }: { items: string[] }) => (
  <div
    className="rounded-2xl p-10 mb-16 border border-violet-500/15
      bg-gradient-to-br from-violet-950/20 via-white/[0.02] to-transparent"
  >
    <p className="text-violet-400 text-xs font-semibold tracking-widest uppercase mb-6">
      Future Improvements
    </p>
    <ul className="flex flex-col gap-4">
      {items.map((item, i) => (
        <li key={i} className="flex gap-4 items-baseline">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500/50 shrink-0 translate-y-[-2px]" />
          <span className="text-sm text-white/65 leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

// ─────────────────────────────────────────────
// Media Gallery — Images. Horizontal scroll, same card language as
// Feature (rounded-xl, border-white/[0.06]), lazy-loaded.
// ─────────────────────────────────────────────

export const MediaGalleryImages = ({ images }: { images: ProjectMedia[] }) => (
  <div className="mb-16">
    <p className="text-xs font-semibold tracking-widest uppercase text-white/25 mb-6 px-1">
      Gallery
    </p>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {images.map((img) => (
        <div
          key={img.id}
          className="aspect-[4/3] rounded-xl overflow-hidden
            border border-white/[0.06] bg-white/5"
        >
          <img
            src={img.url}
            alt={img.caption ?? ""}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  </div>
);

// ─────────────────────────────────────────────
// Media Gallery — Videos. Three fixed slots, only rendering the ones
// that have a video. Labels match README_TEMPLATE_INSTRUCTIONS.md's
// "## Demo Videos" labels exactly, so what you typed in the README is
// what shows up on the site.
// ─────────────────────────────────────────────

export const VIDEO_SLOT_LABEL: Record<VideoRole, string> = {
  client_demo: "Client Walkthrough",
  architecture: "Architecture & Decisions",
  reflection: "Developer Reflection",
};

export const MediaGalleryVideos = ({ videos }: { videos: ProjectMedia[] }) => {
  const bySlot: Partial<Record<VideoRole, ProjectMedia>> = {};
  for (const v of videos) {
    if (v.videoRole) bySlot[v.videoRole] = v;
  }
  const slots = (Object.keys(VIDEO_SLOT_LABEL) as VideoRole[]).filter((role) => bySlot[role]);
  if (slots.length === 0) return null;

  return (
    <div className="mb-16">
      <p className="text-xs font-semibold tracking-widest uppercase text-white/25 mb-6 px-1">
        Demo Videos
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {slots.map((role) => (
          <div key={role} className="flex flex-col gap-2">
            <div className="rounded-xl overflow-hidden border border-white/[0.06] bg-black aspect-video">
              <video
                src={bySlot[role]!.url}
                controls
                preload="metadata"
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-xs text-white/40 px-1">{VIDEO_SLOT_LABEL[role]}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────

export default function SingleProjectPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const project = id ? getSingleProjectById(id) : undefined;

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-white/40">
        <p className="text-5xl">🔍</p>
        <p className="text-lg">Project not found</p>
        <button
          onClick={() => navigate("/projects")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10
            text-sm text-white/60 hover:text-white hover:bg-white/10 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </button>
      </div>
    );
  }

  // highlight/takeaway are hand-authored, second-pass fields — a
  // freshly-discovered project won't have them yet. Render only if
  // at least a title exists, rather than showing an empty section.
  // Render if EITHER a hand-written title OR README-parsed description
  // exists — title alone used to be the only signal, back when these
  // sections were 100% hand-authored. Phase 2C's README parsing only
  // fills description (there's no README equivalent of a punchy
  // title), so gating on title alone was silently hiding real,
  // correctly-parsed content that just hadn't been given a title yet.
  const hasHighlight = Boolean(project.highlight.title || project.highlight.description);
  const hasTakeaway = Boolean(project.takeaway.title || project.takeaway.description);
  const hasChallenges = project.challenges.length > 0;
  const hasFutureImprovements = project.futureImprovements.length > 0;

  const images = project.media.filter((m) => m.type === "image");
  const videos = project.media.filter((m) => m.type === "video");

  return (
    <div className="min-h-screen text-white pb-32">
      <div className="max-w-6xl mx-auto px-8 pt-10">

        {/* 1. Hero */}
        <Hero project={project} onBack={() => navigate(-1)} />

        {/* 2. Intro + meta */}
        <Intro project={project} />

        {/* 3. Features — all same card, stacked in column with connectors */}
        {project.features.length > 0 && (
          <div className="flex flex-col mb-10">
            <p className="text-xs font-semibold tracking-widest uppercase text-white/25 mb-8 px-1">
              Features
            </p>
            {project.features.map((feature, index) => (
              <div key={feature.id}>
                <Feature feature={feature} />
                {index < project.features.length - 1 && <Connector />}
              </div>
            ))}
          </div>
        )}

        {/* 4. Highlight */}
        {hasHighlight && <Highlight highlight={project.highlight} />}

        {/* 5. Challenges */}
        {hasChallenges && <Challenges challenges={project.challenges} />}

        {/* 6. Takeaway */}
        {hasTakeaway && <Takeaway takeaway={project.takeaway} />}

        {/* 7. Future Improvements */}
        {hasFutureImprovements && <FutureImprovements items={project.futureImprovements} />}

        {/* 8. Media galleries */}
        {images.length > 0 && <MediaGalleryImages images={images} />}
        {videos.length > 0 && <MediaGalleryVideos videos={videos} />}

      </div>
    </div>
  );
}