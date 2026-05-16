 
// ─────────────────────────────────────────────
// Image paths — place files at:
//   public/projects/design-01/hero.jpg
//   public/projects/design-01/feature-1.jpg
//   public/projects/design-01/feature-2.jpg
//   public/projects/design-01/feature-3.jpg
//   public/projects/design-01/feature-4.jpg
//   public/projects/design-01/highlight.jpg
// ─────────────────────────────────────────────

import { SingleProject } from "../singleProjectData";

const BASE = "/projects/design-01";

const design01: SingleProject = {
  id: "design-01",

//   heroImage:    `${BASE}/hero.jpg`,
heroImage: ``,

  heroImageAlt: "Logo Design project cover",

  intro: {
    title:       "Logo Design",
    tagline:     "Building brands that mean something.",
    description:
      "Brands live and die by their first impression. This project covers a collection of logo and brand identity work for clients across tech, hospitality, and retail — each demanding a unique visual voice. The goal was always the same: distil a company's entire personality into a single, memorable mark.",
    tags: ["Branding", "Identity", "Figma", "Illustrator"],
  },

  features: [
    {
      id:          "design-01-f1",
      title:       "Discovery & Brief",
      subtitle:    "Starting with the right questions",
      description:
        "Every brand project starts with a structured discovery session — understanding the client's values, competitors, and the emotion they want their mark to evoke. A tight brief eliminates wasted iterations and gets to strong concepts faster.",
      image:       `${BASE}/feature-1.jpg`,
      imageAlt:    "Discovery workshop notes",
    },
    {
      id:          "design-01-f2",
      title:       "Concept Exploration",
      subtitle:    "From sketch to vector",
      description:
        "Multiple directions were explored for each client — from wordmarks to icon-based marks to combination logos. Each concept was stress-tested across light and dark backgrounds and at small sizes before being refined in Figma.",
      image:       `${BASE}/feature-2.jpg`,
      imageAlt:    "Logo concept sketches and iterations",
    },
    {
      id:          "design-01-f3",
      title:       "Iteration & Feedback",
      subtitle:    "Pressure-testing every direction",
      description:
        "Each shortlisted concept went through structured client review rounds. Feedback was captured in FigJam and converted directly into revision briefs — keeping the process collaborative without losing design direction.",
      image:       `${BASE}/feature-3.jpg`,
      imageAlt:    "Feedback and revision rounds",
    },
    {
      id:          "design-01-f4",
      title:       "Final Delivery",
      subtitle:    "Production-ready assets",
      description:
        "Final packages included SVG master files, PNG exports at multiple sizes, dark/light variants, and a brand usage guide — giving every client everything they need to apply their mark consistently from day one.",
      image:       `${BASE}/feature-4.jpg`,
      imageAlt:    "Final logo delivery package",
    },
  ],

  highlight: {
    title:       "Brand Guidelines",
    subtitle:    "Making consistency repeatable",
    description:
      "Final deliverables included a brand guideline document covering primary and secondary colour palettes, type pairings, clear space rules, and do/don't usage examples — giving clients everything they need to apply the brand consistently across every touchpoint.",
    image:       `${BASE}/highlight.jpg`,
    imageAlt:    "Brand guideline document spread",
  },

  takeaway: {
    title:       "Takeaway",
    subtitle:    "What this taught me",
    description:
      "The most impactful logos are usually the simplest. Restraint is a skill. Learning to kill good ideas in favour of the right idea — and to defend that choice to a client — is as much a design skill as any technical ability in Figma or Illustrator.",
  },

  links: {
    behance:  "https://behance.net",
    dribbble: "https://dribbble.com",
  },

  techStack: ["Figma", "Illustrator", "Photoshop"],
  year:      2024,
  client:    "Various",
  role:      "Brand Designer",
  duration:  "Ongoing",
};

export default design01;