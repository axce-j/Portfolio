// ═══════════════════════════════════════════════════════════════
// scripts/checkSetup.ts
//
// READ-ONLY. Compares the live Neon schema against every column the
// pipeline scripts expect, and reports exactly what's missing — so you
// never have to guess which migrations have actually been run.
// ═══════════════════════════════════════════════════════════════

import "dotenv/config"; // loads .env locally; no-op on Vercel, where env vars are already set
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

const EXPECTED: Record<string, string[]> = {
  github_cache: [
    "repo", "language", "homepage", "topics", "stars", "forks",
    "open_issues", "latest_release", "updated_at", "fetched_at",
    "description", "readme", // added in 007
  ],
  projects: [
    "id", "slug", "category", "repo", "title", "tagline", "description",
    "tags", "tech_stack", "year", "client", "role", "duration",
    "hero_image", "hero_image_alt", "links_live", "links_github",
    "links_figma", "links_behance", "links_dribbble", "links_case_study",
    "highlight_title", "highlight_subtitle", "highlight_description",
    "highlight_image", "takeaway_title", "takeaway_subtitle",
    "takeaway_description", "created_at", "updated_at",
    "source_type", "source_id", "category_source",     // added in 002
    "highlight_image_alt",                              // added in 003
    "tech_stack_source",                                // added in 004
    "status",                                            // added in 006
    "status_source",                                     // added in 008
  ],
  project_features: [
    "id", "project_id", "sort_order", "title", "subtitle",
    "description", "image", "image_alt",
  ],
  project_media: [
    "id", "project_id", "media_type", "url", "caption",
    "sort_order", "created_at", // added in 003
  ],
};

// Columns that migration 005 should have made nullable. Existence
// checks alone miss this class of bug — tagline has existed since 001,
// the NOT NULL constraint is the thing that needed to change.
// category is deliberately NOT here — it stays NOT NULL by design;
// convergeProjects.ts skips inserting a row rather than allowing an
// empty category.
const EXPECTED_NULLABLE: Record<string, string[]> = {
  projects: ["tagline", "description", "hero_image"],
};

async function main() {
  let allGood = true;

  for (const [table, expectedCols] of Object.entries(EXPECTED)) {
    const rows = await sql`
      select column_name from information_schema.columns
      where table_name = ${table}
    `;
    const actualCols = new Set(rows.map((r) => r.column_name as string));

    const missing = expectedCols.filter((c) => !actualCols.has(c));

    if (actualCols.size === 0) {
      console.log(`❌ ${table}: table does not exist at all`);
      allGood = false;
    } else if (missing.length > 0) {
      console.log(`⚠️  ${table}: missing columns → ${missing.join(", ")}`);
      allGood = false;
    } else {
      console.log(`✅ ${table}: all expected columns present`);
    }
  }

  for (const [table, cols] of Object.entries(EXPECTED_NULLABLE)) {
    const rows = await sql`
      select column_name, is_nullable from information_schema.columns
      where table_name = ${table} and column_name = any(${cols})
    `;
    const stillRequired = rows.filter((r) => r.is_nullable === "NO").map((r) => r.column_name);

    if (stillRequired.length > 0) {
      console.log(`⚠️  ${table}: still NOT NULL (should be nullable per 005) → ${stillRequired.join(", ")}`);
      allGood = false;
    } else {
      console.log(`✅ ${table}: nullable columns correctly relaxed`);
    }
  }

  console.log(allGood ? "\n✅ Schema fully up to date." : "\n❌ Run the missing migrations above, in order, then re-check.");
}

main().catch((err) => {
  console.error("❌ checkSetup failed:", err);
  process.exit(1);
});