// api/save-project-text.ts
//
// Single-field write, used by the Edit Text tab's field-picker form.
// The actual per-field UPDATE logic lives in
// _lib/writeProjectField.ts, shared with save-project-text-batch.ts
// (used by the visual editor to save several fields in one request).

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { neon } from "@neondatabase/serverless";
import { triggerRebuild } from "./_lib/triggerRebuild.js";
import { EDITABLE_FIELDS, FieldKey, writeProjectField } from "./writeProjectField.js";
 
const sql = neon(process.env.DATABASE_URL!);

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

  const result = await writeProjectField(projectId, field as FieldKey, value);
  if (result.error) {
    return res.status(400).json({ error: result.error });
  }

  const rebuild = await triggerRebuild();

  return res.status(200).json({ success: true, rebuild });
}