// ═══════════════════════════════════════════════════════════════
// scripts/sources/syncGithub.ts
//
// Discovery + stats fetch, combined. Lists every public, non-forked repo
// on your GitHub account (minus the blacklist), and upserts raw stats
// into github_cache. This is a REVERSAL from the old version: it no
// longer reads `projects.repo` to know what to fetch — it decides that
// list itself, from GitHub directly. This is what makes discovery work:
// a new repo shows up here with zero action needed in `projects`.
//
// Never writes to `projects` — only `github_cache`. Turning a cache row
// into an actual project row is convergeProjects.ts's job, not this
// file's.
// ═══════════════════════════════════════════════════════════════

import "dotenv/config"; // loads .env locally; no-op on Vercel, where env vars are already set
import { neon } from "@neondatabase/serverless";
import { isBlacklisted } from "./repoBlacklist";

const sql = neon(process.env.DATABASE_URL!);
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME;

if (!GITHUB_USERNAME) {
  console.error("❌ GITHUB_USERNAME env var is required");
  process.exit(1);
}

const headers: Record<string, string> = GITHUB_TOKEN
  ? { Authorization: `Bearer ${GITHUB_TOKEN}` }
  : {};

type DiscoveredRepo = {
  fullName: string;      // "owner/repo"
  description: string | null;
  homepage: string | null;
  topics: string[];
  language: string | null;
  stars: number;
  forks: number;
  openIssues: number;
  updatedAt: string | null; // pushed_at
};

// Paginates through every public repo for the account, filters out forks
// and anything blacklisted.
async function listQualifyingRepos(): Promise<DiscoveredRepo[]> {
  const results: DiscoveredRepo[] = [];
  let page = 1;

  while (true) {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?type=public&per_page=100&page=${page}`,
      { headers }
    );
    if (!res.ok) {
      console.error(`❌ Failed to list repos: ${res.status}`);
      process.exit(1);
    }
    const batch = await res.json();
    if (batch.length === 0) break;

    for (const repo of batch) {
      if (repo.fork) continue;
      if (isBlacklisted(repo.full_name)) continue;
      results.push({
        fullName: repo.full_name,
        description: repo.description ?? null,
        homepage: repo.homepage || null,
        topics: repo.topics ?? [],
        language: repo.language ?? null,
        stars: repo.stargazers_count ?? 0,
        forks: repo.forks_count ?? 0,
        openIssues: repo.open_issues_count ?? 0,
        updatedAt: repo.pushed_at ?? null,
      });
    }

    page++;
  }

  return results;
}

async function fetchLatestRelease(fullName: string): Promise<string | null> {
  const res = await fetch(`https://api.github.com/repos/${fullName}/releases/latest`, { headers });
  if (!res.ok) return null; // no releases is normal, not an error
  const release = await res.json();
  return release.tag_name ?? null;
}

// Raw README markdown, unparsed. Used as a drafting reference (writing
// features/highlight/takeaway) — never shown on the live site directly.
async function fetchReadme(fullName: string): Promise<string | null> {
  const res = await fetch(`https://api.github.com/repos/${fullName}/readme`, {
    headers: { ...headers, Accept: "application/vnd.github.raw" },
  });
  if (!res.ok) return null; // no README is normal, not an error
  return res.text();
}

async function main() {
  const repos = await listQualifyingRepos();
  console.log(`Found ${repos.length} qualifying repos for ${GITHUB_USERNAME}`);

  // Release and README lookups are calls to GitHub, not Neon — batching
  // those wouldn't reduce DB round trips, so these loops stay as-is.
  // It's the per-repo Neon INSERT that got collapsed below.
  const releases = await Promise.all(repos.map((r) => fetchLatestRelease(r.fullName)));
  const readmes = await Promise.all(repos.map((r) => fetchReadme(r.fullName)));

  if (repos.length > 0) {
    // Single round trip for all repos instead of one INSERT per repo.
    // jsonb_to_recordset lets us pass the whole batch as one JSON param
    // and expand it server-side — handles `topics` (an array per row)
    // cleanly, which a plain multi-row VALUES/unnest can't do as easily.
    const payload = repos.map((r, i) => ({
      repo: r.fullName,
      language: r.language,
      homepage: r.homepage,
      topics: r.topics,
      stars: r.stars,
      forks: r.forks,
      open_issues: r.openIssues,
      latest_release: releases[i],
      updated_at: r.updatedAt,
      description: r.description,
      readme: readmes[i],
    }));

    await sql`
      insert into github_cache (
        repo, language, homepage, topics, stars, forks, open_issues,
        latest_release, updated_at, description, readme, fetched_at
      )
      select
        r.repo, r.language, r.homepage,
        array(select jsonb_array_elements_text(r.topics)) as topics,
        r.stars, r.forks, r.open_issues, r.latest_release, r.updated_at,
        r.description, r.readme, now()
      from jsonb_to_recordset(${JSON.stringify(payload)}::jsonb) as r(
        repo text, language text, homepage text, topics jsonb,
        stars int, forks int, open_issues int, latest_release text,
        updated_at timestamptz, description text, readme text
      )
      on conflict (repo) do update set
        language       = excluded.language,
        homepage       = excluded.homepage,
        topics         = excluded.topics,
        stars          = excluded.stars,
        forks          = excluded.forks,
        open_issues    = excluded.open_issues,
        latest_release = excluded.latest_release,
        updated_at     = excluded.updated_at,
        description    = excluded.description,
        readme         = excluded.readme,
        fetched_at     = now()
    `;
  }

  console.log(`✅ Synced github_cache for ${repos.length}/${repos.length} repos`);

  // Prune rows that no longer qualify — e.g. newly blacklisted, deleted,
  // or made private since the last sync. Without this, a stale row sits
  // in github_cache forever and convergeProjects.ts would still pick it
  // up despite it no longer being wanted.
  const qualifyingNames = repos.map((r) => r.fullName);
  const pruned = await sql`
    delete from github_cache
    where not (repo = any(${qualifyingNames}))
    returning repo
  `;
  if (pruned.length > 0) {
    console.log(`🗑️  Pruned ${pruned.length} stale repo(s): ${pruned.map((p: any) => p.repo).join(", ")}`);
  }
}

main().catch((err) => {
  console.error("❌ syncGithub failed:", err);
  process.exit(1);
});