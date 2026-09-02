/**
 * ═══════════════════════════════════════════════════════════════
 * SINGLE PROJECT DATA — reads from portfolio.generated.json
 * ═══════════════════════════════════════════════════════════════
 *
 * Source of truth is Neon, via the build pipeline:
 *   syncGithub.ts → convergeProjects.ts → buildPortfolio.ts
 *   → portfolio.generated.json (this file's only data source)
 *
 * Never hand-edit portfolio.generated.json — it's regenerated on
 * every build. To change a project's content, edit it in Neon
 * (or write hand-authored fields there) and rerun the pipeline.
 */

import portfolioData from "./portfolio.generated.json";

export interface ProjectFeature {
  id: string;
  title: string;
  subtitle: string | null;
  description: string;
  image: string | null;
  imageAlt: string | null;
}

export interface ProjectHighlight {
  title: string | null;
  subtitle: string | null;
  description: string | null;
  image: string | null;
  imageAlt?: string | null;
}

export interface ProjectTakeaway {
  title: string | null;
  subtitle: string | null;
  description: string | null;
}

export type VideoRole = "client_demo" | "architecture" | "reflection";

export interface ProjectMedia {
  id: string;
  type: "image" | "video";
  url: string;
  caption?: string | null;
  // Only meaningful when type === "video". Null for images, and for
  // videos uploaded before video_role existed — always guard before
  // using it to slot a video into a gallery position.
  videoRole?: VideoRole | null;
}

export interface SingleProject {
  id: string;          // slug, e.g. "web-forum" — not category-prefixed
  category: string;     // explicit field from Neon, e.g. "frontend", "full-stack"

  heroImage: string | null;
  heroImageAlt: string | null;

  intro: {
    title: string;
    tagline: string | null;      // hand-written only, no GitHub fallback
    description: string;         // your copy, else GitHub's — never both null on a published project
    tags: string[];
  };

  features: ProjectFeature[];
  media: ProjectMedia[];

  // Nullable — a freshly-discovered project has no highlight/takeaway
  // yet. UI must check before rendering (see SingleProjectPage).
  highlight: ProjectHighlight;
  takeaway: ProjectTakeaway;

  // README-derived lists (## Challenges / ## Future Improvements).
  // Empty array, not null, when absent — UI checks .length, same
  // pattern as `features`.
  challenges: string[];
  futureImprovements: string[];

  links: {
    github?: string | null;
    live?: string | null;
    figma?: string | null;
    behance?: string | null;
    dribbble?: string | null;
    caseStudy?: string | null;
  };

  techStack: string[];
  year: number;
  client?: string | null;
  role?: string | null;
  duration?: string | null;

  // GitHub stats, informational — not required by any component yet
  stars?: number | null;
  forks?: number | null;
  latestRelease?: string | null;
}

// ─────────────────────────────────────────────
// Data — cast once, from the generated JSON
// ─────────────────────────────────────────────
export const singleProjects: SingleProject[] = portfolioData as SingleProject[];

export const singleProjectsSorted = [...singleProjects].sort(
  (a, b) => b.year - a.year
);

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
export const getSingleProjectById = (id: string): SingleProject | undefined =>
  singleProjects.find((p) => p.id === id);

/** Every distinct category currently present, e.g. ["frontend", "full-stack"] */
export const getAllCategories = (): string[] => {
  const categories = singleProjects.map((p) => p.category);
  return [...new Set(categories)];
};

export const getProjectsByCategory = (category: string): SingleProject[] =>
  singleProjects.filter((p) => p.category === category);

export default singleProjects;