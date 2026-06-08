/**
 * ═══════════════════════════════════════════════════════════════
 * PROJECT DATA — SINGLE SOURCE OF TRUTH
 * ═══════════════════════════════════════════════════════════════
 *
 * Categories are derived automatically from entry file prefixes.
 * To add a new category:
 *   1. Create a new entry file: ./entries/{category}-01.ts
 *   2. That's it. The category card appears everywhere automatically.
 *
 * Category display metadata (label, gradient, subtitle) lives in
 * CATEGORY_META below. If a prefix has no entry there, it falls
 * back to sensible defaults — so new categories still render.
 */

import {
	singleProjects,
	getAllProjectTypes,
	type SingleProject,
  } from "./singleProjectData";
  
  // ─────────────────────────────────────────────
  // Re-export core types so consumers only need
  // to import from this file
  // ─────────────────────────────────────────────
  
  export type { SingleProject };
  
  export type ProjectSection = {
	title: string;
	/** e.g. "frontend" — matches the entry file prefix */
	category: string;
	projects: Array<{
	  id: string;
	  type: string;
	  title: string;
	  subtitle: string;
	  cover?: string;
	  gradient: string;
	}>;
  };
  
  // ─────────────────────────────────────────────
  // Category display metadata
  // ─────────────────────────────────────────────
  // Add an entry here when you add a new category
  // so you can control the label, gradient and
  // featured-card subtitle. Falls back to defaults
  // if the key is missing.
  // ─────────────────────────────────────────────
  
  type CategoryMeta = {
	/** Human-readable label used on cards and section headers */
	label: string;
	/** Tailwind gradient key used by ProjectCard */
	gradient: "teal" | "blue" | "yellow" | "mixed";
	/** Short subtitle shown on the home featured card */
	featuredSubtitle: string;
  };
  
  const CATEGORY_META: Record<string, CategoryMeta> = {
	design: {
	  label: "Design Projects",
	  gradient: "blue",
	  featuredSubtitle: "Discover my best design works",
	},
	frontend: {
	  label: "Front-End Projects",
	  gradient: "yellow",
	  featuredSubtitle: "View all great designs brought to life",
	},
	backend: {
	  label: "Back-End Projects",
	  gradient: "mixed",
	  featuredSubtitle: "Most secure and robust back-end solutions",
	},
	// ── Add new categories below ──────────────────
	// mobile: {
	//   label: "Mobile Projects",
	//   gradient: "teal",
	//   featuredSubtitle: "Cross-platform iOS & Android apps",
	// },
  };
  
  /** Fallback for any prefix not listed in CATEGORY_META */
  function getMetaForCategory(category: string): CategoryMeta {
	return (
	  CATEGORY_META[category] ?? {
		label: `${category.charAt(0).toUpperCase() + category.slice(1)} Projects`,
		gradient: "teal",
		featuredSubtitle: `Explore all ${category} projects`,
	  }
	);
  }
  
  // ─────────────────────────────────────────────
  // Derived data
  // ─────────────────────────────────────────────
  
  /**
   * All unique category prefixes found in ./entries/*.ts
   * e.g. ["design", "frontend", "backend"]
   * Adding a new entry file prefix auto-extends this list.
   */
  export const projectCategoryKeys: string[] = getAllProjectTypes();
  
  /**
   * Full category descriptors — one per unique prefix.
   * Used by the home page featured section and the projects
   * index page section headers.
   */
  export type ProjectCategory = CategoryMeta & {
	key: string;
	/** Anchor-friendly path to the section on /projects */
	sectionPath: string;
	/** Path to the full category listing (future /projects/frontend etc.) */
	viewMorePath: string;
  };
  
  export const projectCategories: ProjectCategory[] = projectCategoryKeys.map(
	(key) => ({
	  key,
	  ...getMetaForCategory(key),
	  sectionPath: `/projects#${key}projects`,
	  viewMorePath: `/projects/${key}`,
	})
  );
  
  /**
   * Projects grouped by category — used by the /projects index page
   * scroll sections. Shape matches what ProjectsScrollSection expects.
   */
  export const projectSections: ProjectSection[] = projectCategoryKeys.map(
	(key) => {
	  const meta = getMetaForCategory(key);
	  const entries = singleProjects.filter((p) =>
		p.id.toLowerCase().startsWith(key.toLowerCase())
	  );
  
	  return {
		title: meta.label,
		category: key,
		projects: entries.map((p) => ({
		  id: p.id,
		  type: key,
		  title: p.intro.title,
		  subtitle: p.intro.tagline,
		  cover: p.heroImage || undefined,
		  gradient: meta.gradient,
		})),
	  };
	}
  );
  
  // ─────────────────────────────────────────────
  // Flat helpers (convenience)
  // ─────────────────────────────────────────────
  
  /** Every project entry, flat */
  export const allProjects = singleProjects;
  
  /** Look up a section by category key */
  export const getSectionByCategory = (key: string): ProjectSection | undefined =>
	projectSections.find((s) => s.category === key);