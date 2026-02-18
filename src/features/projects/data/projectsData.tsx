/**
 * ═══════════════════════════════════════════════════════════════
 * PROJECT DATA STRUCTURE
 * ═══════════════════════════════════════════════════════════════
 *
 * This file contains all project data for the portfolio.
 *
 * ORGANIZATION:
 * - Three main categories: Design, Frontend, Backend
 * - Each category has its own array of projects
 * - Projects are ordered by priority/importance (most important first)
 * - All arrays are exported as `projectSections` for easy consumption
 *
 * ID STRUCTURE:
 * - Format: `{category}-{number}`
 * - Examples: design-01, frontend-01, backend-01
 * - Numbers are zero-padded (01, 02, 03...)
 * - IDs are used for routing: /projects/{id}
 *
 * LEGACY TYPE FIELD:
 * - The `type` field (D1, F.E.P1, B.E.P1) is kept for backward compatibility
 * - It's used by ProjectCard's handleNavigation logic
 * - Will eventually be replaced by the new `id` field
 *
 * DATA COMPLETENESS:
 * - All fields are filled for future individual project pages
 * - Current list view only uses: id, type, title, subtitle, gradient, cover
 * - Detail pages will use: description, longDescription, techStack, urls, etc.
 *
 * ADDING NEW PROJECTS:
 * 1. Add entry to the appropriate category array (designProjects, frontendProjects, backendProjects)
 * 2. Assign next sequential ID (e.g., design-06, frontend-05)
 * 3. Fill all required fields (see ProjectEntry interface)
 * 4. Export will happen automatically via projectSections
 */

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type ProjectStatus = "live" | "wip" | "archived";
export type ProjectCategory = "design" | "frontend" | "backend";

export interface ProjectEntry {
  // ── Identity ──
  id: string;                  // format: {category}-{number} e.g. "design-01"
  type: string;                // legacy: D1, F.E.P1, B.E.P1 (kept for ProjectCard nav)
  category: ProjectCategory;

  // ── Card display (used now) ──
  title: string;
  subtitle: string;
  gradient: string;            // "teal" | "blue" | "yellow" | "mixed"
  cover?: string;              // thumbnail/cover image path

  // ── Detail page content (used later) ──
  description: string;         // short description (1–2 sentences)
  longDescription: string;     // full body text for individual page
  techStack: string[];         // e.g. ["React", "TypeScript", "Tailwind"]
  liveUrl?: string;
  githubUrl?: string;
  client?: string;
  year: number;
  status: ProjectStatus;
  gallery?: string[];          // array of image paths for detail page gallery
  highlights?: string[];       // bullet-point achievements / key details
}

export interface ProjectSection {
  title: string;
  category: ProjectCategory;
  viewMorePath: string;
  projects: ProjectEntry[];
}

// ─────────────────────────────────────────────
// DESIGN PROJECTS
// Ordered by priority/importance
// ─────────────────────────────────────────────

