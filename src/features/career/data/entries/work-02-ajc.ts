import type { CareerEntry } from "../careerData";

const entry: CareerEntry = {
  id: "work-02-ajc",
  type: "work",
  order: 3,

  title: "Senior Software Engineer",
  organization: "Auto Judeo Company Limited",
  role: "Senior Software Engineer — Freelance",
  startDate: "Aug 2025",
  endDate: "Present",
  duration: "10 months+",
  location: "Douala, Cameroon · Hybrid",

  icon: "🚀",

  description:
    "Working as a solutions and full-stack engineer, designing and building internal management systems to support operations across company branches and customers. Products span inventory, transaction tracking, and physical asset management.",

  responsibilities: [
    "Developing AJC Gallery — a management app for tracking stock, transactions, and branch-to-customer operations",
    "Building AJC Settlements — a platform for tracking and maintaining physical company assets",
    "Designing end-to-end application logic covering frontend, backend, and data flow",
    "Collaborating with internal teams to translate operational requirements into working software",
    "Supporting reliability through debugging, testing, and iterative improvements",
  ],

  technologies: ["API Development", "Transactional Systems", "Full-Stack", "Systems Design"],

  highlights: [
    "Sole engineer responsible for two internal platforms from the ground up",
    "AJC Gallery handles real branch-to-customer stock and transaction flow",
    "AJC Settlements manages physical asset records across the company",
  ],

  gallery: ["/images/careers/ajc-logo.png"],

  personalTake:
    "This role taught me what it means to own a product completely. No handoffs, no safety net — just real business problems that need real engineering solutions. Building systems that people use daily to run their operations is a different kind of pressure, and a different kind of reward.",

  // ── Home card metadata ──────────────────────
  homeCard: {
    role: "Senior Software Engineer",
    company: "Auto Judeo Company",
    period: "Aug 2025 — Present",
    duration: "10 months",
    tags: ["Full-Stack", "Systems", "Hybrid"],
    accentColor: "#fb923c",
  },
};

export default entry;