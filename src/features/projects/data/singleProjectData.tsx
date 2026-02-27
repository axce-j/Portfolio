/**
 * ═══════════════════════════════════════════════════════════════
 * SINGLE PROJECT DATA STRUCTURE
 * ═══════════════════════════════════════════════════════════════
 *
 * PAGE LAYOUT (top → bottom):
 * ┌─────────────────────────────────┐
 * │  HERO        — cover image      │
 * ├─────────────────────────────────┤
 * │  INTRO       — problem / who    │
 * ├─────────────────────────────────┤
 * │  FEATURE 1   ─┐                 │
 * │  FEATURE 2    │ same card ×N    │
 * │  FEATURE N   ─┘ scrollable      │
 * ├─────────────────────────────────┤
 * │  HIGHLIGHT   — mandatory card   │  image left, text right
 * ├─────────────────────────────────┤
 * │  TAKEAWAY    — reflection       │
 * └─────────────────────────────────┘
 */

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

/** One feature card — text left, image right. Always the same layout. */
export interface ProjectFeature {
    id: string;          // unique key for React map()
    title: string;
    subtitle?: string;
    description: string;
    image?: string;      // replace PLACEHOLDER with real path when ready
    imageAlt?: string;
  }
  
  /**
   * Mandatory highlight card shown once per project, after all features.
   * Rendered as: image left + text right inside a teal-tinted card.
   */
  export interface ProjectHighlight {
    title: string;
    subtitle?: string;
    description: string;
    image?: string;
    imageAlt?: string;
  }
  
  export interface SingleProject {
    // ── Identity — must match ProjectEntry.id ──
    id: string;
  
    // ── Hero ────────────────────────────────────
    heroImage: string;
    heroImageAlt: string;
  
    // ── Intro ───────────────────────────────────
    intro: {
      title: string;       // large heading
      tagline: string;     // one-line italic hook
      description: string; // 2-4 sentences: problem, audience, market
      tags: string[];      // pill filters
    };
  
    // ── Features (×N, all same card design) ─────
    features: ProjectFeature[];
  
    // ── Highlight (mandatory, 1 per project) ────
    highlight: ProjectHighlight;
  
    // ── Takeaway ────────────────────────────────
    takeaway: {
      title: string;
      subtitle?: string;
      description: string;
    };
  
    // ── Links ───────────────────────────────────
    links: {
      github?: string;
      live?: string;
      figma?: string;
      behance?: string;
      dribbble?: string;
      caseStudy?: string;
    };
  
    // ── Meta ────────────────────────────────────
    techStack: string[];
    year: number;
    client?: string;
    role?: string;
    duration?: string;
  }
  
  // ─────────────────────────────────────────────
  // PLACEHOLDER
  // ─────────────────────────────────────────────
  
  const PLACEHOLDER = "/images/placeholder.jpg";
  
  // ─────────────────────────────────────────────
  // DATA
  // ─────────────────────────────────────────────
  
  export const singleProjects: SingleProject[] = [
  
    // ── DESIGN ────────────────────────────────
  
    {
      id: "design-01",
      heroImage: PLACEHOLDER,
      heroImageAlt: "Logo Design project cover",
      intro: {
        title: "Logo Design",
        tagline: "Building brands that mean something.",
        description:
          "Brands live and die by their first impression. This project covers a collection of logo and brand identity work for clients across tech, hospitality, and retail — each demanding a unique visual voice. The goal was always the same: distil a company's entire personality into a single, memorable mark.",
        tags: ["Branding", "Identity", "Figma", "Illustrator"],
      },
      features: [
        {
          id: "design-01-f1",
          title: "Discovery & Brief",
          subtitle: "Starting with the right questions",
          description:
            "Every brand project starts with a structured discovery session — understanding the client's values, competitors, and the emotion they want their mark to evoke. A tight brief eliminates wasted iterations and gets to strong concepts faster.",
          image: PLACEHOLDER,
          imageAlt: "Discovery workshop notes",
        },
        {
          id: "design-01-f2",
          title: "Concept Exploration",
          subtitle: "From sketch to vector",
          description:
            "Multiple directions were explored for each client — from wordmarks to icon-based marks to combination logos. Each concept was stress-tested across light and dark backgrounds and at small sizes before being refined in Figma.",
          image: PLACEHOLDER,
          imageAlt: "Logo concept sketches and iterations",
        },
        {
          id: "design-01-f3",
          title: "Iteration & Feedback",
          subtitle: "Pressure-testing every direction",
          description:
            "Each shortlisted concept went through structured client review rounds. Feedback was captured in FigJam and converted directly into revision briefs — keeping the process collaborative without losing design direction.",
          image: PLACEHOLDER,
          imageAlt: "Feedback and revision rounds",
        },
        {
          id: "design-01-f4",
          title: "Final Delivery",
          subtitle: "Production-ready assets",
          description:
            "Final packages included SVG master files, PNG exports at multiple sizes, dark/light variants, and a brand usage guide — giving every client everything they need to apply their mark consistently from day one.",
          image: PLACEHOLDER,
          imageAlt: "Final logo delivery package",
        },
      ],
      highlight: {
        title: "Brand Guidelines",
        subtitle: "Making consistency repeatable",
        description:
          "Final deliverables included a brand guideline document covering primary and secondary colour palettes, type pairings, clear space rules, and do/don't usage examples — giving clients everything they need to apply the brand consistently across every touchpoint.",
        image: PLACEHOLDER,
        imageAlt: "Brand guideline document spread",
      },
      takeaway: {
        title: "Takeaway",
        subtitle: "What this taught me",
        description:
          "The most impactful logos are usually the simplest. Restraint is a skill. Learning to kill good ideas in favour of the right idea — and to defend that choice to a client — is as much a design skill as any technical ability in Figma or Illustrator.",
      },
      links: {
        behance: "https://behance.net",
        dribbble: "https://dribbble.com",
      },
      techStack: ["Figma", "Illustrator", "Photoshop"],
      year: 2024,
      client: "Various",
      role: "Brand Designer",
      duration: "Ongoing",
    },
  
    // ── FRONTEND ──────────────────────────────
  
    {
      id: "frontend-01",
      heroImage: PLACEHOLDER,
      heroImageAlt: "Portfolio website hero screenshot",
      intro: {
        title: "Portfolio Website",
        tagline: "The site you're looking at right now.",
        description:
          "A fully custom-built React portfolio designed from scratch — no templates, no component kits. The challenge was building something that felt as considered as the work it displays, with smooth interactions, a dark glassmorphism visual language, and performance that doesn't embarrass itself on Lighthouse.",
        tags: ["React", "TypeScript", "Tailwind", "Vite"],
      },
      features: [
        {
          id: "frontend-01-f1",
          title: "Glassmorphism UI System",
          subtitle: "Depth without noise",
          description:
            "The entire interface is built on a layered glass system — inset shadows, backdrop blur, and subtle border treatments that create depth without competing with the content. Every interactive element has a deliberate hover state.",
          image: PLACEHOLDER,
          imageAlt: "UI component system screenshot",
        },
        {
          id: "frontend-01-f2",
          title: "Horizontal Scroll Sections",
          subtitle: "A different kind of browse",
          description:
            "Project categories are browsed via horizontal scroll containers with hidden scrollbars — a pattern that lets content breathe without the page growing infinitely tall. Cross-browser scrollbar suppression was handled without a library.",
          image: PLACEHOLDER,
          imageAlt: "Horizontal scroll section in action",
        },
        {
          id: "frontend-01-f3",
          title: "Routing & Navigation",
          subtitle: "React Router with nested routes",
          description:
            "The sidebar, top bar, and right bar navigation uses React Router nested routes so layout chrome persists across page transitions. Active states, tooltips, and scroll-driven style changes all update without a reload.",
          image: PLACEHOLDER,
          imageAlt: "Navigation system diagram",
        },
      ],
      highlight: {
        title: "Performance & Deployment",
        subtitle: "Fast by default",
        description:
          "The site is deployed on Vercel with CI/CD via GitHub. Vite's build pipeline keeps bundle sizes minimal, and lazy-loaded routes ensure the initial load is snappy regardless of how much content is behind the navigation.",
        image: PLACEHOLDER,
        imageAlt: "Lighthouse performance score",
      },
      takeaway: {
        title: "Takeaway",
        subtitle: "Build the thing you want to show",
        description:
          "Building your own portfolio is the highest-stakes design project you'll ever ship — because you can't blame the client. Every decision is yours. The process forced hard choices about what actually matters in a UI and what's just decoration.",
      },
      links: {
        github: "https://github.com/axce-j",
        live: "https://yourportfolio.com",
      },
      techStack: ["React", "TypeScript", "Tailwind CSS", "Vite", "Vercel"],
      year: 2025,
      role: "Designer & Developer",
      duration: "2 weeks",
    },
  
    // ── BACKEND ───────────────────────────────
  
    {
      id: "backend-01",
      heroImage: PLACEHOLDER,
      heroImageAlt: "API architecture diagram",
      intro: {
        title: "API Development",
        tagline: "The invisible layer that makes products work.",
        description:
          "APIs are the backbone of every modern product. This covers the design and implementation of production-grade REST and GraphQL APIs — built for real traffic, real auth requirements, and real failure modes. Target users range from mobile client developers to third-party integrators.",
        tags: ["Node.js", "Express", "GraphQL", "PostgreSQL"],
      },
      features: [
        {
          id: "backend-01-f1",
          title: "Auth & Access Control",
          subtitle: "JWT + RBAC from scratch",
          description:
            "Authentication was implemented using short-lived JWTs paired with refresh token rotation — stored in httpOnly cookies to prevent XSS exposure. Role-based access control was enforced at the middleware layer, keeping business logic clean.",
          image: PLACEHOLDER,
          imageAlt: "Auth flow diagram",
        },
        {
          id: "backend-01-f2",
          title: "GraphQL Layer",
          subtitle: "Flexible queries, no overfetching",
          description:
            "A GraphQL API was layered over the existing REST endpoints using Apollo Server — giving frontend clients precise control over what data they fetch. Dataloader was used to solve the N+1 query problem and keep database round-trips minimal.",
          image: PLACEHOLDER,
          imageAlt: "GraphQL playground screenshot",
        },
        {
          id: "backend-01-f3",
          title: "Observability & Testing",
          subtitle: "You can't fix what you can't see",
          description:
            "Every endpoint is covered by integration tests using Jest and Supertest. Structured logging and error tracking were wired up so production issues surface fast and with enough context to debug without guessing.",
          image: PLACEHOLDER,
          imageAlt: "Test coverage report",
        },
      ],
      highlight: {
        title: "Deployment & Infrastructure",
        subtitle: "Production-ready from day one",
        description:
          "All services were containerised with Docker and deployed to AWS with auto-scaling. Health checks, rate limiting, and environment-based config management ensured the APIs were stable and secure in production from the first release.",
        image: PLACEHOLDER,
        imageAlt: "Docker and AWS deployment diagram",
      },
      takeaway: {
        title: "Takeaway",
        subtitle: "Boring infrastructure, exciting products",
        description:
          "The best APIs are the ones nobody notices. Reliability, predictable error shapes, and clear documentation matter far more than clever architecture. The hardest part isn't writing the code — it's writing it so the next developer isn't lost.",
      },
      links: {
        github: "https://github.com/axce-j",
      },
      techStack: ["Node.js", "Express", "GraphQL", "PostgreSQL", "Redis", "Docker"],
      year: 2024,
      role: "Back-End Developer",
      duration: "3 months",
    },
  ];
  
  // ─────────────────────────────────────────────
  // HELPER
  // ─────────────────────────────────────────────
  
  export const getSingleProjectById = (id: string): SingleProject | undefined =>
    singleProjects.find((p) => p.id === id);