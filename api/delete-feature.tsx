// Deletes one project_features row permanently.
//
// If the feature came from the README, a tombstone is created in
// project_feature_deletions using the normalized title. This prevents
// convergeProjects.ts from recreating the feature on future README
// syncs.
//
// Manual features are also deleted normally. The tombstone is harmless
// if the title was manually created, and allows the same title to remain
// suppressed from README syncs until an admin intentionally recreates it.

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { neon } from "@neondatabase/serverless";
import { triggerRebuild } from "./_lib/triggerRebuild.js";

const sql = neon(process.env.DATABASE_URL!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { password, projectSlug, featureId } = req.body ?? {};

  if (!password || password !== process.env.ADMIN_UPLOAD_PASSWORD) {
    return res.status(401).json({ error: "Invalid password" });
  }
  if (!projectSlug || !featureId) {
    return res.status(400).json({ error: "projectSlug and featureId are required" });
  }

  const projectRows = await sql`select id from projects where slug = ${projectSlug}`;
  if (projectRows.length === 0) {
    return res.status(404).json({ error: `No project found with slug '${projectSlug}'` });
  }
  const projectId = projectRows[0].id;

  const existing = await sql`
  select id, title from project_features where id = ${featureId} and project_id = ${projectId}
`;
if (existing.length === 0) {
  return res.status(404).json({ error: "Feature not found for this project" });
}

const titleKey = existing[0].title.trim().toLowerCase();



await sql`
  insert into project_feature_deletions (project_id, title_key)
  values (${projectId}, ${titleKey})
  on conflict (project_id, title_key) do nothing
`;
await sql`delete from project_features where id = ${featureId}`;

const rebuild = await triggerRebuild();
return res.status(200).json({ success: true, rebuild });}