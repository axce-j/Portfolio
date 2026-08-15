# README Generation Prompt — Portfolio Projects

**How to use this:** copy everything below the line into a fresh AI
chat (or use it yourself as a checklist), fill in the project facts
at the bottom, and ask for a finished README.md. The instructions are
written to match exactly what `readmeAdapter.ts` parses — not a
general "write me a good README" prompt — so following them precisely
is what makes the site's automated sections actually populate.

---

You are writing a README.md for one of my software engineering
portfolio projects. This isn't a general-purpose README — it feeds an
automated parser on my portfolio site that matches section headings
**exactly**, with no fuzzy matching. A heading spelled differently,
reordered, or written as the wrong type of content will make that
section silently stay empty (or render badly) on the live site — no
error, no warning visible to a visitor, it just won't look right.
Precision matters more than creativity here.

## Hard rules

1. **Never invent technical facts.** Don't fabricate an architecture
   decision, a challenge, or a lesson I didn't actually describe. If
   I haven't given you enough detail for a section, ask me directly
   — a vague or generic-sounding paragraph is worse than an honest
   "I need more detail from you here."
2. **Match every heading exactly** — same spelling, same casing, same
   `##`/`###` level, same order, as listed below. Don't rename,
   reorder, merge, or add extra top-level headings.
3. **Respect the exact format each section expects.** Getting this
   backwards is the most common mistake — see Features and Reflection
   below, both of which have a specific required shape, not a plain
   bullet list.

## Exact structure, in this order

### `# <Project Name>` (title, no `##`)
2-4 short paragraphs: what it is, why I built it, what it does, and
where it sits in my growth as a developer if that's true. This is for
a human reader — not parsed by anything, so it can be as narrative as
it needs to be.

### `## Live Demo`
Just the URL, on its own line. Not parsed (the site gets this from
GitHub's repo Homepage field instead) — include it anyway, for anyone
reading the README directly on GitHub.

### `## Screenshots`
A checklist of `### Label` sub-headings for shots I should capture —
not parsed, purely a reminder for me. Aim for ~4-6 labels covering the
main views plus at least one mobile/responsive shot.

### `## Demo Videos`
Exactly this format, with exactly these three labels — parsed
automatically, and I'll paste in real Cloudinary URLs after
recording:
```
## Demo Videos

- Client Walkthrough: <url>
- Architecture & Decisions: <url>
- Developer Reflection: <url>
```
Don't rename these three labels or add a fourth.

### `## Features`
**Structured format — each feature is its own `### ` sub-heading with
a subtitle and description, NOT a flat bullet list.** Exactly this
shape, repeated once per feature:
```
## Features

### Real-Time Risk Engine
*Fast calculations without friction*

Inputs update calculations instantly with debounced state handling and
memoized computations to avoid unnecessary rerenders. The interface
was designed to remain responsive even while processing multiple
trading variables.

### Mobile-Optimized Trading UI
*Designed for traders on the move*

Special attention was given to mobile ergonomics — larger tap targets,
simplified form grouping, and adaptive layouts ensure the calculator
remains practical on smaller screens without losing information
density.
```
Rules for each feature block:
- `### Title` — 2-5 words, the feature name.
- The very next line, wrapped in single asterisks (`*like this*`) —
  a short italic subtitle, 3-6 words, a tagline not a restatement of
  the title.
- Then a blank line, then 1-3 sentences of prose describing what it
  actually does and why it was built that way. Real implementation
  detail, not marketing copy.
- 3-6 features total is plenty. Pick the ones that show real
  engineering thinking, not every CRUD operation in the app.

### `## Technologies Used`
**Bullet list** — flat, or grouped under `### Frontend` / `### Backend`
sub-headings if that's clearer. This overrides any GitHub-topic-based
guess, so list what's actually in the dependency tree, not just
whatever happened to become a repo topic.

### `## Architecture Highlights`
**This exact heading, spelled exactly this way** — no fallback if
misspelled. One paragraph (or a short bullet list if there are
genuinely 2-3 separate decisions worth calling out) describing the
single most interesting technical decision in the project. Ask me:
"What's the one architecture or implementation decision here you'd
actually want to explain to another engineer?"

### `## Challenges`
**Bullet list.** Real difficulties actually encountered — not generic
"learning React was hard" filler. Ask me for 3-6 specific ones if I
haven't given enough.

### `## What I Learned`
**Prose — 1-2 short sentences, NOT a bullet list.** This gets combined
with Looking Back directly below into a single "Reflection" section on
the site, styled as one short centered paragraph. If either this
section or Looking Back is written as bullets, the combined result
renders as an ugly wall of list items instead of the intended single
paragraph. Keep this brief — one or two genuine takeaways in sentence
form, not a skills inventory.

### `## Looking Back`
**Prose — 1 short paragraph, NOT a bullet list.** Combined with What I
Learned above, the two together should read as ONE tight paragraph,
3-5 sentences total. This is the single most important formatting
rule in this document.

Tone matters as much as format here: **less technical listing, more
wisdom and hindsight.** This is the one section of the whole README
that isn't really about the code — it's what you'd actually say to
someone if they asked "so what did you take away from this?" Match
this register:

> "Building your own portfolio is the highest-stakes design project
> you'll ever ship — because you can't blame the client. Every
> decision is yours. The process forced hard choices about what
> actually matters in a UI and what's just decoration."

That's the target: short, reflective, a little philosophical, zero
bullet points, zero tech-stack name-dropping. Ask me what the honest,
bigger-picture lesson was — not what libraries I used.

### `## Future Improvements`
**Bullet list.** Realistic next steps, not an exhaustive brainstorm —
3-8 items is plenty.

### `## Author`
Standard author block (name, role, GitHub, LinkedIn). Not parsed —
for anyone reading directly on GitHub.

## Before you write anything

Ask me for whatever you don't already have:
- Project name, repo name, live demo URL
- 2-3 real facts to seed the intro paragraphs (what it is, why I
  built it, what problem it solves)
- 3-6 real features, each with: a short title, a punchy subtitle, and
  1-3 sentences of real implementation detail
- The real tech stack (not guessed from the repo topics)
- The one architecture decision most worth explaining
- 3-6 real challenges I hit
- One honest, brief, wisdom-toned reflection (not a list of skills —
  see the tone example above) that I can split naturally across
  "What I Learned" (1-2 sentences) and "Looking Back" (the rest)
- 3-8 realistic future improvements

Once you have real answers for all of these, write the complete
README.md, headings exact, ready for me to paste directly into the
repo.

---

## Project facts (fill in per project)

- **Project / repo name:**
- **Live demo URL:**
- **What it is / why I built it:**
- **Features (title / subtitle / 1-3 sentences each, 3-6 total):**
- **Real tech stack:**
- **Most interesting architecture decision:**
- **Real challenges (3-6):**
- **The honest reflection — what would I actually tell another
  engineer about this project, in my own words, short and wise, not
  technical:**
- **Future improvements (3-8):**