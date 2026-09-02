# Portfolio

My personal software engineering portfolio — and, deliberately, also
the project that best demonstrates how I think about reducing
repeated work. Every other project on this site gets described here
automatically: write a normal README in that project's own GitHub
repo, and this site parses it, pulls out the features, the
architecture decisions, the real challenges, and turns it into a
formatted project page — no separate copy-pasting into a CMS, no
duplicate source of truth to keep in sync by hand.

The site itself is a static React app that never talks to a database
at request time. A build-time pipeline pulls from GitHub and a Neon
Postgres database, merges the two, and writes one JSON file the app
reads. A hidden, password-gated admin system — reachable only through
an intentionally obscure trigger, not linked anywhere — lets me edit
copy and upload media without touching code or redeploying by hand.

## Live Demo
https://portfolio-2-theta-flame.vercel.app

## Screenshots
### Home
### Projects grid
### Single project page — Hero and Features
### Single project page — Highlight and Gallery
### Career timeline
### Admin — Visual Editor

## Features

### README-Driven Project Pages
*Write once, on GitHub, like you already do*

Every project page on this site is generated from that project's own
README, parsed against a fixed heading structure (features,
architecture highlights, challenges, reflection, future improvements).
Push a conforming README to a public repo and the project appears on
the next rebuild — no manual entry into a separate system.

### Manual-Edit-Wins Precedence
*Automation without losing hand-tuned copy*

Every README-derived field is protected by a per-field `*_source`
column (`manual` vs `readme` vs `inferred`). Editing something by
hand — through the admin page or directly in the database — marks it
as permanently yours; the automatic sync will never quietly overwrite
it again on a later rebuild.

### Permanent, Tombstoned Feature Deletes
*A delete should actually stay deleted*

Deleting a project feature writes a tombstone row keyed to its
normalized title before removing it, checked by the README sync on
every future rebuild. This closed a real bug where deleting a
README-sourced feature reappeared on the very next automatic rebuild
— the same one the delete itself triggered.

### Hidden, Password-Gated Admin System
*Real security from the password, not the obscurity*

A 7-click sequence or a typed secret phrase reveals a route that also
rotates automatically on a schedule, so an accidentally-shared link
stops working within a day. That rotation is intentionally not the
real security layer — every admin write is independently validated
against a server-only password on every single request.

### In-Context Visual Editing
*Edit the real page, not a disconnected form*

The admin page's Visual Editor renders the actual public project-page
components with hover-to-replace image overlays and inline edit
panels layered directly on top — the same components the live site
uses, so there's no guessing what a change will look like before
saving.

### Uncropped Image Rendering at Any Aspect Ratio
*A screenshot's content should never get silently cut off*

Every fixed-aspect image slot (hero, feature, highlight, gallery)
renders through a shared component that shows the full, uncropped
image over a blurred fill of the same image, rather than
`object-fit: cover`-cropping screenshots and code editor captures of
wildly different aspect ratios down to a fixed box.

## Technologies Used

### Frontend
- React 19, TypeScript, Vite 7
- React Router
- Tailwind CSS, Radix UI primitives, `class-variance-authority`
- Swiper (carousels), Lucide (icons)

### Backend / Infrastructure
- Vercel serverless functions (Node)
- Neon (serverless Postgres)
- Cloudinary (image/video hosting, signed direct-browser upload)
- GitHub REST API (repo/README sync source)
- Vercel Deploy Hooks (production rebuild trigger)

### Tooling
- `tsx` (running the sync/converge/build pipeline scripts)
- ESLint + `typescript-eslint`

## Architecture Highlights

The site is intentionally static rather than database-backed at
request time. A three-stage build pipeline — `syncGithub.ts` →
`convergeProjects.ts` → `buildPortfolio.ts` — pulls raw repo and
README data into Neon, merges it with hand-edited fields under a
manual-wins precedence system, and writes a single
`portfolio.generated.json` that's the only thing the live React app
ever reads. The tradeoff this creates — a database write from the
admin page isn't visible on the live site until a rebuild happens —
is handled by having every admin write endpoint trigger that rebuild
automatically: directly in-process during local development, or via a
Vercel Deploy Hook in production, branching on a single
`process.env.VERCEL_ENV` check.

## Challenges

- Vercel Production's branch tracking silently mismatched the branch
  actual work happened on, so deployments built successfully but
  never auto-promoted to the live domain — several other causes were
  ruled out first before finding this one.
- A README-sync bug caused feature rows to duplicate (an auto-synced
  row and a manually-edited row coexisting instead of one replacing
  the other) and made feature deletes non-permanent, since the sync
  that reinstated them ran on every rebuild — including the one the
  delete itself triggered.
- Node's ESM loader requires explicit `.js` extensions on relative
  imports even for `.ts` source files under `moduleResolution:
  "node16"`/`"nodenext"` — missing this produced a build-time warning
  Vercel doesn't fail on, but a hard runtime `ERR_MODULE_NOT_FOUND`.
- Fixed-aspect image containers using `object-fit: cover` silently
  cropped screenshots and code-editor captures of varying aspect
  ratios, sometimes cutting off the actual content being shown off.
- `vercel dev`'s local proxy doesn't get along with the SPA fallback
  rewrite in `vercel.json`, requiring a documented local-only
  workaround (temporarily blanking the file) that once leaked into a
  real commit and caused a production 404.

## What I Learned

Automating away repeated work is only actually a win once the
automation is trustworthy enough that you stop double-checking it by
hand — getting there took more edge-case handling than the initial
version of the sync pipeline accounted for.

## Looking Back

The parts of this project that took the longest weren't the obviously
hard technical pieces — they were the quiet edge cases in a system
meant to run unattended, like a delete that doesn't actually stay
deleted, or a deploy that builds but never goes live. Building your
own portfolio ends up being a decent forcing function for exactly
that kind of rigor, because you're both the developer and the only
user who'll notice when something's silently wrong.

## Future Improvements

- Structured "which slot" targeting for every uploaded image type
  (not just hero/highlight), instead of a flat gallery fallback
- Media reordering — `sort_order` currently always `0`
- A stable per-feature identifier independent of title, so renaming a
  feature in a README doesn't parse as a brand-new one
- Wire the README's `## Demo Videos` section to actually populate
  `project_media`, instead of remaining documentation-only
- Rewrite this repo's own README to the same structured format every
  other project already uses

## Author

**Ezeani Obinna Jachike**
GitHub: [@axce-j](https://github.com/axce-j)