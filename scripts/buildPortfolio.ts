// ═══════════════════════════════════════════════════════════════
// scripts/buildPortfolio.ts
//
// Runs last. Reads projects + project_features + project_media +
// github_cache from Neon, filters to published projects only, and
// writes one static JSON file. React never talks to Neon directly —
// it only ever imports this file.
// ═══════════════════════════════════════════════════════════════

import { neon } from "@neondatabase/serverless";
import { writeFileSync, mkdirSync } from "fs";

const sql = neon(process.env.DATABASE_URL!);
const OUTPUT_PATH = "src/features/projects/data/portfolio.generated.json";

async function main() {
  // status = 'published' is the gate — a draft (freshly discovered,
  // not yet hand-finished) never reaches the site, no matter what else
  // is true about it.
  const projects = await sql`
    select
      p.*,
      g.stars          as gh_stars,
      g.forks          as gh_forks,
      g.latest_release as gh_latest_release,
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
      tagline: p.tagline,
      description: p.description, // projects only — never GitHub, no merge-winner logic
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
      })),

    highlight: {
      title: p.highlight_title,
      subtitle: p.highlight_subtitle,
      description: p.highlight_description,
      image: p.highlight_image,
      imageAlt: p.highlight_image_alt,
    },

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
  console.log(`✅ Wrote ${merged.length} published project(s) to ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error("❌ buildPortfolio failed:", err);
  process.exit(1);
});