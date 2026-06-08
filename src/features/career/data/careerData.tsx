/**
 * ═══════════════════════════════════════════════════════════════
 * CAREER DATA — SINGLE SOURCE OF TRUTH
 * ═══════════════════════════════════════════════════════════════
 *
 * Mirrors the projects system exactly.
 *
 * FILE NAMING CONVENTION:
 *   {type}-{order}-{slug}.ts
 *
 *   type  → "edu" | "work" | "freelance"
 *           becomes CareerType after expansion
 *   order → two-digit number controlling chronological sort (01, 02 …)
 *   slug  → human-readable ID used for anchor links
 *
 * EXAMPLES:
 *   edu-01-babcock.ts
 *   work-01-sevens.ts
 *   work-02-ajc.ts
 *   work-03-tycoons.ts
 *   work-04-haco.ts
 *
 * TO ADD A NEW ENTRY:
 *   1. Create ./entries/{type}-{order}-{slug}.ts
 *   2. Export a CareerEntry as default
 *   3. That's it. It appears on the career page AND home section automatically.
 *
 * PREFIX → TYPE MAPPING:
 *   "edu"      → "education"
 *   "work"     → "work"
 *   "freelance"→ "freelance"
 */

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type CareerType = "education" | "work" | "freelance";

/**
 * Metadata for the home page work experience card.
 * Only needed on entries you want shown in the home section.
 * Education entries typically omit this.
 */
export interface CareerHomeCard {
  role: string;
  company: string;
  period: string;
  duration: string;
  tags: string[];
  accentColor: string;
}

export interface CareerEntry {
  // ── Identity ───────────────────────────────
  /** Must match the filename: {type}-{order}-{slug} */
  id: string;
  type: CareerType;
  /** Controls chronological order. Derived from filename but explicit here for safety. */
  order: number;

  // ── Common ─────────────────────────────────
  title: string;
  organization: string;
  startDate: string;
  endDate: string;
  duration: string;
  location: string;

  // ── Education-specific ─────────────────────
  degree?: string;
  cgpa?: string;
  major?: string;

  // ── Work-specific ──────────────────────────
  role?: string;
  responsibilities?: string[];
  technologies?: string[];

  // ── Shared ─────────────────────────────────
  description: string;
  highlights?: string[];
  icon?: string;
  image?: string;
  gallery?: string[];
  personalTake?: string;

  // ── Home section card ──────────────────────
  /**
   * When present, this entry appears in the home page
   * Work Experience horizontal scroll section.
   * Education entries can include this too if desired.
   */
  homeCard?: CareerHomeCard;
}

// ─────────────────────────────────────────────
// Auto Import — same engine as singleProjectData
// ─────────────────────────────────────────────

const modules = import.meta.glob("./entries/*.ts", {
  eager: true,
  import: "default",
}) as Record<string, CareerEntry>;

/**
 * All career entries, sorted chronologically by `order`.
 * This is the primary export consumed by the career page.
 */
export const careers: CareerEntry[] = Object.values(modules).sort(
  (a, b) => a.order - b.order
);

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

/** Look up a single career by its full id (e.g. "work-02-ajc") */
export const getCareerById = (id: string): CareerEntry | undefined =>
  careers.find((c) => c.id === id);

/** All careers of a specific type */
export const getCareersByType = (type: CareerType): CareerEntry[] =>
  careers.filter((c) => c.type === type);

/**
 * All entries that have homeCard metadata — used by home-section-data.tsx
 * to build the Work Experience horizontal scroll section automatically.
 * No manual sync needed.
 */
export const getWorkExperienceCards = (): CareerEntry[] =>
  careers.filter((c) => c.homeCard != null);

/**
 * Expand filename prefix to full CareerType.
 * Used internally; entries should set `type` explicitly.
 */
export const prefixToType = (prefix: string): CareerType => {
  const map: Record<string, CareerType> = {
    edu: "education",
    work: "work",
    freelance: "freelance",
  };
  return map[prefix] ?? "work";
};

export default careers;