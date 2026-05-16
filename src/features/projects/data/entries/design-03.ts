// src/features/projects/data/entries/design-03.ts

import type { SingleProject } from "../singleProjectData";

const BASE = "/projects/design-03";

const design03: SingleProject = {
  id: "design-03",

//   heroImage: `${BASE}/hero.jpg`,
heroImage: ``,

  heroImageAlt: "EdTech platform UI",

  intro: {
    title: "EdTech Platform Design",
    tagline: "Designed to make learning feel approachable.",
    description:
      "A learning platform concept focused on clean onboarding, progress tracking, and visual simplicity for younger users.",

    tags: ["Figma", "UX", "Education", "Dashboard Design"],
  },

  features: [
    {
      id: "design-03-f1",
      title: "Progress Tracking",
      subtitle: "Visual learning milestones",
      description:
        "Gamified progress components were created to encourage engagement without cluttering the interface.",

      image: `${BASE}/feature-1.jpg`,
      imageAlt: "Progress tracking UI",
    },

    {
      id: "design-03-f2",
      title: "Course Discovery",
      subtitle: "Navigation without confusion",
      description:
        "Course browsing focused on readability and structured categorization to reduce friction.",

      image: `${BASE}/feature-2.jpg`,
      imageAlt: "Course discovery page",
    },

    {
      id: "design-03-f3",
      title: "Accessibility Focus",
      subtitle: "Readable and scalable",
      description:
        "Contrast, spacing, and typography sizes were tested to improve accessibility across devices.",

      image: `${BASE}/feature-3.jpg`,
      imageAlt: "Accessible UI patterns",
    },
  ],

  highlight: {
    title: "Prototype Experience",
    subtitle: "Interactive learning flow",
    description:
      "A complete interactive prototype was created to simulate the onboarding and learning journey.",

    image: `${BASE}/highlight.jpg`,
    imageAlt: "Prototype walkthrough",
  },

  takeaway: {
    title: "Takeaway",
    subtitle: "Simple interfaces scale better",
    description:
      "Educational products become significantly stronger when navigation and interaction remain predictable.",

  },

  links: {
    figma: "https://figma.com",
  },

  techStack: ["Figma", "UX Research", "Wireframing"],

  year: 2025,
  role: "UI/UX Designer",
  duration: "10 days",
};

export default design03;