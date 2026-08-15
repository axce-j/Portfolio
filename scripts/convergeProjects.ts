// ═══════════════════════════════════════════════════════════════
// scripts/convergeProjects.ts
//
// Runs after syncGithub.ts. Reads every row in github_cache, adapts it
// via githubAdapter + readmeAdapter, and upserts into `projects`
// matched on (source_type, source_id).
//
// Ownership rule (see PRD §5.1, updated by Phase 2C):
//   - Always overwritten: title, tags, links_github, links_live —
//     these are source-derived, no independent "manual" version exists.
//   - Overwritten only if not manually set: category, tech_stack,
//     status, highlight_description, challenges, takeaway_description,
//     future_improvements — each protected by its own *_source column
//     (category_source, tech_stack_source, status_source,
//     highlight_source, challenges_source, takeaway_source).
//     tech_stack and the four README-derived fields are now 3-tier
//     ('manual' | 'readme' | 'inferred') instead of the old 2-tier
//     ('manual' | 'inferred') — see readmeAdapter.ts.
//     NOTE: future_improvements has no *_source column as of
//     010_readme_fields.sql (schema gap — see 011_future_improvements_
//     source.sql for the fix). Until that migration is applied, this
//     script uses an interim "only fill if currently null" rule
//     instead of real manual-edit protection — see its CASE clause
//     below.
//   - Never touched: tagline, description, highlight_title,
//     highlight_subtitle, highlight_image, highlight_image_alt,
//     takeaway_title, takeaway_subtitle, role, duration, client,
//     hero_image (after initial insert) — these are hand-authored,
//     written by a person in a second pass, with no README equivalent
//     to parse them from.
//
// project_features (see 012_project_features_source.sql): synced via
// delete-then-reinsert, but ONLY for rows tagged source = 'readme' —
// hand-curated feature rows (source = 'manual', typically added with
// an image directly in Neon) are never touched by this script, no
// matter how many times it runs. README feature bullets have no
// separate description field (the template only gives a short
// phrase), so they're stored with description = '' — the frontend
// only renders the description line when it's non-empty.
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
import { adaptReadme, type ParsedFeature } from "./adapters/readmeAdapter";

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

// Syncs README-parsed features into project_features. Only ever
// touches rows this script itself wrote (source = 'readme') — the
// delete only targets that subset, so hand-curated feature rows
// (source = 'manual', typically added with an image directly in
// Neon) are never deleted or overwritten, no matter how many times
// this runs. Each feature carries title/subtitle/description parsed
// by readmeAdapter.ts — legacy flat-bullet READMEs produce
// subtitle=null, description="" (the frontend only renders
// description when it's non-empty), while the structured
// ### Title / *subtitle* / paragraph format produces all three.
async function syncFeaturesFromReadme(projectId: string, features: ParsedFeature[]) {
  await sql`delete from project_features where project_id = ${projectId} and source = 'readme'`;
  for (let i = 0; i < features.length; i++) {
    const f = features[i];
    await sql`
      insert into project_features (project_id, sort_order, title, subtitle, description, source)
      values (${projectId}, ${i}, ${f.title}, ${f.subtitle}, ${f.description}, 'readme')
    `;
  }
}

