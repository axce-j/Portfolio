// api/save-feature.ts
//
// Write-side for feature management — handles both "add a new
// feature" (no featureId) and "edit an existing one" (featureId
// provided). Either way, the row ends up tagged source = 'manual',
// so the next README sync (convergeProjects.ts's
// syncFeaturesFromReadme, which only ever deletes/reinserts
// source = 'readme' rows) will never touch it again.
//
// Image is optional on every call: omit it to leave the existing
// image untouched (editing just the text), or include a Cloudinary
// URL (already uploaded via cloudinary-signature.ts + a direct
// browser upload, same pattern as the main media uploader) to set or
// replace it.

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { neon } from "@neondatabase/serverless";
import { triggerRebuild } from "./_lib/triggerRebuild.js";

const sql = neon(process.env.DATABASE_URL!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    password,
    projectSlug,
    featureId,
    title,
    subtitle,
    description,
    image,
    imageAlt,
  } = req.body ?? {};

  if (!password || password !== process.env.ADMIN_UPLOAD_PASSWORD) {
    return res.status(401).json({ error: "Invalid password" });
  }
  if (!projectSlug || !title) {
    return res.status(400).json({ error: "projectSlug and title are required" });
  }

  const projectRows = await sql`select id from projects where slug = ${projectSlug}`;
  if (projectRows.length === 0) {
    return res.status(404).json({ error: `No project found with slug '${projectSlug}'` });
  }
  const projectId = projectRows[0].id;

  const cleanSubtitle = subtitle || null;
  const cleanDescription = description || "";

  if (featureId) {
    // Editing an existing row (README-sourced or already-manual —
    // either way, it becomes 'manual' now). Image only updates if a
    // new URL was actually provided; omitting it (undefined) leaves
    // the existing image column untouched via COALESCE.
    const existing = await sql`
      select id from project_features where id = ${featureId} and project_id = ${projectId}
    `;
    if (existing.length === 0) {
      return res.status(404).json({ error: "Feature not found for this project" });
    }

    await sql`
      update project_features
      set
        title = ${title},
        subtitle = ${cleanSubtitle},
        description = ${cleanDescription},
        image = coalesce(${image ?? null}, image),
        image_alt = coalesce(${imageAlt ?? null}, image_alt),
        source = 'manual'
      where id = ${featureId}
    `;

    const rebuild = await triggerRebuild();
    return res.status(200).json({ success: true, featureId, rebuild });
  }

  // Adding a new feature — appended after whatever currently has the
  // highest sort_order for this project (README-sourced or manual,
  // doesn't matter, they share one ordered list on the page).
  const orderRows = await sql`
    select coalesce(max(sort_order), -1) + 1 as next_order
    from project_features
    where project_id = ${projectId}
  `;
  const nextOrder = orderRows[0].next_order;

  const inserted = await sql`
    insert into project_features (project_id, sort_order, title, subtitle, description, image, image_alt, source)
    values (${projectId}, ${nextOrder}, ${title}, ${cleanSubtitle}, ${cleanDescription}, ${image ?? null}, ${imageAlt ?? null}, 'manual')
    returning id
  `;

  const rebuild = await triggerRebuild();
  return res.status(200).json({ success: true, featureId: inserted[0].id, rebuild });
}