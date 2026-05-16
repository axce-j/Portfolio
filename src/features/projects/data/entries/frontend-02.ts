// src/features/projects/data/entries/frontend-02.ts

import type { SingleProject } from "../singleProjectData";

// ─────────────────────────────────────────────
// IMAGE STRUCTURE
// public/projects/frontend-02/
// ├── hero.jpg
// ├── feature-1.jpg
// ├── feature-2.jpg
// ├── feature-3.jpg
// └── highlight.jpg
// ─────────────────────────────────────────────

const BASE = "/projects/frontend-02";

const frontend02: SingleProject = {
  // ───────────────────────────────────────────
  // REQUIRED UNIQUE ID
  // format:
  // frontend-01
  // frontend-02
  // backend-01
  // design-01
  // ───────────────────────────────────────────
  id: "frontend-02",

  // ───────────────────────────────────────────
  // HERO
  // ───────────────────────────────────────────
//   heroImage: `${BASE}/hero.jpg`,
heroImage: ``,

  heroImageAlt: "Trading dashboard homepage",

  // ───────────────────────────────────────────
  // INTRO SECTION
  // ───────────────────────────────────────────
  intro: {
    title: "Trading Risk Calculator",
    tagline: "A precision-focused forex risk management tool.",
    description:
      "A frontend-heavy trading utility designed for active forex traders. The focus was building a responsive and visually clear calculator capable of handling lot sizing, leverage calculations, and risk exposure instantly without sacrificing usability on mobile devices.",

    tags: [
      "React",
      "TypeScript",
      "Tailwind",
      "Financial UI",
    ],
  },

  // ───────────────────────────────────────────
  // FEATURE SECTIONS
  // ───────────────────────────────────────────
  features: [
    {
      id: "frontend-02-f1",

      title: "Real-Time Risk Engine",
      subtitle: "Fast calculations without friction",

      description:
        "Inputs update calculations instantly with debounced state handling and memoized computations to avoid unnecessary rerenders. The interface was designed to remain responsive even while processing multiple trading variables.",

      image: `${BASE}/feature-1.jpg`,
      imageAlt: "Risk calculation interface",
    },

    {
      id: "frontend-02-f2",

      title: "Mobile-Optimized Trading UI",
      subtitle: "Designed for traders on the move",

      description:
        "Special attention was given to mobile ergonomics — larger tap targets, simplified form grouping, and adaptive layouts ensure the calculator remains practical on smaller screens without losing information density.",

      image: `${BASE}/feature-2.jpg`,
      imageAlt: "Mobile trading interface",
    },

    {
      id: "frontend-02-f3",

      title: "State & Form Architecture",
      subtitle: "Predictable data flow",

      description:
        "The calculator uses isolated form state management with reusable hooks to keep calculations maintainable as new trading parameters are added. Edge cases like invalid leverage values and lot rounding were handled directly in the UI layer.",

      image: `${BASE}/feature-3.jpg`,
      imageAlt: "Form architecture and state flow",
    },
  ],

  // ───────────────────────────────────────────
  // HIGHLIGHT SECTION
  // ───────────────────────────────────────────
  highlight: {
    title: "Performance & UX",
    subtitle: "Built for speed and clarity",

    description:
      "The application was optimized for rapid interaction with lightweight rendering and minimal visual clutter. Smooth transitions and contextual feedback help users understand calculations without overwhelming the interface.",

    image: `${BASE}/highlight.jpg`,
    imageAlt: "Performance and analytics screenshot",
  },

  // ───────────────────────────────────────────
  // TAKEAWAY SECTION
  // ───────────────────────────────────────────
  takeaway: {
    title: "Takeaway",
    subtitle: "Frontend can solve real problems",

    description:
      "The project reinforced how strong frontend architecture is more than visuals — it directly affects trust, usability, and decision-making. Financial interfaces especially demand clarity, speed, and consistency at every interaction point.",
  },

  // ───────────────────────────────────────────
  // LINKS
  // ───────────────────────────────────────────
  links: {
    github: "https://github.com/axce-j",
    live: "https://example.com",
  },

  // ───────────────────────────────────────────
  // META
  // ───────────────────────────────────────────
  techStack: [
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Vite",
  ],

  year: 2025,

  role: "Frontend Developer",

  duration: "3 weeks",
};

export default frontend02;