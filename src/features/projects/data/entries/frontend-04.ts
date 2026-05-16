// src/features/projects/data/entries/frontend-04.ts

import type { SingleProject } from "../singleProjectData";

const BASE = "/projects/frontend-04";

const frontend04: SingleProject = {
  id: "frontend-04",

//   heroImage: `${BASE}/hero.jpg`,
heroImage: ``,

  heroImageAlt: "AI career platform",

  intro: {
    title: "Career Guidance Platform",
    tagline: "Frontend architecture for career discovery.",
    description:
      "A modern web interface designed around career exploration, assessments, and personalized recommendations.",

    tags: ["React", "TypeScript", "Vite", "EdTech"],
  },

  features: [
    {
      id: "frontend-04-f1",
      title: "Assessment Flow",
      subtitle: "Multi-step interaction system",
      description:
        "Question flows were optimized for engagement and minimal drop-off.",

      image: `${BASE}/feature-1.jpg`,
      imageAlt: "Assessment interface",
    },

    {
      id: "frontend-04-f2",
      title: "Animated UI Feedback",
      subtitle: "Subtle motion system",
      description:
        "Animations were used carefully to guide attention without slowing interactions.",

      image: `${BASE}/feature-2.jpg`,
      imageAlt: "Animated interactions",
    },

    {
      id: "frontend-04-f3",
      title: "Reusable UI Components",
      subtitle: "Scalable frontend structure",
      description:
        "Cards, buttons, and layouts were abstracted into reusable components.",

      image: `${BASE}/feature-3.jpg`,
      imageAlt: "Reusable UI system",
    },
  ],

  highlight: {
    title: "Frontend Scalability",
    subtitle: "Structured for growth",
    description:
      "The project architecture was designed to support future feature expansion cleanly.",

    image: `${BASE}/highlight.jpg`,
    imageAlt: "Frontend architecture",
  },

  takeaway: {
    title: "Takeaway",
    subtitle: "Structure saves time",
    description:
      "Well-organized frontend systems become dramatically easier to maintain as features grow.",

  },

  links: {
    github: "https://github.com/axce-j",
  },

  techStack: ["React", "Tailwind", "Framer Motion"],

  year: 2025,
  role: "Frontend Engineer",
  duration: "4 weeks",
};

export default frontend04;