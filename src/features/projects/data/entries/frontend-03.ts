// src/features/projects/data/entries/frontend-03.ts

import type { SingleProject } from "../singleProjectData";

const BASE = "/projects/frontend-03";

const frontend03: SingleProject = {
  id: "frontend-03",

//   heroImage: `${BASE}/hero.jpg`,
heroImage: ``,

  heroImageAlt: "Analytics dashboard",

  intro: {
    title: "Analytics Dashboard",
    tagline: "Data-heavy UI without visual fatigue.",
    description:
      "A responsive analytics interface focused on balancing dense information with readability and interaction speed.",

    tags: ["React", "Charts", "Tailwind", "Dashboard"],
  },

  features: [
    {
      id: "frontend-03-f1",
      title: "Chart Rendering",
      subtitle: "Interactive data visualization",
      description:
        "Charts update dynamically with responsive layouts optimized for desktop and tablet devices.",

      image: `${BASE}/feature-1.jpg`,
      imageAlt: "Chart visualization",
    },

    {
      id: "frontend-03-f2",
      title: "Sidebar Navigation",
      subtitle: "Persistent workspace layout",
      description:
        "A collapsible sidebar structure keeps navigation accessible while maximizing workspace area.",

      image: `${BASE}/feature-2.jpg`,
      imageAlt: "Sidebar navigation",
    },

    {
      id: "frontend-03-f3",
      title: "Component Architecture",
      subtitle: "Reusable dashboard modules",
      description:
        "Widgets were structured into reusable blocks to simplify future scaling.",

      image: `${BASE}/feature-3.jpg`,
      imageAlt: "Dashboard components",
    },
  ],

  highlight: {
    title: "Responsiveness",
    subtitle: "Built for multiple screen sizes",
    description:
      "Layouts adapt fluidly between desktop and tablet breakpoints without compromising usability.",

    image: `${BASE}/highlight.jpg`,
    imageAlt: "Responsive dashboard",
  },

  takeaway: {
    title: "Takeaway",
    subtitle: "Data presentation matters",
    description:
      "Large amounts of information become manageable when hierarchy and spacing are carefully controlled.",

  },

  links: {
    github: "https://github.com/axce-j",
  },

  techStack: ["React", "TypeScript", "Tailwind"],

  year: 2025,
  role: "Frontend Developer",
  duration: "2 weeks",
};

export default frontend03;