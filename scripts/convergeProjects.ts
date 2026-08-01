// ═══════════════════════════════════════════════════════════════
// scripts/convergeProjects.ts
//
// Runs after syncGithub.ts. Reads every row in github_cache, adapts it
// via githubAdapter, and upserts into `projects` matched on
// (source_type, source_id).
//
// Ownership rule (see PRD §5.1):
//   - Always overwritten: title, tags, links_github, links_live —
//     these are source-derived, no independent "manual" version exists.
//   - Overwritten only if not manually set: category, tech_stack,
//     status — each protected by its own *_source column
//     (category_source, tech_stack_source, status_source).
//   - Never touched: tagline, description, highlight_*, takeaway_*,
//     role, duration, client, hero_image (after initial insert) —
//     these are hand-authored, written by a person in a second pass.
//
// Publish rule: status is auto-computed from whether GitHub itself has
// the basics filled in — description, homepage (live link), topics,
// and a release. All four present → 'published'. Any missing →
// 'draft'. This only applies while status_source = 'auto'; manually
// setting status flips status_source to 'manual' and this script will
// never touch it again after that, in either direction.
// ═══════════════════════════════════════════════════════════════

import "dotenv/config"; // loads .env locally; no-op on Vercel, where env vars are already set
import { neon } from "@neondatabase/serverless";
import { adaptGithubRepo } from "./adapters/githubAdapter";

const sql = neon(process.env.DATABASE_URL!);

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// The GitHub-side completeness check — matches what you'd see in a
// repo's "About" panel: a live link, topic tags, a release, and a
// description. Description follows the same precedence as the display
// layer (buildPortfolio.ts): your own writing counts first, GitHub's
// repo description is the fallback — either one satisfies the rule.
function isPublishReady(args: {
  manualDescription: string | null;
  githubDescription: string | null;
  homepage: string | null;
  topics: string[];
  latestRelease: string | null;
}): boolean {
  const hasDescription = Boolean(args.manualDescription || args.githubDescription);
  return Boolean(
    hasDescription &&
    args.homepage &&
    args.topics.length > 0 &&
    args.latestRelease
  );
}

async function main() {
  const cacheRows = await sql`
    select repo, language, homepage, topics, latest_release, updated_at, description
    from github_cache
  `;

  let created = 0;
  let updated = 0;

  // Per-repo round trips, not batched like syncGithub.ts — each row
  // needs its own read-then-branch (does it exist? is category/tech_stack
  // manually protected?) before deciding what to write. That conditional
  // logic is awkward to express as one batched statement and this only
  // runs against a handful of repos, so clarity wins over round-trip
  // count here. Revisit if the repo count grows a lot.
  for (const row of cacheRows) {
    const adapted = adaptGithubRepo(row as any);

    const existing = await sql`
      select id, description, category_source, tech_stack_source, status_source
      from projects
      where source_type = ${adapted.sourceType} and source_id = ${adapted.sourceId}
    `;

    if (existing.length === 0) {
      // category stays NOT NULL by design (see 005's comment) — a repo
      // with no manual category (can't exist yet, row isn't created)
      // and no inferred one gets skipped entirely rather than crashing
      // on the constraint. Add topics on GitHub, or wait for a better
      // inference rule, then rerun.
      if (!adapted.inferredCategory) {
        console.log(`⚠️  Skipped ${adapted.sourceId}: no category available (manual or inferred)`);
        continue;
      }

      // New discovery — no manual description can exist yet, so the
      // publish check falls back entirely to GitHub's description here.
      const publishReady = isPublishReady({
        manualDescription: null,
        githubDescription: (row as any).description,
        homepage: (row as any).homepage,
        topics: (row as any).topics,
        latestRelease: (row as any).latest_release,
      });
      const autoStatus = publishReady ? "published" : "draft";

      // Hand-authored fields are left NULL on purpose — that's the
      // human's second pass, not this script's job.
      const inferredYear = row.updated_at
        ? new Date(row.updated_at).getFullYear()
        : new Date().getFullYear();

      await sql`
        insert into projects (
          slug, category, category_source, repo, source_type, source_id,
          title, tags, tech_stack, tech_stack_source, year,
          links_github, links_live, status, status_source
        ) values (
          ${slugify(adapted.title)}, ${adapted.inferredCategory}, 'inferred',
          ${adapted.sourceId}, ${adapted.sourceType}, ${adapted.sourceId},
          ${adapted.title}, ${adapted.tags}, ${adapted.inferredTechStack}, 'inferred',
          ${inferredYear}, ${adapted.links.repo}, ${adapted.links.live},
          ${autoStatus}, 'auto'
        )
      `;
      created++;
    } else {
      const current = existing[0];

      // Existing row — your own description (if you've written one)
      // counts first, same precedence as buildPortfolio.ts's display.
      const publishReady = isPublishReady({
        manualDescription: current.description,
        githubDescription: (row as any).description,
        homepage: (row as any).homepage,
        topics: (row as any).topics,
        latestRelease: (row as any).latest_release,
      });
      const autoStatus = publishReady ? "published" : "draft";

      await sql`
        update projects set
          title        = ${adapted.title},
          tags         = ${adapted.tags},
          links_github = ${adapted.links.repo},
          links_live   = ${adapted.links.live},
          category     = case
                            when category_source = 'manual' then category
                            when ${adapted.inferredCategory}::text is not null then ${adapted.inferredCategory}
                            else category
                          end,
          tech_stack   = case when tech_stack_source = 'manual'
                              then tech_stack else ${adapted.inferredTechStack} end,
          status       = case when status_source = 'manual'
                              then status else ${autoStatus} end,
          updated_at   = now()
        where id = ${current.id}
      `;
      updated++;
    }
  }

  console.log(`✅ Converged ${cacheRows.length} repos → ${created} created, ${updated} updated`);
}

main().catch((err) => {
  console.error("❌ convergeProjects failed:", err);
  process.exit(1);
});