// ═══════════════════════════════════════════════════════════════
// scripts/adapters/testGithubAdapter.ts
//
// READ-ONLY. Pulls real rows from github_cache and runs them through
// adaptGithubRepo, printing the result. Writes nothing to any table —
// safe to run as many times as you want. Delete this file once
// convergeProjects.ts exists and does the same job for real.
// ═══════════════════════════════════════════════════════════════

import { neon } from "@neondatabase/serverless";
import { adaptGithubRepo } from "./githubAdapter";

const sql = neon(process.env.DATABASE_URL!);

async function main() {
  const rows = await sql`select repo, language, homepage, topics, latest_release from github_cache order by repo`;

  console.log(`Testing adapter against ${rows.length} real rows from github_cache:\n`);

  for (const row of rows) {
    const result = adaptGithubRepo(row as any);
    console.log(`── ${result.sourceId} ──`);
    console.log(`  title:              ${result.title}`);
    console.log(`  inferredCategory:   ${result.inferredCategory ?? "(null — needs manual)"}`);
    console.log(`  tags:               ${result.tags.join(", ") || "(none)"}`);
    console.log(`  inferredTechStack:  ${result.inferredTechStack.join(", ") || "(none)"}`);
    console.log(`  links.repo:         ${result.links.repo}`);
    console.log(`  links.live:         ${result.links.live ?? "(none)"}`);
    console.log("");
  }
}

main().catch((err) => {
  console.error("❌ testGithubAdapter failed:", err);
  process.exit(1);
});