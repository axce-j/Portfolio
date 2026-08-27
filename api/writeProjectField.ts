// api/_lib/writeProjectField.ts
//
// The actual per-field UPDATE logic, extracted out of
// save-project-text.ts so save-project-text-batch.ts (used by the
// visual editor to save several related fields — e.g. Highlight's
// title+subtitle+description — in one request) can reuse the EXACT
// same validated, fully-static queries instead of duplicating them.
//
// Deliberately does NOT call triggerRebuild() itself — both callers
// decide when to trigger it (the batch endpoint triggers once after
// all fields are written, not once per field).

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export const EDITABLE_FIELDS = [
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

export type FieldKey = (typeof EDITABLE_FIELDS)[number];

export async function writeProjectField(
  projectId: string,
  field: FieldKey,
  value: unknown
): Promise<{ error?: string }> {
  const cleanValue = typeof value === "string" && value.trim().length > 0 ? value : null;

  switch (field) {
    case "tagline":
      await sql`update projects set tagline = ${cleanValue} where id = ${projectId}`;
      return {};
    case "description":
      await sql`update projects set description = ${cleanValue} where id = ${projectId}`;
      return {};
    case "role":
      await sql`update projects set role = ${cleanValue} where id = ${projectId}`;
      return {};
    case "duration":
      await sql`update projects set duration = ${cleanValue} where id = ${projectId}`;
      return {};
    case "client":
      await sql`update projects set client = ${cleanValue} where id = ${projectId}`;
      return {};
    case "year": {
      const yearNum = parseInt(String(value), 10);
      if (!Number.isInteger(yearNum) || String(yearNum) !== String(value).trim()) {
        return { error: "year must be a whole number, e.g. 2024" };
      }
      await sql`update projects set year = ${yearNum} where id = ${projectId}`;
      return {};
    }
    case "highlightTitle":
      await sql`update projects set highlight_title = ${cleanValue} where id = ${projectId}`;
      return {};
    case "highlightSubtitle":
      await sql`update projects set highlight_subtitle = ${cleanValue} where id = ${projectId}`;
      return {};
    case "highlightDescription":
      await sql`
        update projects
        set highlight_description = ${cleanValue}, highlight_source = 'manual'
        where id = ${projectId}
      `;
      return {};
    case "takeawayTitle":
      await sql`update projects set takeaway_title = ${cleanValue} where id = ${projectId}`;
      return {};
    case "takeawaySubtitle":
      await sql`update projects set takeaway_subtitle = ${cleanValue} where id = ${projectId}`;
      return {};
    case "takeawayDescription":
      await sql`
        update projects
        set takeaway_description = ${cleanValue}, takeaway_source = 'manual'
        where id = ${projectId}
      `;
      return {};
    case "challenges":
      await sql`
        update projects
        set challenges = ${cleanValue}, challenges_source = 'manual'
        where id = ${projectId}
      `;
      return {};
    case "futureImprovements":
      await sql`
        update projects
        set future_improvements = ${cleanValue}, future_improvements_source = 'manual'
        where id = ${projectId}
      `;
      return {};
  }
}