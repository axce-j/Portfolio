// api/save-media.ts
//
// Step 3 of the upload flow (step 2 is the browser's direct upload to
// Cloudinary, which never touches our server — see
// cloudinary-signature.ts). Called with the resulting Cloudinary URL
// plus metadata. Payload here is tiny (a URL string, not file bytes),
// so no size-limit concern.
//
// mediaType "video" always goes into project_media, tagged with
// video_role — unchanged from before.
//
// mediaType "image" now branches on imageTarget:
//   - "hero"      → overwrites projects.hero_image(_alt) directly
//   - "highlight" → overwrites projects.highlight_image(_alt) directly
//   - "gallery"   → inserts into project_media as before, but now
//                   with a real incrementing sort_order instead of
//                   always 0, so newly uploaded images append to the
//                   end of the gallery instead of all competing for
//                   the same position.
// imageTarget defaults to "gallery" if omitted, so any old client
// code that doesn't send it keeps behaving exactly as before.

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { neon } from "@neondatabase/serverless";
import { triggerRebuild } from "./_lib/triggerRebuild.js";

const sql = neon(process.env.DATABASE_URL!);

const VALID_VIDEO_ROLES = ["client_demo", "architecture", "reflection"];
const VALID_IMAGE_TARGETS = ["hero", "highlight", "gallery"];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    password,
    projectSlug,
    mediaType,
    url,
    caption,
    videoRole,
    imageTarget: rawImageTarget,
  } = req.body ?? {};

  if (!password || password !== process.env.ADMIN_UPLOAD_PASSWORD) {
    return res.status(401).json({ error: "Invalid password" });
  }
  if (!projectSlug || !mediaType || !url) {
    return res.status(400).json({ error: "projectSlug, mediaType, and url are required" });
  }
  if (mediaType !== "image" && mediaType !== "video") {
    return res.status(400).json({ error: "mediaType must be 'image' or 'video'" });
  }
  if (mediaType === "video" && !VALID_VIDEO_ROLES.includes(videoRole)) {
    return res.status(400).json({
      error: `video uploads require videoRole to be one of: ${VALID_VIDEO_ROLES.join(", ")}`,
    });
  }

  const imageTarget = mediaType === "image" ? (rawImageTarget || "gallery") : null;
  if (mediaType === "image" && !VALID_IMAGE_TARGETS.includes(imageTarget)) {
    return res.status(400).json({
      error: `imageTarget must be one of: ${VALID_IMAGE_TARGETS.join(", ")}`,
    });
  }

  const projectRows = await sql`select id from projects where slug = ${projectSlug}`;
  if (projectRows.length === 0) {
    return res.status(404).json({ error: `No project found with slug '${projectSlug}'` });
  }
  const projectId = projectRows[0].id;

  if (imageTarget === "hero") {
    await sql`
      update projects
      set hero_image = ${url}, hero_image_alt = ${caption ?? null}
      where id = ${projectId}
    `;
  } else if (imageTarget === "highlight") {
    await sql`
      update projects
      set highlight_image = ${url}, highlight_image_alt = ${caption ?? null}
      where id = ${projectId}
    `;
  } else {
    // Gallery image, or any video — both live in project_media.
    // Gallery images get a real next-in-line sort_order; videos keep
    // the table default (0), since the video grid is a fixed 3-slot
    // layout keyed by video_role, not order-dependent.
    let sortOrder = 0;
    if (mediaType === "image") {
      const orderRows = await sql`
        select coalesce(max(sort_order), -1) + 1 as next_order
        from project_media
        where project_id = ${projectId} and media_type = 'image'
      `;
      sortOrder = orderRows[0].next_order;
    }

    await sql`
      insert into project_media (project_id, media_type, url, caption, video_role, sort_order)
      values (
        ${projectId},
        ${mediaType},
        ${url},
        ${caption ?? null},
        ${mediaType === "video" ? videoRole : null},
        ${sortOrder}
      )
    `;
  }

  const rebuild = await triggerRebuild();

  return res.status(200).json({ success: true, rebuild });
}