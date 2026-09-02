// ═══════════════════════════════════════════════════════════════
// scripts/adapters/githubAdapter.ts
//
// Pure function: one raw github_cache row in, one StandardProject out.
// No DB access, no side effects — convergeProjects.ts calls this and
// decides what to do with the result.
// ═══════════════════════════════════════════════════════════════

export type StandardProject = {
	sourceType: "github";
	sourceId: string;              // "owner/repo"
	title: string;                 // repo name, per your call — fix later if needed
	description: string | null;
	inferredCategory: string | null;
	tags: string[];
	inferredTechStack: string[];
	links: { repo: string; live: string | null };
  };
  
  // Raw shape of a row from github_cache.
  type GithubCacheRow = {
	repo: string;                  // "owner/repo"
	language: string | null;
	homepage: string | null;
	topics: string[];
	latest_release: string | null;
  };
  
  // Known tech keywords worth surfacing as tech_stack, matched against
  // topics. Deliberately narrow — GitHub topics are a mix of tech names
  // ("typescript", "nextjs") and descriptive tags ("internal-tool",
  // "monolithic") that are not tech stack. `language` is NOT used here:
  // it's dominant-by-byte-count and can be misleading (an HTML-heavy
  // static export from a TypeScript/Next.js app, for example).
  const KNOWN_TECH_TOPICS = new Set([
	"react", "nextjs", "vue", "angular", "svelte",
	"typescript", "javascript",
	"tailwindcss", "css", "sass",
	"nodejs", "nestjs", "express", "fastify",
	"redis", "postgres", "postgresql", "mongodb", "mysql", "sqlite",
	"socket-io", "websockets", "graphql", "rest-api",
	"docker", "kubernetes",
	"vite", "webpack",
	"python", "django", "flask",
  ]);
  
  // Category inference is intentionally shallow for now — see PRD §5.2.
  // Expected to get replaced with better per-source signals later.
  //
  // Matching is EXACT on whole topics, not substring. An earlier version
  // used substring matching and it broke silently: "design" matched
  // inside "responsive-design" (a topic on almost every repo), so the
  // generic design check fired before the explicit "frontend" topic ever
  // got checked — 5 of 8 real repos came back wrongly "design" as a
  // result. Lesson: substring matching only works if every keyword is
  // specific enough to never appear as a fragment of an unrelated topic.
  // "design" isn't specific enough; kept out for that reason — only
  // clearly-design-specific topics ("ui-ux", "figma", "graphic-design")
  // trigger it now.
  //
  // Known topic-naming variants are listed explicitly instead of relying
  // on substring luck (e.g. "frontend-development" is its own listed
  // keyword, not caught by a fuzzy match on "frontend").
  function topicsMatch(topics: string[], keywords: string[]): boolean {
	const lower = topics.map((t) => t.toLowerCase());
	return keywords.some((k) => lower.includes(k));
  }
  
  function inferCategory(topics: string[], language: string | null): string | null {
	// 1. Explicit, unambiguous topic — highest confidence, checked first.
	if (topicsMatch(topics, ["mobile"])) return "mobile";
	if (topicsMatch(topics, ["design", "ui-ux", "graphic-design", "product-design"])) return "design";
	if (topicsMatch(topics, ["full-stack", "fullstack"])) return "full-stack";
	if (topicsMatch(topics, ["backend"])) return "backend";
	if (topicsMatch(topics, ["frontend", "frontend-development"])) return "frontend";
  
	// 2. Framework/tool signals — weaker, only used if no explicit topic.
	if (topicsMatch(topics, ["react-native", "flutter"])) return "mobile";
	if (topicsMatch(topics, ["figma"])) return "design";
	if (topicsMatch(topics, ["nestjs", "express", "fastify"])) return "backend";
	if (topicsMatch(topics, ["react", "nextjs", "vue"])) return "frontend";
  
	// 3. Last resort — language is noisy (see Flowboard: HTML-dominant
	// despite being a TS/Next app), only used if nothing above matched.
	if (language && ["TypeScript", "JavaScript", "HTML", "CSS"].includes(language)) return "frontend";
  
	return null;
  }
  
  function inferTechStack(topics: string[]): string[] {
	return topics.filter((t) => KNOWN_TECH_TOPICS.has(t.toLowerCase()));
  }
  
  export function adaptGithubRepo(row: GithubCacheRow): StandardProject {
	return {
	  sourceType: "github",
	  sourceId: row.repo,
	  title: row.repo.split("/")[1], // repo name owns title, per current decision
	  description: null,             // github_cache has no description column — see PRD §5.1
	  inferredCategory: inferCategory(row.topics, row.language),
	  tags: row.topics,
	  inferredTechStack: inferTechStack(row.topics),
	  links: {
		repo: `https://github.com/${row.repo}`,
		live: row.homepage,
	  },
	};
  }