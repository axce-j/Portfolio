import type { CareerEntry } from "../careerData";
import tycoonLogo from "@/assets/career/work-03/tycoons-logo.png";

const entry: CareerEntry = {
  id: "work-03-tycoons",
  type: "work",
  order: 4,

  title: "Lead Front End Developer",
  organization: "Tycoons Technology Limited",
  role: "Lead Front End Developer — Contract",
  startDate: "Sep 2025",
  endDate: "Present",
  duration: "9 months+",
  location: "Lagos, Nigeria · Remote",

  icon: "⚡",
  image:`${tycoonLogo}`,

  description:
    "Working as a contract Lead Frontend Developer on Tradion, an AI-powered trading assistant. Contributing to the ongoing development of a production-focused MVP, translating complex UX requirements into clean, performant interfaces.",

  responsibilities: [
    "Designing and implementing user-facing features for a production MVP",
    "Translating UI/UX wireframes into responsive and functional interfaces",
    "Collaborating with backend developers to integrate APIs and product logic",
    "Ensuring cross-browser compatibility, performance optimization, and clean UI behavior",
    "Participating in code reviews, demos, and regular progress meetings",
    "Supporting iterative improvements to evolving functional requirements",
  ],

  technologies: ["React", "TypeScript", "Mobile Applications", "Debugging", "UI/UX"],

  highlights: [
    "Lead frontend engineer on an AI-powered trading product",
    "Working under confidentiality and IP agreements on a live product",
    "Bridging design and engineering in a remote cross-functional team",
  ],

  gallery: ["/images/careers/tycoons-logo.png"],

  personalTake:
    "Tradion pushed me into real product leadership. Being the lead means every architectural decision, every component pattern, every performance tradeoff is yours to own. It's sharpened my instincts for building things that are not just functional but maintainable at scale.",

  // ── Home card metadata ──────────────────────
  homeCard: {
    role: "Lead Front End Developer",
    company: "Tycoons Technology Ltd",
    period: "Sep 2025 — Present",
    duration: "9 months",
    tags: ["React", "TypeScript", "AI Product"],
    accentColor: "#2dd4bf",
  },
};

export default entry;