const designProjects: ProjectEntry[] = [
  {
    id: "design-01",
    type: "D1",
    category: "design",
    title: "Logo Design",
    subtitle: "Creative logos and branding",
    gradient: "blue",
    description: "A collection of logo and brand identity projects for clients across multiple industries.",
    longDescription:
      "From initial concept sketches to final deliverables, these brand identity projects cover logo design, color system definition, typography selection, and brand guideline documentation. Each project involved close collaboration with clients to capture their vision and translate it into a cohesive visual language.",
    techStack: ["Figma", "Illustrator", "Photoshop"],
    client: "Various",
    year: 2024,
    status: "live",
    highlights: [
      "Delivered 12+ brand identities across tech, hospitality, and retail sectors",
      "Created full brand guideline documents for 5 clients",
      "Reduced revision cycles by establishing clear brief templates",
    ],
  },
  {
    id: "design-02",
    type: "D2",
    category: "design",
    title: "UI Mockups",
    subtitle: "High-fidelity interface designs",
    gradient: "teal",
    description: "High-fidelity UI mockups and design systems built in Figma for web and mobile products.",
    longDescription:
      "These projects span SaaS dashboards, mobile onboarding flows, and e-commerce storefronts. Each mockup was built within a shared design system to ensure component consistency and developer handoff efficiency. Auto-layout and variables were used throughout to support responsive and themeable designs.",
    techStack: ["Figma", "FigJam", "Zeroheight"],
    year: 2024,
    status: "live",
    highlights: [
      "Built a component library with 200+ reusable Figma components",
      "Reduced developer handoff time by 40% using structured naming conventions",
      "Designed responsive variants for mobile, tablet, and desktop breakpoints",
    ],
  },
  {
    id: "design-03",
    type: "D3",
    category: "design",
    title: "Poster Design",
    subtitle: "Event and promotional posters",
    gradient: "yellow",
    description: "Event flyers and promotional poster series for concerts, exhibitions, and brand campaigns.",
    longDescription:
      "A series of print and digital poster designs created for live events, product launches, and cultural exhibitions. The work spans bold typographic compositions, photographic collages, and illustrated concepts — each adapting the visual language to the tone of the event it represents.",
    techStack: ["Photoshop", "Illustrator", "InDesign"],
    client: "Various",
    year: 2023,
    status: "live",
    highlights: [
      "Designed over 30 event posters across music, art, and corporate events",
      "Print-ready files prepared to industry standard (300dpi, CMYK, bleed included)",
    ],
  },
  {
    id: "design-04",
    type: "D4",
    category: "design",
    title: "Photography",
    subtitle: "Landscape & portrait photography",
    gradient: "mixed",
    description: "A curated portfolio of landscape and portrait photography shot across West Africa and Europe.",
    longDescription:
      "This collection represents personal and commissioned photography projects, including portrait sessions, urban landscape series, and event coverage. Post-processing was done in Lightroom and Photoshop, with a consistent color grading style developed across the body of work.",
    techStack: ["Lightroom", "Photoshop", "Capture One"],
    year: 2023,
    status: "live",
    highlights: [
      "Shot and edited 500+ photos across 15 commissioned projects",
      "Developed a consistent signature color grade used across all portrait work",
    ],
  },
  {
    id: "design-05",
    type: "D5",
    category: "design",
    title: "Digital Illustration",
    subtitle: "Custom digital artworks",
    gradient: "blue",
    description: "Custom digital illustrations created for editorial, branding, and personal projects.",
    longDescription:
      "A collection of digital illustrations including character designs, editorial art, and abstract compositions. Work spans both commercial commissions and personal explorations, using Procreate for sketch and concept phases and Illustrator for final vector outputs.",
    techStack: ["Procreate", "Illustrator", "Photoshop"],
    year: 2024,
    status: "live",
    highlights: [
      "Created illustration series for 3 published editorial pieces",
      "Developed a repeatable character design system for a client brand mascot",
    ],
  },
];

// ─────────────────────────────────────────────
// BACKEND PROJECTS
// Ordered by priority/importance
// ─────────────────────────────────────────────

