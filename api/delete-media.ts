// api/delete-media.ts
//
// Permanently deletes ONE thing — either a project_media row (a
// gallery image or a video) or the hero/highlight image on the
// project itself — from BOTH Cloudinary and the database. There's no
// separate "delete all gallery" or "prune project" endpoint here on
// purpose: the Visual Editor composes those as a batch of individual
// calls to this same endpoint (one per item), the same way multiple
// feature deletions already work — staged locally first (so
// "Discard changes" can still undo an accidental click), then
// flushed one at a time when Save runs. Keeps this endpoint, and the
// failure mode when something partway through a bulk delete goes
// wrong, simple and uniform rather than needing its own separate
// partial-failure story.
//
// public_id is deliberately not a stored column — see
// _lib/cloudinaryDestroy.ts for how it's derived from the URL
// instead, which works retroactively on every image ever uploaded.

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { neon } from "@neondatabase/serverless";
import { triggerRebuild } from "./_lib/triggerRebuild.js";
import { destroyCloudinaryAsset } from "./_lib/cloudinaryDestroy.js";

const sql = neon(process.env.DATABASE_URL!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { password, projectSlug, mediaId, target } = req.body ?? {};

  if (!password || password !== process.env.ADMIN_UPLOAD_PASSWORD) {
    return res.status(401).json({ error: "Invalid password" });
  }
  if (!projectSlug) {
    return res.status(400).json({ error: "projectSlug is required" });
  }
  if (!mediaId && target !== "hero" && target !== "highlight") {
    return res.status(400).json({ error: "Provide either mediaId, or target: 'hero' | 'highlight'" });
  }

  const projectRows = await sql`
    select id, hero_image, highlight_image from projects where slug = ${projectSlug}
  `;
  if (projectRows.length === 0) {
    return res.status(404).json({ error: `No project found with slug '${projectSlug}'` });
  }
  const project = projectRows[0];

  try {
    if (target === "hero") {
      await destroyCloudinaryAsset(project.hero_image);
      await sql`update projects set hero_image = null, hero_image_alt = null where id = ${project.id}`;
    } else if (target === "highlight") {
      await destroyCloudinaryAsset(project.highlight_image);
      await sql`update projects set highlight_image = null, highlight_image_alt = null where id = ${project.id}`;
    } else {
      const rows = await sql`
        select url from project_media where id = ${mediaId} and project_id = ${project.id}
      `;
      if (rows.length === 0) {
        return res.status(404).json({ error: "That media item doesn't belong to this project (or is already gone)" });
      }
      await destroyCloudinaryAsset(rows[0].url);
      await sql`delete from project_media where id = ${mediaId}`;
    }
  } catch (err) {
    // Deliberately does NOT touch the database if the Cloudinary
    // delete fails — better to leave a row pointing at a still-live
    // asset than to claim "deleted" while it's still sitting on the
    // CDN. Safe to just retry: destroying an already-gone public_id
    // is treated as a success (see cloudinaryDestroy.ts's "not
    // found" handling), so a retry after a partial failure is safe.
    return res.status(500).json({
      error: err instanceof Error ? err.message : "Cloudinary deletion failed — nothing was removed",
    });
  }

  const rebuild = await triggerRebuild();
  return res.status(200).json({ success: true, rebuild });
}