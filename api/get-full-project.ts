// api/get-full-project.ts
//
// Powers the visual editor: returns ONE project's complete current
// state — everything singleProjectPage.tsx's components need to
// render, live from Neon, regardless of status (draft or published;
// buildPortfolio.ts only ever exposes published projects, but the
// admin editor needs to work on drafts too).
//
// Reuses scripts/buildPortfolio.ts's mapProjectRow EXACTLY — this is
// the guarantee that what the visual editor shows you is the same
// shape (and therefore, rendered through the same components, the
// same look) as what the real site will show once published and
// rebuilt. No separate mapping logic to drift out of sync.

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { neon } from "@neondatabase/serverless";
import { mapProjectRow } from "../scripts/buildPortfolio.js";

const sql = neon(process.env.DATABASE_URL!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { password, projectSlug } = req.body ?? {};
  if (!password || password !== process.env.ADMIN_UPLOAD_PASSWORD) {
    return res.status(401).json({ error: "Invalid password" });
  }
  if (!projectSlug) {
    return res.status(400).json({ error: "projectSlug is required" });
  }

  const projectRows = await sql`
    select
      p.*,
      g.stars          as gh_stars,
      g.forks          as gh_forks,
      g.latest_release as gh_latest_release,
      g.description    as gh_description,
      g.fetched_at     as gh_fetched_at
    from projects p
    left join github_cache g on g.repo = p.repo
    where p.slug = ${projectSlug}
  `;
  if (projectRows.length === 0) {
    return res.status(404).json({ error: `No project found with slug '${projectSlug}'` });
  }
  const p = projectRows[0];

  const features = await sql`
    select * from project_features
    where project_id = ${p.id}
    order by sort_order asc
  `;
  const media = await sql`
    select * from project_media
    where project_id = ${p.id}
    order by sort_order asc
  `;

  const project = mapProjectRow(p, features, media);

  return res.status(200).json({ project, status: p.status });
}