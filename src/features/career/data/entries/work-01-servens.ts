import type { CareerEntry } from "../careerData";

const entry: CareerEntry = {
  id: "work-01-sevens",
  type: "work",
  order: 2,

  title: "Full Stack Engineer",
  organization: "SevenCommonFactor",
  role: "Full Stack Engineer — Internship",
  startDate: "Jan 2024",
  endDate: "Jun 2024",
  duration: "6 months",
  location: "Douala, Cameroon · On-site",

  icon: "💼",

  description:
    "Worked across frontend and backend development in a structured internship focused on real-world engineering practices. Built production features, participated in debugging sessions, and developed a strong foundation in how full-stack systems are designed and integrated.",

  responsibilities: [
    "Built frontend features using React.js, TypeScript, and Next.js",
    "Learned backend development with NestJS and how APIs integrate with frontend systems",
    "Gained exposure to architectural design and application structure",
    "Participated in debugging sessions across frontend and backend codebases",
    "Took part in hands-on meetings, demos, and presentations",
  ],

  technologies: ["React.js", "TypeScript", "Next.js", "NestJS"],

  highlights: [
    "First professional engineering environment — on-site, production-grade work",
    "Developed cross-stack understanding of how APIs and UIs connect",
    "Improved technical communication through demos and team presentations",
  ],

  gallery: ["/images/careers/sevens-logo.png"],

  personalTake:
    "This internship was where theory met reality. Sitting in a real engineering team, debugging real issues, and shipping real features changed how I see software. SevenCommonFactor gave me confidence that I could operate in a professional environment.",

  // ── Home card metadata ──────────────────────
  homeCard: {
    role: "Full Stack Engineer",
    company: "SevenCommonFactor",
    period: "Jan 2024 — Jun 2024",
    duration: "6 months",
    tags: ["React", "NestJS", "Internship"],
    accentColor: "#818cf8",
  },
};

export default entry;