async function main() {
  const cacheRows = await sql`
    select repo, language, homepage, topics, latest_release, updated_at, created_at, description, readme
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
    const parsedReadme = adaptReadme((row as any).readme);

    if ((row as any).readme === null) {
      console.log(`⚠️  ${adapted.sourceId}: no README found on GitHub`);
    } else if (parsedReadme.missingHeadings.length > 0) {
      console.log(
        `⚠️  ${adapted.sourceId}: missing README headings — ${parsedReadme.missingHeadings.join(", ")}`
      );
    }

    // tech_stack 3-tier resolution, computed once in JS since it needs
    // parsedReadme.techStack (not available to plain SQL). Empty array
    // counts as "nothing parsed", same as null does for the text fields.
    const techStackParsed = parsedReadme.techStack;
    const techStackHasParsed = techStackParsed.length > 0;
    const techStackFallback = techStackHasParsed ? techStackParsed : adapted.inferredTechStack;
    const techStackFallbackSource = techStackHasParsed ? "readme" : "inferred";

    const existing = await sql`
      select id, description
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

      // Hand-authored fields (highlight_title, takeaway_title, etc.)
      // are left NULL on purpose — that's the human's second pass, not
      // this script's job. highlight_description/takeaway_description/
      // challenges/future_improvements DO get seeded here if the
      // README has them — no manual version can exist yet on a brand
      // new row, so parsed-or-nothing is the whole precedence chain.
      // year: uses the repo's actual creation date (created_at), not
      // pushed_at — a repo you pushed a commit to yesterday shouldn't
      // suddenly look like a 2026 project if you built it in 2023.
      // Only set here, on first insert — the UPDATE branch below never
      // touches year again, so it's safe to hand-correct in Neon for
      // any of the 7 projects that were already seeded with the old
      // (pushed_at-based) logic before this fix.
      const inferredYear = row.created_at
        ? new Date(row.created_at).getFullYear()
        : row.updated_at
        ? new Date(row.updated_at).getFullYear()
        : new Date().getFullYear();

      const insertResult = await sql`
        insert into projects (
          slug, category, category_source, repo, source_type, source_id,
          title, tags, tech_stack, tech_stack_source, year,
          links_github, links_live, status, status_source,
          highlight_description, highlight_source,
          challenges, challenges_source,
          takeaway_description, takeaway_source,
          future_improvements
        ) values (
          ${slugify(adapted.title)}, ${adapted.inferredCategory}, 'inferred',
          ${adapted.sourceId}, ${adapted.sourceType}, ${adapted.sourceId},
          ${adapted.title}, ${adapted.tags}, ${techStackFallback}, ${techStackFallbackSource},
          ${inferredYear}, ${adapted.links.repo}, ${adapted.links.live},
          ${autoStatus}, 'auto',
          ${parsedReadme.highlight}, ${parsedReadme.highlight ? "readme" : "inferred"},
          ${parsedReadme.challenges}, ${parsedReadme.challenges ? "readme" : "inferred"},
          ${parsedReadme.takeaway}, ${parsedReadme.takeaway ? "readme" : "inferred"},
          ${parsedReadme.futureImprovements}
        )
        returning id
      `;
      const newProjectId = insertResult[0].id as string;
      if (parsedReadme.features.length > 0) {
        await syncFeaturesFromReadme(newProjectId, parsedReadme.features);
      }
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

          -- tech_stack: manual → parsed "Technologies Used" → topic-inferred.
          -- techStackFallback/-Source in JS already collapsed the
          -- readme-vs-inferred choice, so the CASE here only has to
          -- gate on the manual check.
          tech_stack        = case when tech_stack_source = 'manual'
                                   then tech_stack else ${techStackFallback} end,
          tech_stack_source = case when tech_stack_source = 'manual'
                                   then tech_stack_source else ${techStackFallbackSource} end,

          -- highlight: manual → parsed "Architecture Highlights" → (nothing).
          -- No parsed value this run keeps whatever was there before,
          -- same "don't blank out a previously-good value" behavior
          -- category/tech_stack already had.
          highlight_description = case
                                     when highlight_source = 'manual' then highlight_description
                                     when ${parsedReadme.highlight}::text is not null then ${parsedReadme.highlight}
                                     else highlight_description
                                   end,
          highlight_source       = case
                                     when highlight_source = 'manual' then highlight_source
                                     when ${parsedReadme.highlight}::text is not null then 'readme'
                                     else highlight_source
                                   end,

          -- challenges: manual → parsed "Challenges" → (nothing).
          challenges        = case
                                 when challenges_source = 'manual' then challenges
                                 when ${parsedReadme.challenges}::text is not null then ${parsedReadme.challenges}
                                 else challenges
                               end,
          challenges_source = case
                                 when challenges_source = 'manual' then challenges_source
                                 when ${parsedReadme.challenges}::text is not null then 'readme'
                                 else challenges_source
                               end,

          -- takeaway: manual → parsed "What I Learned" + "Looking Back" → (nothing).
          takeaway_description = case
                                    when takeaway_source = 'manual' then takeaway_description
                                    when ${parsedReadme.takeaway}::text is not null then ${parsedReadme.takeaway}
                                    else takeaway_description
                                  end,
          takeaway_source       = case
                                    when takeaway_source = 'manual' then takeaway_source
                                    when ${parsedReadme.takeaway}::text is not null then 'readme'
                                    else takeaway_source
                                  end,

          -- future_improvements: INTERIM RULE, see file header comment.
          -- No *_source column exists yet, so this can't tell "you
          -- edited this by hand" from "the script wrote this last
          -- run" — it just freezes the field the first time it's
          -- non-null and never touches it again. Once
          -- 011_future_improvements_source.sql is applied, replace
          -- this with the same manual/readme pattern as challenges
          -- above.
          future_improvements = case
                                   when future_improvements is not null then future_improvements
                                   when ${parsedReadme.futureImprovements}::text is not null then ${parsedReadme.futureImprovements}
                                   else future_improvements
                                 end,

          status       = case when status_source = 'manual'
                              then status else ${autoStatus} end,
          updated_at   = now()
        where id = ${current.id}
      `;
      if (parsedReadme.features.length > 0) {
        await syncFeaturesFromReadme(current.id, parsedReadme.features);
      }
      updated++;
    }
  }

  console.log(`✅ Converged ${cacheRows.length} repos → ${created} created, ${updated} updated`);
}

main().catch((err) => {
  console.error("❌ convergeProjects failed:", err);
  process.exit(1);
});