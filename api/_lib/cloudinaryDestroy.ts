// api/_lib/cloudinaryDestroy.ts
//
// Permanently removes an asset from Cloudinary itself, not just a DB
// row. Cloudinary's destroy endpoint needs a `public_id` — we never
// stored that separately, but it's recoverable directly from the
// secure_url every upload already saves, so no new DB column is
// needed and this works retroactively on media uploaded before this
// existed.
//
// URL shape: https://res.cloudinary.com/<cloud>/<image|video>/upload/v<version>/<public_id>.<ext>
// public_id keeps any folder prefix (e.g. "portfolio/abc123").

import crypto from "crypto";

function extractPublicId(url: string): { publicId: string; resourceType: "image" | "video" } | null {
  const match = url.match(/\/(image|video)\/upload\/(?:v\d+\/)?([^?#]+)\.[a-zA-Z0-9]+(?:[?#].*)?$/);
  if (!match) return null;
  const [, resourceType, publicId] = match;
  return { publicId, resourceType: resourceType as "image" | "video" };
}

/**
 * Deletes the Cloudinary asset backing `url`. Resolves quietly
 * (never throws) if the URL isn't a recognizable Cloudinary URL —
 * that shouldn't happen given how this app uploads media, but if it
 * ever did, failing to parse it shouldn't block removing the DB
 * reference that called this. Throws only on an actual Cloudinary
 * API error (bad credentials, network failure), which callers should
 * surface — a silent failure there would leave orphaned files paying
 * for storage forever with no way to know.
 */
export async function destroyCloudinaryAsset(url: string | null | undefined): Promise<void> {
  if (!url) return;
  const extracted = extractPublicId(url);
  if (!extracted) {
    console.warn(`Could not parse a Cloudinary public_id from URL, skipping CDN delete: ${url}`);
    return;
  }
  const { publicId, resourceType } = extracted;

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Server misconfigured: missing Cloudinary env vars");
  }

  const timestamp = Math.floor(Date.now() / 1000);
  // Same signing scheme as cloudinary-signature.ts: sort the params
  // being signed, join as key=value&key2=value2, append the secret, SHA-1.
  const paramsToSign: Record<string, string | number> = { public_id: publicId, timestamp };
  const toSign = Object.keys(paramsToSign)
    .sort()
    .map((k) => `${k}=${paramsToSign[k]}`)
    .join("&");
  const signature = crypto.createHash("sha1").update(toSign + apiSecret).digest("hex");

  const form = new URLSearchParams();
  form.set("public_id", publicId);
  form.set("timestamp", String(timestamp));
  form.set("api_key", apiKey);
  form.set("signature", signature);

  const destroyRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/destroy`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form,
  });
  if (!destroyRes.ok) {
    throw new Error(`Cloudinary destroy request failed (${destroyRes.status})`);
  }
  const data = await destroyRes.json();
  // Cloudinary returns { result: "ok" } on success, { result: "not found" }
  // if it's already gone — both are acceptable outcomes for a delete;
  // anything else (e.g. "not authorized") is worth surfacing.
  if (data.result !== "ok" && data.result !== "not found") {
    throw new Error(`Cloudinary destroy failed: ${data.result ?? "unknown error"}`);
  }
}