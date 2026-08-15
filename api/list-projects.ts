// api/list-projects.ts
//
// Populates the admin page's project picker. The Phase 2 plan
// described this as unauthenticated/read-only, but it can return
// draft (unpublished) project titles and slugs — information not
// otherwise visible on the public site — so it's gated behind the
// same password check as everything else, consistent with the
// project's "admin auth checked server-side only" rule applying to
// all admin-surface endpoints, not just the upload itself.

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { password } = req.body ?? {};
  if (!password || password !== process.env.ADMIN_UPLOAD_PASSWORD) {
    return res.status(401).json({ error: "Invalid password" });
  }

  const rows = await sql`select slug, title from projects order by title asc`;
  return res.status(200).json({ projects: rows });
}