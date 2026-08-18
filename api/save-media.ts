// api/save-media.ts
//
// Step 3 of the upload flow (step 2 is the browser's direct upload to
// Cloudinary, which never touches our server — see
// cloudinary-signature.ts). Called with the resulting Cloudinary URL
// plus metadata; inserts one row into project_media. Payload here is
// tiny (a URL string, not file bytes), so no size-limit concern.

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { neon } from "@neondatabase/serverless";
import { triggerRebuild } from "./_lib/triggerRebuild.js";

const sql = neon(process.env.DATABASE_URL!);

const VALID_VIDEO_ROLES = ["client_demo", "architecture", "reflection"];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { password, projectSlug, mediaType, url, caption, videoRole } = req.body ?? {};

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

  const projectRows = await sql`select id from projects where slug = ${projectSlug}`;
  if (projectRows.length === 0) {
    return res.status(404).json({ error: `No project found with slug '${projectSlug}'` });
  }
  const projectId = projectRows[0].id;

  await sql`
    insert into project_media (project_id, media_type, url, caption, video_role)
    values (
      ${projectId},
      ${mediaType},
      ${url},
      ${caption ?? null},
      ${mediaType === "video" ? videoRole : null}
    )
  `;

  const rebuild = await triggerRebuild();

  return res.status(200).json({ success: true, rebuild });
}