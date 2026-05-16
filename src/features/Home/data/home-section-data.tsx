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
		  role: "Lead Front End Developer",
		  company: "Tycoons Technology Ltd",
		  period: "Sep 2025 — Present",
		  duration: "9 months",
		  tags: ["React", "TypeScript", "AI Product"],
		  accentColor: "#2dd4bf",
		  path: "/career#remote-TYC",
		},
		{
		  role: "Senior Software Engineer",
		  company: "Auto Judeo Company",
		  period: "Aug 2025 — Present",
		  duration: "10 months",
		  tags: ["Full-Stack", "Systems", "Hybrid"],
		  accentColor: "#fb923c",
		  path: "/career#fulltime-AJC",
		},
		{
		  role: "Full Stack Engineer",
		  company: "SevenCommonFactor",
		  period: "Jan 2024 — Jun 2024",
		  duration: "6 months",
		  tags: ["React", "NestJS", "Internship"],
		  accentColor: "#818cf8",
		  path: "/career#intern-sevens",
		},
		{
		  role: "Co-Founder & Lead Engineer",
		  company: "CareerlyAI",
		  period: "2025 — Present",
		  duration: "Active",
		  tags: ["EdTech", "Applied AI", "Startup"],
		  accentColor: "#34d399",
		  path: "/career#startup-CRL",
		},
		{
		  role: "B.Sc Software Engineering",
		  company: "Babcock University",
		  period: "Sep 2022 — Jul 2025",
		  duration: "3 yrs",
		  tags: ["CGPA 4.32", "2nd Class Upper"],
		  accentColor: "#f472b6",
		  path: "/career#undergrad-Babcock",
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