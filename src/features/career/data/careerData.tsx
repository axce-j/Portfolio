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
	// 1. Babcock University
	{
	  id: "undergrad-Babcock",
	  type: "education",
	  title: "Bachelor of Science",
	  organization: "Babcock University",
	  degree: "Bachelor of Science",
	  major: "Software Engineering",
	  startDate: "Sep 2022",
	  endDate: "Jul 2025",
	  duration: "3 years",
	  location: "Ogun State, Nigeria",
	  cgpa: "4.32/5.0",
	  icon: "🎓",
	  image: "/images/careers/babcock-logo.png",
	  description:
		"Completed a rigorous Software Engineering degree at Babcock University, graduating with Second Class Upper Division. The programme covered the full engineering lifecycle — from systems design and algorithms to security, AI, and mobile development.",
	  highlights: [
		"CGPA: 4.32/5.0 — Second Class Upper Division",
		"Strong performance in Network Security, HCI, and Software Quality Engineering",
		"Completed 6-credit Student Industrial Work Experience (SIWES) — Grade A",
		"Research Project (SENG490) completed with Grade A",
		"Coursework spanned AI, Database Admin, Reverse Engineering, and Open Source Systems",
	  ],
	  gallery: ["/images/careers/babcock-logo.png"],
	  personalTake:
		"Babcock gave me more than a degree — it gave me discipline and breadth. From discrete maths to malware analysis, every module pushed me to think like an engineer, not just a coder. My final year especially sharpened my understanding of how software systems live in the real world.",
	},
  
	// 2. SevenCommonFactor Internship
	{
	  id: "intern-sevens",
	  type: "work",
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
	   gallery: ["/images/careers/babcock-logo.png"],
	  personalTake:
		"This internship was where theory met reality. Sitting in a real engineering team, debugging real issues, and shipping real features changed how I see software. SevenCommonFactor gave me confidence that I could operate in a professional environment.",
	},
  
	// 3. AJC Limited
	{
	  id: "fulltime-AJC",
	  type: "work",
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
	   gallery: ["/images/careers/babcock-logo.png"],
	  personalTake:
		"This role taught me what it means to own a product completely. No handoffs, no safety net — just real business problems that need real engineering solutions. Building systems that people use daily to run their operations is a different kind of pressure, and a different kind of reward.",
	},
  
	// 4. Tycoons Technology
	{
	  id: "remote-TYC",
	  type: "work",
	  title: "Lead Front End Developer",
	  organization: "Tycoons Technology Limited",
	  role: "Lead Front End Developer — Contract",
	  startDate: "Sep 2025",
	  endDate: "Present",
	  duration: "9 months+",
	  location: "Lagos, Nigeria · Remote",
	  icon: "⚡",
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
	   gallery: ["/images/careers/babcock-logo.png"],
	  personalTake:
		"Tradion pushed me into real product leadership. Being the lead means every architectural decision, every component pattern, every performance tradeoff is yours to own. It's sharpened my instincts for building things that are not just functional but maintainable at scale.",
	},
  
	// Haco Technologies / Careerly Ecosystem
{
	id: "startup-haco",
	type: "work",
	title: "Co-Founder & Product Engineer",
	organization: "Haco Technologies",
	role: "Co-Founder, Fullstack Product Engineer",
	startDate: "2025",
	endDate: "Present",
	duration: "Active",
	location: "Hybrid",
	icon: "🚀",
  
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
	  "Working on Careerly for Kids has been one of the most meaningful experiences of my career. The product was built around a real problem I kept seeing — students struggling to understand their strengths early enough to make informed academic decisions. Being able to combine engineering, AI, and education into something that can genuinely influence a young person’s future is deeply fulfilling.",
  }
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