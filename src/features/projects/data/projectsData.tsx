/**
 * ═══════════════════════════════════════════════════════════════
 * PROJECT DATA — grouping + category display metadata
 * ═══════════════════════════════════════════════════════════════
 *
 * Categories come from Neon's `projects.category` (real field, set by
 * inference or by hand — see convergeProjects.ts), NOT from parsing the
 * project id/slug. Real slugs (e.g. "web-forum") aren't category-
 * prefixed, unlike the old placeholder entries ("frontend-01").
 *
 * To control how a category displays (label, gradient, subtitle), add
 * it to CATEGORY_META below. Any category without an entry still works
 * — falls back to sensible defaults so nothing silently disappears.
 */

import {
	singleProjects,
	getAllCategories,
	type SingleProject,
  } from "./singleProjectData";
  
  export type { SingleProject };
  
  export type ProjectSection = {
	title: string;
	category: string;
	projects: Array<{
	  id: string;
	  type: string;
	  title: string;
	  subtitle: string;
	  cover?: string;
	  gradient: "teal" | "blue" | "yellow" | "mixed";
	}>;
  };
  
  type CategoryMeta = {
	label: string;
	gradient: "teal" | "blue" | "yellow" | "mixed";
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
	mobile: {
	  label: "Mobile Projects",
	  gradient: "teal",
	  featuredSubtitle: "Cross-platform iOS & Android apps",
	},
	"full-stack": {
	  label: "Full-Stack Projects",
	  gradient: "mixed",
	  featuredSubtitle: "End-to-end apps, front and back",
	},
  };
  
  /** Fallback for any category not listed in CATEGORY_META */
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
  
  /** All unique categories currently present in published projects */
  export const projectCategoryKeys: string[] = getAllCategories();
  
  export type ProjectCategory = CategoryMeta & {
	key: string;
	sectionPath: string;
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
   * Projects grouped by category — used by /projects index page.
   * Replaces the old projectData.ts, which hardcoded only
   * frontend/design/backend and silently dropped anything else
   * (e.g. a "full-stack" project would never have appeared there).
   */
  export const projectSections: ProjectSection[] = projectCategoryKeys.map(
	(key) => {
	  const meta = getMetaForCategory(key);
	  const entries = singleProjects.filter((p) => p.category === key);
  
	  return {
		title: meta.label,
		category: key,
		projects: entries.map((p) => ({
		  id: p.id,
		  type: key,
		  title: p.intro.title,
		  subtitle: p.intro.tagline ?? p.intro.description.slice(0, 80),
		  cover: p.heroImage || undefined,
		  gradient: meta.gradient,
		})),
	  };
	}
  );
  
  // ─────────────────────────────────────────────
  // Flat helpers
  // ─────────────────────────────────────────────
  
  export const allProjects = singleProjects;
  
  export const getSectionByCategory = (key: string): ProjectSection | undefined =>
	projectSections.find((s) => s.category === key);