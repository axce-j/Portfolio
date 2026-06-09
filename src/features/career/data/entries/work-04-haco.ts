import type { CareerEntry } from "../careerData";
import hacoLogo from "@/assets/career/work-04/haco-logo.png";


const entry: CareerEntry = {
  id: "work-04-haco",
  type: "work",
  order: 5,

  title: "Co-Founder & Product Engineer",
  organization: "Haco Technologies",
  role: "Co-Founder, Fullstack Product Engineer",
  startDate: "2025",
  endDate: "Present",
  duration: "Active",
  location: "Hybrid",

  icon: "🚀",
  image:`${hacoLogo}`,

  description:
    "Co-founded Haco Technologies, a startup focused on building AI-powered education and career guidance products for young people. Contributed across product engineering, backend systems, user experience, and platform architecture, with primary ownership of the Careerly for Kids platform.",

  responsibilities: [
    "Led engineering and product development for Careerly for Kids",
    "Built backend infrastructure, authentication systems, APIs, and platform logic",
    "Designed and implemented student-focused user experiences and assessment flows",
    "Worked on AI-assisted career discovery features tailored for secondary school students",
    "Collaborated on product strategy, platform architecture, and technical decisions across the Careerly ecosystem",
    "Supported development and infrastructure decisions for the main CareerlyAI platform",
  ],

  technologies: [
    "React",
    "Next.js",
    "TypeScript",
    "NestJS",
    "PostgreSQL",
    "Authentication Systems",
    "AI Integrations",
    "Product Architecture",
    "Fullstack Development",
  ],

  highlights: [
    "Co-founded the company behind CareerlyAI and Careerly for Kids",
    "Played a major role in building and scaling Careerly for Kids from the ground up",
    "Helped create AI-powered tools guiding students through career and academic decisions",
    "Built systems serving students, parents, and schools across multiple user experiences",
  ],

  gallery: [
    "/images/careers/careerly-kids.png",
    "/images/careers/careerlyai.png",
  ],

  personalTake:
    "Working on Careerly for Kids has been one of the most meaningful experiences of my career. The product was built around a real problem I kept seeing — students struggling to understand their strengths early enough to make informed academic decisions. Being able to combine engineering, AI, and education into something that can genuinely influence a young person's future is deeply fulfilling.",

  // ── Home card metadata ──────────────────────
  homeCard: {
    role: "Co-Founder & Lead Engineer",
    company: "CareerlyAI",
    period: "2025 — Present",
    duration: "Active",
    tags: ["EdTech", "Applied AI", "Startup"],
    accentColor: "#34d399",
  },
};

export default entry;