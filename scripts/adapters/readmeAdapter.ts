// ═══════════════════════════════════════════════════════════════
// scripts/adapters/readmeAdapter.ts
//
// Pure function: raw README markdown string in, ParsedReadme out.
// No DB access, no side effects — convergeProjects.ts calls this and
// decides what to do with the result (same relationship it has with
// githubAdapter.ts).
//
// Parsing approach: split on top-level `## ` headings, match section
// names EXACTLY against the fixed vocabulary in
// README_TEMPLATE_INSTRUCTIONS.md. No fuzzy matching — a misspelled
// or missing heading is treated as absent (recorded in
// missingHeadings), not guessed at. This mirrors the exact-match
// philosophy in githubAdapter.ts's topicsMatch (see that file's
// comment on why substring matching broke silently there).
// ═══════════════════════════════════════════════════════════════

export type ParsedFeature = {
	title: string;
	subtitle: string | null;
	description: string;
  };
  
  export type ParsedReadme = {
	features: ParsedFeature[]; // from ## Features — see parseFeaturesSection below
	techStack: string[]; // from ## Technologies Used (flat or grouped under ### sub-headings)
	highlight: string | null; // from ## Architecture Highlights (exact match only)
	challenges: string | null; // from ## Challenges
	takeaway: string | null; // ## What I Learned + ## Looking Back, combined
	futureImprovements: string | null; // from ## Future Improvements
	videos: {
	  clientDemo: string | null;
	  architecture: string | null;
	  reflection: string | null;
	};
	missingHeadings: string[]; // for the build-log warning
  };
  
  // The exact top-level heading text (without "## ") this adapter looks
  // for. Anything else is ignored, not fuzzy-matched — see file header.
  const HEADING = {
	demoVideos: "Demo Videos",
	features: "Features",
	technologiesUsed: "Technologies Used",
	architectureHighlights: "Architecture Highlights",
	challenges: "Challenges",
	whatILearned: "What I Learned",
	lookingBack: "Looking Back",
	futureImprovements: "Future Improvements",
  } as const;
  
  // The three fixed video labels from README_TEMPLATE_INSTRUCTIONS.md's
  // "## Demo Videos" section. Exact match, same philosophy as headings.
  const VIDEO_LABEL = {
	"Client Walkthrough": "clientDemo",
	"Architecture & Decisions": "architecture",
	"Developer Reflection": "reflection",
  } as const;
  
  // Sections whose absence is worth warning about in the build log, per
  // README_TEMPLATE_INSTRUCTIONS.md's "What happens if a repo doesn't
  // follow this format" list. `Live Demo`, `Screenshots`, and `Author`
  // are intentionally excluded — none of them are parsed, so a missing
  // one isn't a pipeline concern.
  const WARNED_HEADINGS: string[] = [
	HEADING.features,
	HEADING.technologiesUsed,
	HEADING.architectureHighlights,
	HEADING.challenges,
	HEADING.whatILearned,
	HEADING.lookingBack,
	HEADING.futureImprovements,
  ];
  
  // Same three labels as VIDEO_LABEL's keys — kept as a separate list
  // so the "no README at all" fallback below can report them too,
  // instead of only checking them when a README exists.
  const WARNED_VIDEO_LABELS: string[] = [
	"Demo Videos: Client Walkthrough",
	"Demo Videos: Architecture & Decisions",
	"Demo Videos: Developer Reflection",
  ];
  
  // Splits raw markdown into a map of top-level "## Heading" name →
  // its raw body (everything up to the next top-level "## " heading,
  // or "# " title). Sub-headings ("### ...") stay inside the body —
  // callers that care about bullets just scan every line regardless of
  // sub-heading, per README_TEMPLATE_INSTRUCTIONS.md's "flat, or
  // grouped under ### sub-headings — both parse fine" note.
  function splitSections(markdown: string): Map<string, string[]> {
	const lines = markdown.split(/\r?\n/);
	const sections = new Map<string, string[]>();
  
	let currentHeading: string | null = null;
	let currentBody: string[] = [];
  
	const flush = () => {
	  if (currentHeading !== null) {
		sections.set(currentHeading, currentBody);
	  }
	};
  
	for (const line of lines) {
	  const topLevelMatch = /^##\s+(.+?)\s*$/.exec(line);
	  if (topLevelMatch) {
		flush();
		currentHeading = topLevelMatch[1];
		currentBody = [];
		continue;
	  }
	  if (currentHeading !== null) {
		currentBody.push(line);
	  }
	}
	flush();
  
	return sections;
  }
  
  // Extracts markdown bullet lines ("- " or "* ", any leading
  // whitespace) from a section body, stripped of the bullet marker.
  // Non-bullet lines (prose, blank lines, ### sub-headings) are skipped
  // — sub-headings act as free grouping only, never captured themselves.
  function extractBullets(body: string[]): string[] {
	const bulletPattern = /^\s*[-*]\s+(.+?)\s*$/;
	const bullets: string[] = [];
	for (const line of body) {
	  const match = bulletPattern.exec(line);
	  if (match) bullets.push(match[1]);
	}
	return bullets;
  }
  
  // Parses ## Features into structured {title, subtitle, description}
  // entries. Two supported formats:
  //
  // 1. Structured (preferred) — one "### Feature Title" sub-heading per
  //    feature, optionally followed by a single italic line for the
  //    subtitle (*like this*), then a prose paragraph for the
  //    description:
  //
  //      ### Real-Time Risk Engine
  //      *Fast calculations without friction*
  //
  //      Inputs update calculations instantly with debounced state...
  //
  // 2. Flat bullets (legacy) — a plain "- Feature name" list, no ###
  //    sub-headings. Kept working for backward compatibility with
  //    READMEs written before this format existed — each bullet
  //    becomes a title-only feature (subtitle null, description "").
  //
  // Which format is used is auto-detected per repo: if any "### "
  // sub-heading appears in the Features body, the structured parser
  // runs; otherwise it falls back to flat bullets. No README needs to
  // be rewritten immediately just because this format now exists.
  function parseFeaturesSection(body: string[]): ParsedFeature[] {
	const hasSubHeadings = body.some((line) => /^\s*###\s+/.test(line));
	if (!hasSubHeadings) {
	  return extractBullets(body).map((title) => ({
		title,
		subtitle: null,
		description: "",
	  }));
	}
  
	const features: ParsedFeature[] = [];
	const subHeadingPattern = /^\s*###\s+(.+?)\s*$/;
	const italicLinePattern = /^\*(.+?)\*$/; // a line that's ENTIRELY *wrapped in single asterisks*
  
	let current: { title: string; subtitle: string | null; descLines: string[] } | null = null;
  
	const flush = () => {
	  if (current) {
		features.push({
		  title: current.title,
		  subtitle: current.subtitle,
		  description: current.descLines.join(" ").trim(),
		});
	  }
	};
  
	for (const rawLine of body) {
	  const line = rawLine.trim();
	  const subHeadingMatch = subHeadingPattern.exec(rawLine);
	  if (subHeadingMatch) {
		flush();
		current = { title: subHeadingMatch[1], subtitle: null, descLines: [] };
		continue;
	  }
	  if (!current) continue; // ignore stray content before the first ### heading
	  if (line.length === 0) continue;
  
	  // The FIRST non-blank line under a heading, if fully wrapped in
	  // *single asterisks*, is the subtitle — but only if we haven't
	  // already started the description (so a stray italic phrase
	  // mid-paragraph isn't mistaken for the subtitle).
	  if (current.subtitle === null && current.descLines.length === 0) {
		const subtitleMatch = italicLinePattern.exec(line);
		if (subtitleMatch) {
		  current.subtitle = subtitleMatch[1].trim();
		  continue;
		}
	  }
	  current.descLines.push(line);
	}
	flush();
  
	return features;
  }
  
  // Joins a section body into a single display string: bullets become
  // one-per-line, prose paragraphs are kept as-is (collapsing blank
  // lines), matching how highlight/challenges/takeaway/future
  // improvements are stored as plain text columns, not separate tables.
  function bodyToText(body: string[]): string | null {
	const bullets = extractBullets(body);
	if (bullets.length > 0) {
	  return bullets.join("\n");
	}
	const prose = body
	  .map((l) => l.trim())
	  .filter((l) => l.length > 0 && !/^#{1,6}\s/.test(l)) // drop stray sub-headings
	  .join("\n");
	return prose.length > 0 ? prose : null;
  }
  
  function parseVideos(body: string[] | undefined): ParsedReadme["videos"] {
	const videos: ParsedReadme["videos"] = {
	  clientDemo: null,
	  architecture: null,
	  reflection: null,
	};
	if (!body) return videos;
  
	const linePattern = /^\s*[-*]\s+(.+?):\s*(\S+)\s*$/;
	for (const line of body) {
	  const match = linePattern.exec(line);
	  if (!match) continue;
	  const [, label, url] = match;
	  const key = VIDEO_LABEL[label as keyof typeof VIDEO_LABEL];
	  if (key) videos[key] = url;
	}
	return videos;
  }
  
  export function adaptReadme(markdown: string | null): ParsedReadme {
	const empty: ParsedReadme = {
	  features: [],
	  techStack: [],
	  highlight: null,
	  challenges: null,
	  takeaway: null,
	  futureImprovements: null,
	  videos: { clientDemo: null, architecture: null, reflection: null },
	  missingHeadings: [...WARNED_HEADINGS, ...WARNED_VIDEO_LABELS],
	};
	if (!markdown) return empty;
  
	const sections = splitSections(markdown);
  
	const features = parseFeaturesSection(sections.get(HEADING.features) ?? []);
	const techStack = extractBullets(sections.get(HEADING.technologiesUsed) ?? []);
	const highlight = bodyToText(sections.get(HEADING.architectureHighlights) ?? []);
	const challenges = bodyToText(sections.get(HEADING.challenges) ?? []);
	const futureImprovements = bodyToText(sections.get(HEADING.futureImprovements) ?? []);
  
	const whatILearned = bodyToText(sections.get(HEADING.whatILearned) ?? []);
	const lookingBack = bodyToText(sections.get(HEADING.lookingBack) ?? []);
	const takeaway =
	  whatILearned && lookingBack
		? `${whatILearned}\n\n${lookingBack}`
		: whatILearned ?? lookingBack ?? null;
  
	const videos = parseVideos(sections.get(HEADING.demoVideos));
  
	const missingHeadings: string[] = [];
	if (!sections.has(HEADING.features)) missingHeadings.push(HEADING.features);
	if (!sections.has(HEADING.technologiesUsed)) missingHeadings.push(HEADING.technologiesUsed);
	if (!sections.has(HEADING.architectureHighlights)) missingHeadings.push(HEADING.architectureHighlights);
	if (!sections.has(HEADING.challenges)) missingHeadings.push(HEADING.challenges);
	if (!sections.has(HEADING.whatILearned)) missingHeadings.push(HEADING.whatILearned);
	if (!sections.has(HEADING.lookingBack)) missingHeadings.push(HEADING.lookingBack);
	if (!sections.has(HEADING.futureImprovements)) missingHeadings.push(HEADING.futureImprovements);
	// Videos are checked per-label, not per-section, since a repo could
	// have the "## Demo Videos" heading but only fill in 1 of 3 labels.
	if (!videos.clientDemo) missingHeadings.push(WARNED_VIDEO_LABELS[0]);
	if (!videos.architecture) missingHeadings.push(WARNED_VIDEO_LABELS[1]);
	if (!videos.reflection) missingHeadings.push(WARNED_VIDEO_LABELS[2]);
  
	return {
	  features,
	  techStack,
	  highlight,
	  challenges,
	  takeaway,
	  futureImprovements,
	  videos,
	  missingHeadings,
	};
  }