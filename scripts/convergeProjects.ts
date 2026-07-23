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
//   - Overwritten only if not manually set: category, tech_stack —
//     protected by category_source/tech_stack_source columns.
//   - Never touched: tagline, description, highlight_*, takeaway_*,
//     role, duration, client, hero_image (after initial insert) —
//     these are hand-authored, written by a person in a second pass.
//   - `status` starts 'draft' on first insert and is NEVER included in
//     the update statement below — so once you manually flip a project
//     to 'published', reruns can never silently revert it back to
//     draft. buildPortfolio.ts (next script) must filter on
//     status = 'published' so unfinished discoveries stay invisible.
// ═══════════════════════════════════════════════════════════════

import { neon } from "@neondatabase/serverless";
import { adaptGithubRepo } from "./adapters/githubAdapter";

const sql = neon(process.env.DATABASE_URL!);

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function main() {
  const cacheRows = await sql`
    select repo, language, homepage, topics, latest_release, updated_at
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
      select id, category_source, tech_stack_source
      from projects
      where source_type = ${adapted.sourceType} and source_id = ${adapted.sourceId}
    `;

    if (existing.length === 0) {
      // New discovery. Hand-authored fields are left NULL on purpose —
      // that's the human's second pass, not this script's job.
      const inferredYear = row.updated_at
        ? new Date(row.updated_at).getFullYear()
        : new Date().getFullYear();

      await sql`
        insert into projects (
          slug, category, category_source, repo, source_type, source_id,
          title, tags, tech_stack, tech_stack_source, year,
          hero_image, links_github, links_live, status
        ) values (
          ${slugify(adapted.title)}, ${adapted.inferredCategory}, 'inferred',
          ${adapted.sourceId}, ${adapted.sourceType}, ${adapted.sourceId},
          ${adapted.title}, ${adapted.tags}, ${adapted.inferredTechStack}, 'inferred',
          ${inferredYear}, '/doubt.png', ${adapted.links.repo}, ${adapted.links.live}, 'draft'
        )
      `;
      created++;
    } else {
      const current = existing[0];

      await sql`
        update projects set
          title        = ${adapted.title},
          tags         = ${adapted.tags},
          links_github = ${adapted.links.repo},
          links_live   = ${adapted.links.live},
          category     = case when category_source = 'manual'
                              then category else ${adapted.inferredCategory} end,
          tech_stack   = case when tech_stack_source = 'manual'
                              then tech_stack else ${adapted.inferredTechStack} end,
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