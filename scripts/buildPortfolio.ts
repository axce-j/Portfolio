// ═══════════════════════════════════════════════════════════════
// scripts/buildPortfolio.ts
//
// Runs last. Reads projects + project_features + project_media +
// github_cache from Neon, filters to published projects only, and
// writes one static JSON file. React never talks to Neon directly —
// it only ever imports this file.
// ═══════════════════════════════════════════════════════════════

import "dotenv/config"; // loads .env locally; no-op on Vercel, where env vars are already set
import { neon } from "@neondatabase/serverless";
import { writeFileSync, mkdirSync } from "fs";

const sql = neon(process.env.DATABASE_URL!);
const OUTPUT_PATH = "src/features/projects/data/portfolio.generated.json";

// challenges/future_improvements are stored as single newline-joined
// text blobs (see readmeAdapter.ts's bodyToText) — split back into a
// list here, since the frontend renders them as bullet lists, same
// shape as features.
function toList(text: string | null): string[] {
  if (!text) return [];
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

async function generatePortfolioJson(): Promise<number> {
  // status = 'published' is the gate — a draft (freshly discovered,
  // not yet hand-finished) never reaches the site, no matter what else
  // is true about it.
  const projects = await sql`
    select
      p.*,
      g.stars          as gh_stars,
      g.forks          as gh_forks,
      g.latest_release as gh_latest_release,
      g.description    as gh_description,
      g.fetched_at     as gh_fetched_at
    from projects p
    left join github_cache g on g.repo = p.repo
    where p.status = 'published'
    order by p.year desc
  `;

  const projectIds = projects.map((p) => p.id);

  const features = projectIds.length
    ? await sql`
        select * from project_features
        where project_id = any(${projectIds})
        order by project_id, sort_order asc
      `
    : [];

  const media = projectIds.length
    ? await sql`
        select * from project_media
        where project_id = any(${projectIds})
        order by project_id, sort_order asc
      `
    : [];

  const merged = projects.map((p) => ({
    id: p.slug,
    category: p.category,
    repo: p.repo,
    heroImage: p.hero_image,
    heroImageAlt: p.hero_image_alt,

    intro: {
      title: p.title,
      tagline: p.tagline, // no GitHub equivalent — always hand-written, no fallback
      // Explicit precedence, not a "winner-picking" merge: your copy
      // wins if you've written it, GitHub's repo description is the
      // fallback if you haven't gotten to it yet.
      description: p.description ?? p.gh_description,
      tags: p.tags,
    },

    features: features
      .filter((f) => f.project_id === p.id)
      .map((f) => ({
        id: f.id,
        title: f.title,
        subtitle: f.subtitle,
        description: f.description,
        image: f.image,
        imageAlt: f.image_alt,
      })),

    media: media
      .filter((m) => m.project_id === p.id)
      .map((m) => ({
        id: m.id,
        type: m.media_type,
        url: m.url,
        caption: m.caption,
        // video_role is null for images, and for videos uploaded
        // before this column existed — always check for null before
        // using it to slot a video into client_demo/architecture/reflection.
        videoRole: m.video_role,
      })),

    highlight: {
      title: p.highlight_title,
      subtitle: p.highlight_subtitle,
      description: p.highlight_description,
      image: p.highlight_image,
      imageAlt: p.highlight_image_alt,
    },

    // New in Phase 2D — previously fetched via `p.*` but never mapped
    // into the output, so the frontend had nothing to read.
    challenges: toList(p.challenges),
    futureImprovements: toList(p.future_improvements),

    takeaway: {
      title: p.takeaway_title,
      subtitle: p.takeaway_subtitle,
      description: p.takeaway_description,
    },

    links: {
      github: p.links_github,
      live: p.links_live,
      figma: p.links_figma,
      behance: p.links_behance,
      dribbble: p.links_dribbble,
      caseStudy: p.links_case_study,
    },

    techStack: p.tech_stack,
    year: p.year,
    client: p.client,
    role: p.role,
    duration: p.duration,

    stars: p.gh_stars ?? null,
    forks: p.gh_forks ?? null,
    latestRelease: p.gh_latest_release ?? null,
  }));

  mkdirSync("src/features/projects/data", { recursive: true });
  writeFileSync(OUTPUT_PATH, JSON.stringify(merged, null, 2));
  return merged.length;
}

// Exported so api/save-media.ts and api/save-project-text.ts can
// regenerate the JSON directly when running under `vercel dev`
// locally — see LOCAL_REBUILD note in those files for why this only
// makes sense locally, not in a real deployed serverless function.
export { generatePortfolioJson };

async function main() {
  const count = await generatePortfolioJson();
  console.log(`✅ Wrote ${count} published project(s) to ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error("❌ buildPortfolio failed:", err);
  process.exit(1);
});