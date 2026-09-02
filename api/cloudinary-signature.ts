// api/cloudinary-signature.ts
//
// Step 1 of the upload flow. Validates the admin password, then
// returns a short-lived signed payload the browser uses to upload
// directly to Cloudinary — the file's bytes never pass through this
// function, avoiding Vercel's ~4.5MB serverless request body limit
// (which a multi-minute video would very likely exceed if proxied
// through our own server, as the original single-endpoint plan
// described).
//
// Password is still checked server-side on every call, per the
// project's "single shared password, checked server-side only, never
// in client code" rule — this endpoint doesn't relax that, it just
// splits the upload into two round trips instead of one.

import type { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "crypto";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { password } = req.body ?? {};
  if (!password || password !== process.env.ADMIN_UPLOAD_PASSWORD) {
    return res.status(401).json({ error: "Invalid password" });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    console.error("Missing Cloudinary env vars");
    return res.status(500).json({ error: "Server misconfigured" });
  }

  const folder = "portfolio";
  const timestamp = Math.floor(Date.now() / 1000);

  // Cloudinary's signature scheme: sort every param that will be sent
  // (except file/api_key/signature/resource_type), join as
  // "key=value&key2=value2", append the API secret, SHA-1 it.
  const paramsToSign: Record<string, string | number> = { timestamp, folder };
  const toSign = Object.keys(paramsToSign)
    .sort()
    .map((k) => `${k}=${paramsToSign[k]}`)
    .join("&");
  const signature = crypto.createHash("sha1").update(toSign + apiSecret).digest("hex");

  return res.status(200).json({ cloudName, apiKey, timestamp, signature, folder });
}