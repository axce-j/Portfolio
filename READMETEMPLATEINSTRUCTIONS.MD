# README Structure — Required Format for Portfolio-Linked Repos

**Purpose:** every repo that should appear on the portfolio must follow
this exact structure. The build pipeline (`syncGithub.ts` →
`convergeProjects.ts` → `buildPortfolio.ts`) parses README content
automatically using these headings, verbatim. A heading spelled
differently, reordered, or missing means that section stays empty on
the live site — the pipeline warns about it in the build log, but does
not fail the build.

## Repository settings (not README, but required)

- **Name:** lowercase, hyphenated, descriptive (`team-task-tracker`,
  not `Task-Calendar`)
- **Description:** one or two sentences — this is the fallback used if
  `projects.description` hasn't been hand-written yet
- **Topics:** at minimum one category signal
  (`frontend`/`backend`/`mobile`/`design`/`full-stack`) plus real tech
  names (`react`, `nextjs`, `postgresql`, etc. — see
  `githubAdapter.ts`'s `KNOWN_TECH_TOPICS` for the current recognized
  list; unrecognized tech topics are harmless, just won't populate
  `tech_stack` via the topic-fallback path)
- **Homepage field:** set to the live deployed URL
- **A release:** at minimum `v1.0.0`, tagged via GitHub's Releases UI

These four — description, topics, homepage, and a release — are also
your **publish checklist**: a project needs all four before it
auto-publishes.

## Required README sections, in this exact order

### 1. Title + intro (no heading needed)
Project name as `# Heading`, followed by 2-4 short paragraphs: what it
is, why you built it, what it does, and — if true — where it sits in
your growth as a developer. This is prose for a human reader
(recruiter, visitor), not parsed by the pipeline.

### `## Live Demo`
Just the URL, on its own line. (Also captured via the repo's Homepage
field — having both is fine, redundant is safer than missing.)

### `## Screenshots`
List of expected screenshots, one `### Label` per shot, e.g.:
```
### Home Page
### Search & Filtering
### Mobile View
```
This section is a **checklist for you**, not something the pipeline
parses — the actual gallery images are uploaded separately (see
"Images" below). Aim for ~16 for an average project: cover the main
views, at least one mobile/responsive shot, and any distinctive UI
moments worth showing off.

### `## Demo Videos`
Three required, each on its own line, labeled exactly like this:
```
## Demo Videos

- Client Walkthrough: <url>
- Architecture & Decisions: <url>
- Developer Reflection: <url>
```
These three labels are fixed and parsed automatically — don't rename
them. See "Videos" below for how to host and get the `<url>`.

### `## Features`
**Structured format** — each feature is its own `### ` sub-heading,
followed by a one-line italic subtitle, then a short prose
description:
```
### Real-Time Risk Engine
*Fast calculations without friction*

Inputs update calculations instantly with debounced state handling...
```
This becomes one `project_features` row automatically (title,
subtitle, and description all populated). Legacy plain bullet lists
(no `### ` sub-headings) still work for backward compatibility, but
only produce a title — no subtitle or description.

### `## Technologies Used`
Bullet list (flat, or grouped under `### Frontend` / `### Backend` /
etc. sub-headings — both parse fine). This **overrides** the
topic-based tech stack guess — more accurate, since you're naming the
real dependencies, not just what happened to become a GitHub topic.

### `## Architecture Highlights`
**This exact heading, spelled exactly this way.** One paragraph (or a
short bullet list) describing the single most interesting technical
decision in the project — this becomes `highlight.description`. If
this heading is missing or misspelled, `highlight` stays empty on the
site and the pipeline logs a warning.

### `## Challenges`
Bullet list of real difficulties encountered. Its own dedicated
section on the site — not folded into anything else.

### `## What I Learned`
**Prose, 1-2 sentences — not a bullet list.** Combined with
`Looking Back` below into the site's single `Takeaway` (Reflection)
section, rendered as one short centered paragraph. If either this or
`Looking Back` is written as bullets, the combined result renders as
a list instead of a paragraph.

### `## Looking Back`
**Prose, one short reflective paragraph — not a bullet list.**
Combined with `What I Learned` above, the two should read as ONE
tight paragraph, 3-5 sentences total. Tone: wisdom and hindsight, not
a technical recap — what you'd actually tell another engineer if
they asked what you took away from the project.

### `## Future Improvements`
Bullet list — becomes its own `future_improvements` section on the
site.

### `## Author`
Standard author block. Not parsed — purely for anyone reading the
README directly on GitHub.

## Images

Screenshots are **not** pulled from the project repo, and **not**
self-hosted in the portfolio repo either — at 150-250+ images across
projects and other pages, committing them to git would bloat the repo
permanently (git never shrinks from binary history, even after
deleting a file).

Instead: **Cloudinary free tier.** Upload compressed screenshots there
— Cloudinary auto-converts format and serves responsive sizes, so you
don't have to manually compress and resize every image yourself (this
is what caused the 5MB-image mistake earlier — Cloudinary removes that
failure mode entirely). Store the resulting Cloudinary URL in
`project_media.url` (`media_type = 'image'`) — no schema change
needed, that column is already a generic URL string.

Cloudinary's upload API also means this step can be automated later
(script-driven bulk upload) instead of staying a manual per-image task
forever — matches the direction this is headed as the project count
and image count keeps growing.

## Videos

2-3 minutes max each, one per role (`client_demo` / `architecture` /
`reflection`). **Upload exclusively through the admin page** — that's
the only mechanism that writes a video into `project_media`. Paste
the resulting Cloudinary URL into the README's `## Demo Videos`
section too, under the matching label, purely as a human-readable
record of what's live — but be clear that pasting it there does
**nothing** on its own. (An earlier version of this doc claimed the
pipeline "picks it up from there automatically" — it doesn't; the
parser reads the section for the missing-heading warning only, it's
never written into the database from README content.)

(Earlier drafts of this doc pointed at GitHub's attachment CDN for
video hosting. That's no longer correct either — the admin upload page
(Phase 2E) needs an upload API to write to, and GitHub attachments
don't have one, so video hosting moved to Cloudinary alongside images.)

## What happens if a repo doesn't follow this format

- Missing `Architecture Highlights` → `highlight` stays empty, pipeline
  logs a warning naming the repo
- Missing `Challenges`, `What I Learned`, `Looking Back`, or
  `Future Improvements` → that section stays empty, same warning
  pattern
- Missing `Features` or `Technologies Used` → falls back to
  topic-based inference (weaker, but not empty)
- None of this ever blocks the build or the pipeline — a
  non-conforming repo just shows less on its project page until its
  README is updated