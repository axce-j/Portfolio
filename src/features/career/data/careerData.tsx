/**
 * ═══════════════════════════════════════════════════════════════
 * CAREER DATA STRUCTURE
 * ═══════════════════════════════════════════════════════════════
 *
 * This file contains all career/education history data.
 *
 * ORGANIZATION:
 * - Chronological order (oldest → newest)
 * - Mixed types: education, work, freelance
 * - First entry should always be undergraduate education
 *
 * TYPES:
 * - education: Academic qualifications (undergrad, masters, certifications)
 * - work: Full-time employment
 * - freelance: Contract/independent work
 *
 * DISPLAY:
 * - Bottom-left circular timeline shows all careers
 * - Click a circle to view full details in main area
 * - Active career is highlighted with teal glow
 */

export type CareerType = "education" | "work" | "freelance";

export interface Career {
  // ── Identity ──
  id: string;
  type: CareerType;

  // ── Common fields ──
  title: string;           // "Computer Science" | "Senior Developer"
  organization: string;    // "MIT" | "Google"
  startDate: string;       // "Sep 2018"
  endDate: string;         // "May 2022" | "Present"
  duration: string;        // "4 years" | "2 years 3 months"
  location: string;

  // ── Education-specific ──
  degree?: string;         // "Bachelor of Science"
  cgpa?: string;          // "3.8/4.0"
  major?: string;         // "Computer Science"

  // ── Work-specific ──
  role?: string;          // Job title for work entries
  responsibilities?: string[];
  technologies?: string[];
  images?: string[];   
  gallery?:string[];   // for swiper gallery

  // ── Shared ──
  description: string;    // Main body text
  highlights?: string[];  // Achievements/key points
  icon?: string;         // emoji for the circle (fallback)
  image?: string;        // profile/logo image for the circle
  personalTake?: string; // Personal reflection/takeaway from this experience
}

// ─────────────────────────────────────────────
// CAREER ENTRIES
// Chronological order: oldest → newest
// ─────────────────────────────────────────────

