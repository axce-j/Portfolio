// ─────────────────────────────────────────────
// Expertise Page Data
// ─────────────────────────────────────────────

export type SkillCategory = {
    label: string;
    color: string;
    items: string[];
  };
  
  export type ToolItem = {
    name: string;
    icon: string;
    category: "design" | "frontend" | "backend" | "devops" | "other";
  };
  
  export type CVInfo = {
    name: string;
    title: string;
    updatedDate: string;
    fileSize: string;
    downloadUrl: string;
    linkedInUrl: string;
    summary: string;
    experience: {
      role: string;
      org: string;
      period: string;
      location: string;
    }[];
    education: {
      degree: string;
      org: string;
      period: string;
    }[];
  };
  
  // ── Skills ──────────────────────────────────
  export const skillCategories: SkillCategory[] = [
    {
      label: "Design",
      color: "text-teal-400",
      items: [
        "UI Design",
        "UX Research",
        "Prototyping",
        "Wireframing",
        "Brand Identity",
        "Digital Illustration",
      ],
    },
    {
      label: "Front-End",
      color: "text-cyan-400",
      items: [
        "React",
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
        "Framer Motion",
        "HTML/CSS",
      ],
    },
    {
      label: "Back-End",
      color: "text-emerald-400",
      items: ["Node.js", "REST APIs", "PostgreSQL", "Express", "Prisma"],
    },
    {
      label: "Human Skills",
      color: "text-violet-400",
      items: [
        "Leadership",
        "Creative Thinking",
        "Communication",
        "Problem Solving",
        "Adaptability",
        "Team Collaboration",
      ],
    },
  ];
  
  // ── Tools ────────────────────────────────────
  export const tools: ToolItem[] = [
    // Design
    { name: "Figma",       icon: "🎨", category: "design"   },
    { name: "Adobe XD",    icon: "✏️",  category: "design"   },
    { name: "Illustrator", icon: "🖊️",  category: "design"   },
    { name: "Photoshop",   icon: "🖼️",  category: "design"   },
    { name: "Framer",      icon: "🔲", category: "design"   },
    { name: "Spline",      icon: "🌀", category: "design"   },
  
    // Frontend
    { name: "React",       icon: "⚛️",  category: "frontend" },
    { name: "Next.js",     icon: "▲",  category: "frontend" },
    { name: "TypeScript",  icon: "📘", category: "frontend" },
    { name: "Tailwind",    icon: "🌊", category: "frontend" },
    { name: "Framer M.",   icon: "🎞️",  category: "frontend" },
    { name: "Vite",        icon: "⚡", category: "frontend" },
    { name: "Redux",       icon: "🔄", category: "frontend" },
    { name: "React Query", icon: "🔗", category: "frontend" },
  
    // Backend
    { name: "Node.js",     icon: "🟢", category: "backend"  },
    { name: "Express",     icon: "🚂", category: "backend"  },
    { name: "PostgreSQL",  icon: "🐘", category: "backend"  },
    { name: "Prisma",      icon: "🔷", category: "backend"  },
    { name: "GraphQL",     icon: "🔺", category: "backend"  },
    { name: "Postman",     icon: "📮", category: "backend"  },
    { name: "Redis",       icon: "🔴", category: "backend"  },
  
    // DevOps
    { name: "GitHub",      icon: "🐙", category: "devops"   },
    { name: "Docker",      icon: "🐳", category: "devops"   },
    { name: "Vercel",      icon: "◆",  category: "devops"   },
    { name: "AWS",         icon: "☁️",  category: "devops"   },
    { name: "CI/CD",       icon: "♾️",  category: "devops"   },
    { name: "Linux",       icon: "🐧", category: "devops"   },
  
    // Other
    { name: "VS Code",     icon: "💻", category: "other"    },
    { name: "Notion",      icon: "📝", category: "other"    },
    { name: "Slack",       icon: "💬", category: "other"    },
  ];
  
  // ── CV ───────────────────────────────────────
  export const cvInfo: CVInfo = {
    name: "Ezeani Obinna Jachike",
    title: "Product Designer & Full-Stack Developer",
    updatedDate: "Jan 2025",
    fileSize: "420 KB",
    downloadUrl: "/cv/ezeani-obinna-jachike-cv.pdf",
    linkedInUrl: "https://www.linkedin.com/in/ezeani-obinna-jachike",
  
    summary:
      "Product Designer and Full-Stack Developer with 5+ years building high-performance digital products. Comfortable across the entire stack — from pixel-perfect UI to scalable backend systems.",
  
    experience: [
      {
        role: "Senior Frontend Developer",
        org: "Google",
        period: "Jan 2023 – Present",
        location: "Mountain View, CA",
      },
      {
        role: "Full-Stack Developer & Designer",
        org: "Self-Employed",
        period: "Mar 2023 – Present",
        location: "Remote",
      },
      {
        role: "Frontend Developer",
        org: "TechFlow (YC S22)",
        period: "Jun 2022 – Dec 2022",
        location: "San Francisco, CA",
      },
      {
        role: "Software Engineering Intern",
        org: "Meta",
        period: "Jun 2021 – Aug 2021",
        location: "Menlo Park, CA",
      },
    ],
  
    education: [
      {
        degree: "B.Sc. Computer Science",
        org: "Massachusetts Institute of Technology",
        period: "Sep 2018 – May 2022",
      },
    ],
  };