const backendProjects: ProjectEntry[] = [
  {
    id: "backend-01",
    type: "B.E.P1",
    category: "backend",
    title: "API Development",
    subtitle: "RESTful and GraphQL APIs",
    gradient: "teal",
    description: "Production-grade REST and GraphQL APIs built with Node.js and deployed on cloud infrastructure.",
    longDescription:
      "Designed and implemented scalable API architectures for web and mobile clients. Projects include a multi-tenant SaaS API with role-based access control, a real-time notification service using WebSockets, and a GraphQL layer over an existing REST backend. All services include rate limiting, logging, and automated test suites.",
    techStack: ["Node.js", "Express", "GraphQL", "PostgreSQL", "Redis", "Docker"],
    githubUrl: "https://github.com",
    year: 2024,
    status: "live",
    highlights: [
      "Handled 10k+ daily requests in production with <100ms average response time",
      "Implemented JWT + refresh token auth with role-based access control",
      "95%+ test coverage across all API endpoints",
    ],
  },
  {
    id: "backend-02",
    type: "B.E.P2",
    category: "backend",
    title: "Database Design",
    subtitle: "Schema and optimization work",
    gradient: "yellow",
    description: "Relational database schema design, query optimization, and migration management for production systems.",
    longDescription:
      "These projects focus on the design and optimization of PostgreSQL and MySQL databases for high-traffic applications. Work included normalization and denormalization tradeoffs, index strategy planning, query profiling, and the implementation of automated migration pipelines using tools like Prisma and Flyway.",
    techStack: ["PostgreSQL", "MySQL", "Prisma", "Redis", "Flyway"],
    year: 2023,
    status: "live",
    highlights: [
      "Reduced average query execution time by 65% through targeted indexing",
      "Designed a schema supporting 1M+ records with no performance degradation",
      "Migrated a legacy MySQL database to PostgreSQL with zero downtime",
    ],
  },
  {
    id: "backend-03",
    type: "B.E.P3",
    category: "backend",
    title: "E-commerce Platform",
    subtitle: "Back-end for online stores",
    gradient: "blue",
    description: "Full back-end infrastructure for a multi-vendor e-commerce platform including payments and inventory.",
    longDescription:
      "Built the complete server-side of a multi-vendor marketplace: product catalog management, cart and checkout flows, Stripe payment integration, order fulfillment tracking, and a vendor dashboard API. The system supports concurrent sessions, inventory reservations, and webhook-driven order status updates.",
    techStack: ["Node.js", "PostgreSQL", "Stripe", "Redis", "Docker", "AWS S3"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    year: 2024,
    status: "live",
    highlights: [
      "Integrated Stripe Connect for multi-vendor payouts",
      "Built real-time inventory reservation to prevent overselling",
      "Deployed on AWS with auto-scaling and load balancing",
    ],
  },
  {
    id: "backend-04",
    type: "B.E.P4",
    category: "backend",
    title: "Authentication Systems",
    subtitle: "Secure login & user management",
    gradient: "mixed",
    description: "Secure authentication and user management systems with OAuth2, MFA, and session management.",
    longDescription:
      "Implemented authentication layers for multiple production applications, including a custom OAuth2 server, social login integrations (Google, GitHub), multi-factor authentication via TOTP and SMS, and a session management system with device tracking and revocation. Security audits were performed on all implementations.",
    techStack: ["Node.js", "Passport.js", "JWT", "Redis", "PostgreSQL", "Twilio"],
    year: 2023,
    status: "live",
    highlights: [
      "Built a custom OAuth2 authorization server from scratch",
      "Implemented TOTP-based 2FA with backup codes",
      "Zero security incidents across all deployed auth systems",
    ],
  },
];

// ─────────────────────────────────────────────
// FRONTEND PROJECTS
// Ordered by priority/importance
// ─────────────────────────────────────────────

const frontendProjects: ProjectEntry[] = [
  {
    id: "frontend-01",
    type: "F.E.P1",
    category: "frontend",
    title: "Portfolio Website",
    subtitle: "Personal showcase site",
    gradient: "teal",
    description: "This portfolio — a custom-built React application with smooth scroll interactions and dynamic content.",
    longDescription:
      "Designed and developed from scratch using React, TypeScript, and Tailwind CSS. Features include a horizontal scroll section system, a swiper-based image carousel, dark-first design with custom gradients, and a fully responsive layout. Deployed on Vercel with CI/CD via GitHub Actions.",
    techStack: ["React", "TypeScript", "Tailwind CSS", "Vite", "Vercel"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    year: 2025,
    status: "live",
    highlights: [
      "100 Lighthouse performance score on desktop",
      "Custom horizontal scroll with hide-scrollbar cross-browser support",
      "Built and deployed in under 2 weeks",
    ],
  },
  {
    id: "frontend-02",
    type: "F.E.P2",
    category: "frontend",
    title: "Dashboard UI",
    subtitle: "Interactive data dashboards",
    gradient: "blue",
    description: "Data-rich admin dashboards with charts, tables, and real-time updates built in React.",
    longDescription:
      "Built multiple interactive admin dashboards for SaaS products, featuring real-time data visualizations using Recharts, filterable and sortable data tables with TanStack Table, date range pickers, and role-based view restrictions. All dashboards were designed for both desktop and tablet use.",
    techStack: ["React", "TypeScript", "Recharts", "TanStack Table", "Tailwind CSS"],
    year: 2024,
    status: "live",
    highlights: [
      "Real-time chart updates via WebSocket subscription",
      "Virtualized tables handling 50k+ rows without performance issues",
      "Built reusable chart wrapper components used across 3 products",
    ],
  },
  {
    id: "frontend-03",
    type: "F.E.P3",
    category: "frontend",
    title: "Landing Pages",
    subtitle: "Marketing & product pages",
    gradient: "yellow",
    description: "High-converting marketing and product landing pages with smooth animations and fast load times.",
    longDescription:
      "Developed a series of landing pages for SaaS products, mobile apps, and events. Each page was built with a focus on performance (sub-2s load time), accessibility (WCAG AA compliant), and conversion — including A/B tested hero sections, animated feature showcases, and integrated CTA forms.",
    techStack: ["React", "Next.js", "Framer Motion", "Tailwind CSS", "Vercel"],
    liveUrl: "https://example.com",
    year: 2024,
    status: "live",
    highlights: [
      "Average 92+ PageSpeed score across all deployed pages",
      "A/B tested hero variants resulting in 18% conversion lift",
      "WCAG AA accessibility compliance on all pages",
    ],
  },
  {
    id: "frontend-04",
    type: "F.E.P4",
    category: "frontend",
    title: "Mobile UI Design",
    subtitle: "Cross-platform app interfaces",
    gradient: "mixed",
    description: "Cross-platform mobile interfaces built with React Native targeting iOS and Android.",
    longDescription:
      "Built mobile UI implementations for cross-platform applications using React Native and Expo. Projects include a fitness tracking app, a food delivery ordering flow, and a social media micro-app. Each project required platform-specific adjustments for navigation patterns, safe areas, and gesture handling.",
    techStack: ["React Native", "Expo", "TypeScript", "React Navigation", "NativeWind"],
    githubUrl: "https://github.com",
    year: 2024,
    status: "wip",
    highlights: [
      "Shipped to both App Store and Google Play",
      "Implemented gesture-based navigation with Reanimated 3",
      "Optimized list rendering for smooth 60fps scroll on low-end devices",
    ],
  },
];

// ─────────────────────────────────────────────
// EXPORTED SECTIONS
// Used by ProjectIndex and scroll components
// ─────────────────────────────────────────────

export const projectSections: ProjectSection[] = [
  {
    title: "Design Projects",
    category: "design",
    viewMorePath: "/projects/design",
    projects: designProjects,
  },
  {
    title: "Back-End Projects",
    category: "backend",
    viewMorePath: "/projects/backend",
    projects: backendProjects,
  },
  {
    title: "Front-End Projects",
    category: "frontend",
    viewMorePath: "/projects/frontend",
    projects: frontendProjects,
  },
];

// ─────────────────────────────────────────────
// HELPER FUNCTIONS
// For future individual project pages
// ─────────────────────────────────────────────

/** Flat list of all projects across every section */
export const allProjects: ProjectEntry[] = projectSections.flatMap((s) => s.projects);

/** Look up a single project by its ID (e.g., "design-01") */
export const getProjectById = (id: string): ProjectEntry | undefined =>
  allProjects.find((p) => p.id === id);

/** Look up a single project by its legacy type key (e.g., "D1", "F.E.P1") */
export const getProjectByType = (type: string): ProjectEntry | undefined =>
  allProjects.find((p) => p.type === type);

/** Get all projects in a specific category */
export const getProjectsByCategory = (category: ProjectCategory): ProjectEntry[] =>
  allProjects.filter((p) => p.category === category);