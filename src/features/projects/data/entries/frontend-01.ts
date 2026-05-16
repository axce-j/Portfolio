	import type { SingleProject } from "../singleProjectData";

	// ─────────────────────────────────────────────
	// Image paths — place files at:
	//   public/projects/frontend-01/hero.jpg
	//   public/projects/frontend-01/feature-1.jpg
	//   public/projects/frontend-01/feature-2.jpg
	//   public/projects/frontend-01/feature-3.jpg
	//   public/projects/frontend-01/highlight.jpg
	// ─────────────────────────────────────────────

	const BASE = "/projects/frontend-01";

	const frontend01: SingleProject = {
	id: "frontend-01",

	// heroImage:    `${BASE}/hero.jpg`,
	heroImage: ``,

	heroImageAlt: "Portfolio website hero screenshot",

	intro: {
		title:       "Portfolio Website",
		tagline:     "The site you're looking at right now.",
		description:
		"A fully custom-built React portfolio designed from scratch — no templates, no component kits. The challenge was building something that felt as considered as the work it displays, with smooth interactions, a dark glassmorphism visual language, and performance that doesn't embarrass itself on Lighthouse.",
		tags: ["React", "TypeScript", "Tailwind", "Vite"],
	},

	features: [
		{
		id:          "frontend-01-f1",
		title:       "Glassmorphism UI System",
		subtitle:    "Depth without noise",
		description:
			"The entire interface is built on a layered glass system — inset shadows, backdrop blur, and subtle border treatments that create depth without competing with the content. Every interactive element has a deliberate hover state.",
		image:       `${BASE}/feature-1.jpg`,
		imageAlt:    "UI component system screenshot",
		},
		{
		id:          "frontend-01-f2",
		title:       "Horizontal Scroll Sections",
		subtitle:    "A different kind of browse",
		description:
			"Project categories are browsed via horizontal scroll containers with hidden scrollbars — a pattern that lets content breathe without the page growing infinitely tall. Cross-browser scrollbar suppression was handled without a library.",
		image:       `${BASE}/feature-2.jpg`,
		imageAlt:    "Horizontal scroll section in action",
		},
		{
		id:          "frontend-01-f3",
		title:       "Routing & Navigation",
		subtitle:    "React Router with nested routes",
		description:
			"The sidebar, top bar, and right bar navigation uses React Router nested routes so layout chrome persists across page transitions. Active states, tooltips, and scroll-driven style changes all update without a reload.",
		image:       `${BASE}/feature-3.jpg`,
		imageAlt:    "Navigation system diagram",
		},
	],

	highlight: {
		title:       "Performance & Deployment",
		subtitle:    "Fast by default",
		description:
		"The site is deployed on Vercel with CI/CD via GitHub. Vite's build pipeline keeps bundle sizes minimal, and lazy-loaded routes ensure the initial load is snappy regardless of how much content is behind the navigation.",
		image:       `${BASE}/highlight.jpg`,
		imageAlt:    "Lighthouse performance score",
	},

	takeaway: {
		title:       "Takeaway",
		subtitle:    "Build the thing you want to show",
		description:
		"Building your own portfolio is the highest-stakes design project you'll ever ship — because you can't blame the client. Every decision is yours. The process forced hard choices about what actually matters in a UI and what's just decoration.",
	},

	links: {
		github: "https://github.com/axce-j",
		live:   "https://yourportfolio.com",
	},

	techStack: ["React", "TypeScript", "Tailwind CSS", "Vite", "Vercel"],
	year:      2025,
	role:      "Designer & Developer",
	duration:  "2 weeks",
	};

	export default frontend01;