export const careers: Career[] = [
  // 1. Undergraduate Education
  {
    id: "undergrad-mit",
    type: "education",
    title: "Bachelor of Science",
    organization: "Massachusetts Institute of Technology",
    degree: "Bachelor of Science",
    major: "Computer Science",
    startDate: "Sep 2018",
    endDate: "May 2022",
    duration: "4 years",
    location: "Cambridge, MA",
    cgpa: "3.8/4.0",
    icon: "🎓",
    image: "/images/careers/mit-logo.png", // Replace with your actual path
    description:
      "Pursued a rigorous Computer Science curriculum with a focus on algorithms, systems design, and artificial intelligence. This foundational experience shaped my problem-solving approach and ignited my passion for building scalable software solutions.",
    highlights: [
      "Dean's List all 8 semesters",
      "Published 2 research papers on distributed systems",
      "President of MIT Computer Science Club (2021-2022)",
      "Built capstone project: real-time collaborative code editor",
      "Received MIT Undergraduate Research Grant ($5,000)",
    ],
    personalTake: "This degree wasn't just about learning to code—it fundamentally shaped how I approach problems. MIT taught me to break down complex challenges into manageable pieces and to never stop questioning assumptions.",
  },

  // 2. Summer Internship
  {
    id: "intern-meta",
    type: "work",
    title: "Software Engineering Intern",
    organization: "Meta (Facebook)",
    role: "SWE Intern - Frontend",
    startDate: "Jun 2021",
    endDate: "Aug 2021",
    duration: "3 months",
    location: "Menlo Park, CA",
    icon: "💼",
    // image: "/images/careers/meta-logo.png",
    description:
      "Worked on the Messenger team building features for group chat experiences. Collaborated with designers and PMs to ship a new reactions UI used by millions of users.",
    responsibilities: [
      "Developed a new emoji reaction selector component in React",
      "Optimized rendering performance for large group chats (1000+ members)",
      "Wrote comprehensive unit and integration tests (Jest, React Testing Library)",
    ],
    technologies: ["React", "JavaScript", "GraphQL", "Jest", "Flow"],
    highlights: [
      "Feature shipped to 100% of Messenger users globally",
      "Reduced component re-render count by 60%",
      "Received return offer for full-time role",
    ],
    gallery: [
      "/images/careers/meta-office.jpg",
      "/images/careers/meta-team.jpg",
      "/images/careers/meta-hackathon.jpg",
    ],
    personalTake: "My first experience working at scale taught me that great code isn't just about functionality—it's about performance, maintainability, and user impact. Seeing my work reach millions was both humbling and motivating.",
  },

  // 3. First Full-Time Role
  {
    id: "fulltime-startup",
    type: "work",
    title: "Frontend Developer",
    organization: "TechFlow (YC S22)",
    role: "Frontend Developer",
    startDate: "Jun 2022",
    endDate: "Dec 2022",
    duration: "7 months",
    location: "San Francisco, CA",
    icon: "🚀",
    image: "/images/careers/techflow-logo.png",
    description:
      "Joined as the second frontend engineer at an early-stage fintech startup. Built the customer-facing web app from scratch and established frontend architecture patterns.",
    responsibilities: [
      "Architected and built the web dashboard for invoice management",
      "Integrated Stripe and Plaid APIs for payments and bank connections",
      "Implemented real-time notifications using WebSockets",
      "Established CI/CD pipeline and testing infrastructure",
    ],
    technologies: ["React", "TypeScript", "Tailwind CSS", "Next.js", "Prisma", "Vercel"],
    highlights: [
      "First frontend hire — set up entire stack and workflow",
      "Shipped MVP in 3 months that secured Series A funding",
      "Grew product from 0 to 500+ active users",
    ],
    gallery: [
      "/images/careers/techflow-desk.jpg",
      "/images/careers/techflow-mvp.jpg",
    ],
    personalTake: "Joining an early-stage startup taught me the value of ownership and velocity. Every decision mattered, and watching something go from zero to real users was incredibly rewarding. This experience made me confident in building products from scratch.",
  },

  // 4. Current Role
  {
    id: "senior-google",
    type: "work",
    title: "Senior Frontend Developer",
    organization: "Google",
    role: "Senior Frontend Developer",
    startDate: "Jan 2023",
    endDate: "Present",
    duration: "2 years 2 months",
    location: "Mountain View, CA",
    icon: "⚡",
    // image: "/images/careers/google-logo.png",
    description:
      "Leading frontend initiatives on the Gmail team. Responsible for the redesign of core UI components and mentoring junior engineers. Focus on performance optimization and accessibility improvements.",
    responsibilities: [
      "Led redesign of Gmail's compose window (used by 1B+ users)",
      "Mentor 3 junior frontend engineers through code reviews and pair programming",
      "Reduced initial load time by 40% through code splitting and lazy loading",
      "Established accessibility standards across team (WCAG AA compliance)",
    ],
    technologies: [
      "React",
      "TypeScript",
      "Closure Tools",
      "Figma",
      "A/B Testing",
      "Protocol Buffers",
    ],
    highlights: [
      "Shipped 15+ features to production reaching 1B+ users",
      "Won Google internal hackathon 2024 for AI-powered email categorization",
      "Promoted to Senior level in 14 months (avg is 24 months)",
      "Speaker at internal frontend guild meetings",
    ],
    gallery: [
      "/images/careers/google-campus.jpg",
      "/images/careers/google-compose.jpg",
      "/images/careers/google-team-meeting.jpg",
      "/images/careers/google-hackathon.jpg",
    ],
    personalTake: "Working at Google has pushed me to think at scale in ways I never imagined. Every line of code I write is seen by billions—that responsibility has made me a far more thoughtful engineer. Mentoring others has also taught me that impact isn't just about what you build, but who you help grow.",
  },

  // 5. Ongoing Freelance
  {
    id: "freelance-current",
    type: "freelance",
    title: "Independent Contractor",
    organization: "Self-Employed",
    role: "Full-Stack Developer & Designer",
    startDate: "Mar 2023",
    endDate: "Present",
    duration: "1 year 11 months",
    location: "Remote",
    icon: "💡",
    image: "/images/careers/freelance-avatar.png",
    description:
      "Building custom web applications and design systems for startups and small businesses. Focus on high-quality, performant solutions with clean aesthetics.",
    responsibilities: [
      "Built 8+ client websites and web apps from concept to deployment",
      "Designed and implemented design systems for 3 SaaS products",
      "Provided technical consulting on architecture and stack decisions",
    ],
    technologies: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Node.js",
      "PostgreSQL",
      "Vercel",
      "Figma",
    ],
    highlights: [
      "Maintained 5-star rating across all client projects",
      "Average project delivery 2 weeks ahead of schedule",
      "Generated $80k+ in revenue in first year",
    ],
    gallery: [
      "/images/careers/freelance-workspace.jpg",
      "/images/careers/freelance-client-site.jpg",
    ],
    personalTake: "Freelancing has been a masterclass in client management, time management, and business savvy. It's taught me to communicate clearly, set boundaries, and take full ownership of outcomes. The freedom and variety keep me creatively energized.",
  },
];

// ─────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────

/** Get a single career by ID */
export const getCareerById = (id: string): Career | undefined =>
  careers.find((c) => c.id === id);

/** Get all careers of a specific type */
export const getCareersByType = (type: CareerType): Career[] =>
  careers.filter((c) => c.type === type);