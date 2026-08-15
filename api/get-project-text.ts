// api/get-project-text.ts
//
// Read-side of the text-edit feature. Returns current values for
// every hand-editable text field on a project, so the admin form can
// show what's already there instead of a blank box that would
// silently wipe existing content on save.

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { neon } from "@neondatabase/serverless";

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

  const rows = await sql`
    select
      tagline, description, role, duration, client, year,
      highlight_title, highlight_subtitle, highlight_description,
      takeaway_title, takeaway_subtitle, takeaway_description,
      challenges, future_improvements
    from projects
    where slug = ${projectSlug}
  `;
  if (rows.length === 0) {
    return res.status(404).json({ error: `No project found with slug '${projectSlug}'` });
  }
  const p = rows[0];

  return res.status(200).json({
    tagline: p.tagline ?? "",
    description: p.description ?? "",
    role: p.role ?? "",
    duration: p.duration ?? "",
    client: p.client ?? "",
    year: p.year != null ? String(p.year) : "",
    highlightTitle: p.highlight_title ?? "",
    highlightSubtitle: p.highlight_subtitle ?? "",
    highlightDescription: p.highlight_description ?? "",
    takeawayTitle: p.takeaway_title ?? "",
    takeawaySubtitle: p.takeaway_subtitle ?? "",
    takeawayDescription: p.takeaway_description ?? "",
    challenges: p.challenges ?? "",
    futureImprovements: p.future_improvements ?? "",
  });
}