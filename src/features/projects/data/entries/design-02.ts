// src/features/projects/data/entries/design-02.ts

import type { SingleProject } from "../singleProjectData";

const BASE = "/projects/design-02";

const design02: SingleProject = {
  id: "design-02",

//   heroImage: `${BASE}/hero.jpg`,
heroImage: ``,

  heroImageAlt: "Mobile banking app UI",

  intro: {
    title: "Fintech Mobile App Design",
    tagline: "Minimal banking experience focused on clarity.",
    description:
      "A mobile-first fintech interface designed to simplify digital banking interactions through clear information hierarchy, modular card systems, and distraction-free flows.",

    tags: ["Figma", "UI/UX", "Design System", "Mobile Design"],
  },

  features: [
    {
      id: "design-02-f1",
      title: "Modular Card System",
      subtitle: "Reusable interface patterns",
      description:
        "Every dashboard component was designed around a reusable card system that scales across balances, analytics, transactions, and quick actions.",

      image: `${BASE}/feature-1.jpg`,
      imageAlt: "Dashboard card system",
    },

    {
      id: "design-02-f2",
      title: "Transaction UX",
      subtitle: "Readable financial data",
      description:
        "Typography and spacing were optimized to make transaction history easier to scan while keeping critical account actions accessible.",

      image: `${BASE}/feature-2.jpg`,
      imageAlt: "Transaction history design",
    },

    {
      id: "design-02-f3",
      title: "Dark Theme Design",
      subtitle: "Low-noise visual language",
      description:
        "The interface uses restrained gradients and layered surfaces to create depth without overwhelming the content.",

      image: `${BASE}/feature-3.jpg`,
      imageAlt: "Dark mode UI system",
    },
  ],

  highlight: {
    title: "Design System",
    subtitle: "Consistency at scale",
    description:
      "Color tokens, spacing rules, and reusable components were documented to keep future expansion consistent.",

    image: `${BASE}/highlight.jpg`,
    imageAlt: "Design system documentation",
  },

  takeaway: {
    title: "Takeaway",
    subtitle: "Financial products need trust",
    description:
      "Designing financial tools reinforced the importance of clarity, consistency, and reducing cognitive overload.",

  },

  links: {
    figma: "https://figma.com",
  },

  techStack: ["Figma", "UI Design", "Prototype Design"],

  year: 2025,
  role: "Product Designer",
  duration: "2 weeks",
};

export default design02;