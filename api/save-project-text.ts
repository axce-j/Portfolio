// api/save-project-text.ts
//
// Write-side of the text-edit feature. Each editable field is its own
// switch case with a FULLY STATIC query — the column name is never
// built from user input, even though `field` is checked against the
// whitelist below first. Fields that have a matching *_source column
// (highlight_description, takeaway_description, challenges,
// future_improvements) flip that column to 'manual' in the same
// statement — this is what makes the edit stick: without it, the next
// README-driven convergeProjects.ts run would silently overwrite it
// again, exactly the way editing the column directly in the Neon SQL
// console already requires you to do by convention.
//
// future_improvements requires 011_future_improvements_source.sql to
// have been applied — if it hasn't, that one case will fail with an
// "undefined column" error from Postgres. Every other field works
// regardless.

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { neon } from "@neondatabase/serverless";
import { triggerRebuild } from "./_lib/trigger-rebuild";

 
const sql = neon(process.env.DATABASE_URL!);

const EDITABLE_FIELDS = [
  "tagline",
  "description",
  "role",
  "duration",
  "client",
  "year",
  "highlightTitle",
  "highlightSubtitle",
  "highlightDescription",
  "takeawayTitle",
  "takeawaySubtitle",
  "takeawayDescription",
  "challenges",
  "futureImprovements",
] as const;

type FieldKey = (typeof EDITABLE_FIELDS)[number];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { password, projectSlug, field, value } = req.body ?? {};

  if (!password || password !== process.env.ADMIN_UPLOAD_PASSWORD) {
    return res.status(401).json({ error: "Invalid password" });
  }
  if (!projectSlug) {
    return res.status(400).json({ error: "projectSlug is required" });
  }
  if (!EDITABLE_FIELDS.includes(field)) {
    return res.status(400).json({ error: `field must be one of: ${EDITABLE_FIELDS.join(", ")}` });
  }

  const projectRows = await sql`select id from projects where slug = ${projectSlug}`;
  if (projectRows.length === 0) {
    return res.status(404).json({ error: `No project found with slug '${projectSlug}'` });
  }
  const projectId = projectRows[0].id;

  const cleanValue = typeof value === "string" && value.trim().length > 0 ? value : null;

  switch (field as FieldKey) {
    case "tagline":
      await sql`update projects set tagline = ${cleanValue} where id = ${projectId}`;
      break;
    case "description":
      await sql`update projects set description = ${cleanValue} where id = ${projectId}`;
      break;
    case "role":
      await sql`update projects set role = ${cleanValue} where id = ${projectId}`;
      break;
    case "duration":
      await sql`update projects set duration = ${cleanValue} where id = ${projectId}`;
      break;
    case "client":
      await sql`update projects set client = ${cleanValue} where id = ${projectId}`;
      break;
    case "year": {
      const yearNum = parseInt(value, 10);
      if (!Number.isInteger(yearNum) || String(yearNum) !== String(value).trim()) {
        return res.status(400).json({ error: "year must be a whole number, e.g. 2024" });
      }
      await sql`update projects set year = ${yearNum} where id = ${projectId}`;
      break;
    }
    case "highlightTitle":
      await sql`update projects set highlight_title = ${cleanValue} where id = ${projectId}`;
      break;
    case "highlightSubtitle":
      await sql`update projects set highlight_subtitle = ${cleanValue} where id = ${projectId}`;
      break;
    case "highlightDescription":
      await sql`
        update projects
        set highlight_description = ${cleanValue}, highlight_source = 'manual'
        where id = ${projectId}
      `;
      break;
    case "takeawayTitle":
      await sql`update projects set takeaway_title = ${cleanValue} where id = ${projectId}`;
      break;
    case "takeawaySubtitle":
      await sql`update projects set takeaway_subtitle = ${cleanValue} where id = ${projectId}`;
      break;
    case "takeawayDescription":
      await sql`
        update projects
        set takeaway_description = ${cleanValue}, takeaway_source = 'manual'
        where id = ${projectId}
      `;
      break;
    case "challenges":
      await sql`
        update projects
        set challenges = ${cleanValue}, challenges_source = 'manual'
        where id = ${projectId}
      `;
      break;
    case "futureImprovements":
      await sql`
        update projects
        set future_improvements = ${cleanValue}, future_improvements_source = 'manual'
        where id = ${projectId}
      `;
      break;
  }

  const rebuild = await triggerRebuild();

  return res.status(200).json({ success: true, rebuild });
}