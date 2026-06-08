/**
 * ═══════════════════════════════════════════════════════════════
 * HOME SECTION DATA
 * ═══════════════════════════════════════════════════════════════
 *
 * Both Featured Projects AND Work Experience are now derived
 * automatically from their respective single sources of truth.
 *
 * TO ADD A NEW PROJECT CATEGORY CARD:
 *   1. Create ./features/projects/data/entries/{category}-01.ts
 *   2. Done — card appears here automatically.
 *
 * TO ADD A NEW WORK EXPERIENCE CARD:
 *   1. Create ./features/career/data/entries/{type}-{order}-{slug}.ts
 *   2. Add a `homeCard` field to that entry
 *   3. Done — card appears here automatically.
 *
 * No manual edits to this file needed for either.
 */

import { projectCategories } from "@/features/projects/data/projectsData";
import { getWorkExperienceCards } from "@/features/career/data/careerData";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface ProjectEntry {
  title: string;
  subtitle: string;
  gradient: string;
  path: string;
}

export interface WorkEntry {
  role: string;
  company: string;
  period: string;
  duration: string;
  tags: string[];
  accentColor: string;
  path: string;
}

export interface SkillCategory {
  label: string;
  accent: string;
  skills: string[];
}

export interface ToolEntry {
  name: string;
  icon: string;
}

export interface CVEntry {
  name: string;
  title: string;
  lastUpdated: string;
  fileSize: string;
  downloadUrl: string;
}

export interface ExpertiseEntry {
  type: "skills" | "tools" | "cv";
  path: string;
  skillCategories?: SkillCategory[];
  tools?: ToolEntry[];
  cv?: CVEntry;
}

export type SectionType = "projects" | "work" | "expertise";

export interface FeaturedSection {
  title: string;
  type: SectionType;
  viewMorePath: string;
  items: ProjectEntry[] | WorkEntry[] | ExpertiseEntry[];
}

// ─────────────────────────────────────────────
// Projects — derived from entries/ prefix scan
// ─────────────────────────────────────────────

export const projectsFeaturedSections: FeaturedSection[] = [
  {
    title: "Featured Projects",
    type: "projects",
    viewMorePath: "/projects",
    items: projectCategories.map((cat) => ({
      title: cat.label,
      subtitle: cat.featuredSubtitle,
      gradient: cat.gradient,
      path: cat.sectionPath,
    })) as ProjectEntry[],
  },
];

// ─────────────────────────────────────────────
// Work Experience — derived from career entries
// ─────────────────────────────────────────────
//
// Source of truth: features/career/data/entries/*.ts
// Each entry with a `homeCard` field auto-appears here.
// Order is controlled by the entry's `order` field (filename order).
// Anchor path uses the entry's `id` for deep linking to the career page.

const workCards = getWorkExperienceCards();

export const experienceFeaturedSections: FeaturedSection[] = [
  {
    title: "Work Experience",
    type: "work",
    viewMorePath: "/career",
    items: workCards.map((entry) => ({
      role: entry.homeCard!.role,
      company: entry.homeCard!.company,
      period: entry.homeCard!.period,
      duration: entry.homeCard!.duration,
      tags: entry.homeCard!.tags,
      accentColor: entry.homeCard!.accentColor,
      path: `/career#${entry.id}`,
    })) as WorkEntry[],
  },
];

// ─────────────────────────────────────────────
// Skills & CV
// ─────────────────────────────────────────────

export const expertiseFeaturedSections: FeaturedSection[] = [
  {
    title: "Skills & CV",
    type: "expertise",
    viewMorePath: "/expertise",
    items: [
      {
        type: "skills",
        path: "/expertise#skills",
        skillCategories: [
          {
            label: "Design",
            accent: "#2dd4bf",
            skills: ["UI Design", "UX Research", "Prototyping", "Wireframing"],
          },
          {
            label: "Front-End",
            accent: "#fb923c",
            skills: ["React", "Next.js", "TypeScript", "Tailwind"],
          },
          {
            label: "Back-End",
            accent: "#818cf8",
            skills: ["Node.js", "REST APIs", "PostgreSQL"],
          },
        ],
      },
      {
        type: "tools",
        path: "/expertise#tools",
        tools: [
          { name: "Figma",    icon: "🎨" },
          { name: "React",    icon: "⚛️" },
          { name: "Vercel",   icon: "🔺" },
          { name: "GitHub",   icon: "🐙" },
          { name: "Docker",   icon: "🐳" },
          { name: "Postgres", icon: "🗄️" },
          { name: "Postman",  icon: "✉️" },
          { name: "Tailwind", icon: "🌊" },
          { name: "VS Code",  icon: "📦" },
        ],
      },
      {
        type: "cv",
        path: "/expertise#cv",
        cv: {
          name: "Ezeani Obinna Jachike",
          title: "Software Engineer & Product Builder",
          lastUpdated: "Jan 2025",
          fileSize: "420kb",
          downloadUrl: "/cv.pdf",
        },
      },
    ] as ExpertiseEntry[],
  },
];