// api/list-features.ts
//
// Read-side for feature management. Returns every project_features
// row for one project, in display order, so the admin page can show
// what exists before you add/edit/delete anything.

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

  const projectRows = await sql`select id from projects where slug = ${projectSlug}`;
  if (projectRows.length === 0) {
    return res.status(404).json({ error: `No project found with slug '${projectSlug}'` });
  }
  const projectId = projectRows[0].id;

  const features = await sql`
    select id, title, subtitle, description, image, image_alt, sort_order, source
    from project_features
    where project_id = ${projectId}
    order by sort_order asc
  `;

  return res.status(200).json({
    features: features.map((f) => ({
      id: f.id,
      title: f.title,
      subtitle: f.subtitle,
      description: f.description,
      image: f.image,
      imageAlt: f.image_alt,
      sortOrder: f.sort_order,
      source: f.source,
    })),
  });
}