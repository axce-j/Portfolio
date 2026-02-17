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
    accent: string; // e.g. "#2dd4bf"
    skills: string[];
  }
  
  export interface ToolEntry {
    name: string;
    icon: string; // emoji
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
    // skills block
    skillCategories?: SkillCategory[];
    // tools block
    tools?: ToolEntry[];
    // cv block
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
  // Projects
  // ─────────────────────────────────────────────
  
  export const projectsFeaturedSections: FeaturedSection[] = [
    {
      title: "Featured Projects",
      type: "projects",
      viewMorePath: "/projects",
      items: [
        {
          title: "Design Projects",
          subtitle: "Discover my best design works",
          gradient: "teal",
          path: "/projects#designprojects",
        },
        {
          title: "Front-End Projects",
          subtitle: "View all great designs brought to life",
          gradient: "yellow",
          path: "/projects#frontendprojects",
        },
        {
          title: "Back-End Projects",
          subtitle: "Most secure and robust back-end solutions",
          gradient: "mixed",
          path: "/projects#backendprojects",
        },
      ] as ProjectEntry[],
    },
  ];
  
  // ─────────────────────────────────────────────
  // Work Experience
  // ─────────────────────────────────────────────
  
  export const experienceFeaturedSections: FeaturedSection[] = [
    {
      title: "Work Experience",
      type: "work",
      viewMorePath: "/career",
      items: [
        {
          role: "Senior UI Designer",
          company: "Acme Studio",
          period: "Jan 2023 — Present",
          duration: "2 yrs",
          tags: ["Figma", "Design Systems", "UX"],
          accentColor: "#2dd4bf",
          path: "/career#acme-studio",
        },
        {
          role: "Front-End Developer",
          company: "Pixel Labs",
          period: "Jul 2021 — Dec 2022",
          duration: "1.5 yrs",
          tags: ["React", "Next.js", "TypeScript"],
          accentColor: "#fb923c",
          path: "/career#pixel-labs",
        },
        {
          role: "Product Designer",
          company: "Bright Ventures",
          period: "Jun 2020 — Jun 2021",
          duration: "1 yr",
          tags: ["Prototyping", "User Research"],
          accentColor: "#818cf8",
          path: "/career#bright-ventures",
        },
      ] as WorkEntry[],
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
            name: "Alex Johnson",
            title: "Senior UI/UX Designer & Developer",
            lastUpdated: "Jan 2025",
            fileSize: "420kb",
            downloadUrl: "/cv.pdf",
          },
        },
      ] as ExpertiseEntry[],
    },
  ];