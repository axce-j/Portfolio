// api/delete-feature.ts
//
// Deletes one project_features row. NOT permanent for README-sourced
// features: convergeProjects.ts's syncFeaturesFromReadme will
// reinsert anything still described in that repo's README on the
// next sync. Returns wasReadmeSourced so the frontend can warn about
// this BEFORE the delete happens (this endpoint doesn't block the
// delete on it — the warning is a UI-side confirmation step).

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
    select id, source from project_features where id = ${featureId} and project_id = ${projectId}
  `;
  if (existing.length === 0) {
    return res.status(404).json({ error: "Feature not found for this project" });
  }
  const wasReadmeSourced = existing[0].source === "readme";

  await sql`delete from project_features where id = ${featureId}`;

  const rebuild = await triggerRebuild();
  return res.status(200).json({ success: true, wasReadmeSourced, rebuild });
}