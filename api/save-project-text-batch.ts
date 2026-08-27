// api/save-project-text-batch.ts
//
// Used by the visual editor: a section like Highlight has three
// related fields (title, subtitle, description) that get edited
// together in one panel. Saving them individually via
// save-project-text.ts would mean 3 requests and 3 separate rebuild
// triggers for what's conceptually one edit. This endpoint takes an
// array of {field, value} pairs, writes them all via the same
// validated writeProjectField logic save-project-text.ts uses, and
// triggers exactly one rebuild at the end.

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { neon } from "@neondatabase/serverless";
import { triggerRebuild } from "./_lib/triggerRebuild.js";
import { EDITABLE_FIELDS, FieldKey, writeProjectField } from "./writeProjectField.js";
 
const sql = neon(process.env.DATABASE_URL!);

type FieldUpdate = { field: string; value: unknown };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { password, projectSlug, fields } = req.body ?? {};

  if (!password || password !== process.env.ADMIN_UPLOAD_PASSWORD) {
    return res.status(401).json({ error: "Invalid password" });
  }
  if (!projectSlug) {
    return res.status(400).json({ error: "projectSlug is required" });
  }
  if (!Array.isArray(fields) || fields.length === 0) {
    return res.status(400).json({ error: "fields must be a non-empty array of {field, value}" });
  }
  for (const f of fields as FieldUpdate[]) {
    if (!EDITABLE_FIELDS.includes(f.field as FieldKey)) {
      return res.status(400).json({ error: `field must be one of: ${EDITABLE_FIELDS.join(", ")}` });
    }
  }

  const projectRows = await sql`select id from projects where slug = ${projectSlug}`;
  if (projectRows.length === 0) {
    return res.status(404).json({ error: `No project found with slug '${projectSlug}'` });
  }
  const projectId = projectRows[0].id;

  for (const f of fields as FieldUpdate[]) {
    const result = await writeProjectField(projectId, f.field as FieldKey, f.value);
    if (result.error) {
      return res.status(400).json({ error: `${f.field}: ${result.error}` });
    }
  }

  const rebuild = await triggerRebuild();

  return res.status(200).json({ success: true, rebuild });
}