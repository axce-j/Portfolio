┌──────────────────────────────────────────────────────────────────┐
│  ← Back                                                           │
│                                                                    │
│                        [ HERO IMAGE ]                             │
│                     (full width banner)                           │
│                                                                    │
└──────────────────────────────────────────────────────────────────┘

┌───────────────────────────────┐  ┌───────────────────────────────┐
│  PROJECT                       │  │  PROJECT DETAILS               │
│  anime-streaming-clone         │  │  ─────────────────────────     │
│                                 │  │  Year         2026              │
│  A discovery platform for      │  │  Role         Frontend Dev      │
│  anime, without the streaming. │  │  Client       —                 │
│  ← tagline                     │  │  Duration     —                 │
│                                 │  │                                 │
│  Feature-rich anime streaming  │  │  Tech Stack                    │
│  platform clone built with...  │  │  [React][Vite][Router][Query]  │
│  ← description                 │  │  [Chakra][Framer][Axios][Swiper]│
│                                 │  └───────────────────────────────┘
│  [react][javascript][frontend] │
│  [pagination][react-router]... │
│  ← tags                        │
│                                 │
│  [GitHub]  [Live]              │
│  ← links                       │
└───────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│  FEATURES                                                          │
│  ──────────────────────────────────────────────────────────────  │
│                                                                    │
│  ┌────────────────────────┐  ┌────────────────────────┐          │
│  │ Anime search             │  │  [ feature image ]      │          │
│  │ functionality             │  │                          │          │
│  │ ...description...        │  │                          │          │
│  └────────────────────────┘  └────────────────────────┘          │
│                    ⌄ connector                                    │
│  ┌────────────────────────┐  ┌────────────────────────┐          │
│  │ Pagination system         │  │  [ feature image ]      │          │
│  │ ...description...         │  │                          │          │
│  └────────────────────────┘  └────────────────────────┘          │
│                    ⌄ connector                                    │
│  ┌────────────────────────┐  ┌────────────────────────┐          │
│  │ Dynamic data fetching      │  │  [ feature image ]      │          │
│  │ ...description...          │  │                          │          │
│  └────────────────────────┘  └────────────────────────┘          │
└──────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────┐  ┌────────────────────────┐
│  [ highlight image ]                    │  │  HIGHLIGHT                │
│                                          │  │  ─────────────            │
│                                          │  │  API Integration           │
│                                          │  │  Working around Jikan's    │
│                                          │  │  lack of streaming data    │
└──────────────────────────────────────────┘  └────────────────────────┘
   ↑ teal accent — only renders if a highlight has been written

┌──────────────────────────────────────────────────────────────────┐
│  CHALLENGES                                    ← amber accent      │
│  ──────────────────────────────────────────────────────────────  │
│  • Managing API refetching behaviour                                │
│  • Synchronizing URL params with state                              │
│  • ...                                                                │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                          REFLECTION                                 │
│                                                                     │
│                     TAKEAWAY: What I Learned                        │
│                                                                     │
│   "This project marked a major transition in my development         │
│    journey — from static websites to feature-rich frontend           │
│    applications..."                                                  │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│  FUTURE IMPROVEMENTS                          ← violet accent      │
│  ──────────────────────────────────────────────────────────────  │
│  • Auth · Watchlists · PWA support · ...                            │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│  Gallery                                                            │
│  ──────────────────────────────────────────────────────────────  │
│  [img] [img] [img] [img]     ← horizontal scroll, lazy-loaded,     │
│  Home  Details Search  Mobile   from admin-page image uploads       │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│  Demo Videos                                                        │
│  ──────────────────────────────────────────────────────────────  │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐             │
│  │ Client       │   │ Architecture│   │ Developer    │             │
│  │  Walkthrough │   │  & Decisions│   │  Reflection  │             │
│  │   [▶ video]  │   │   [▶ video] │   │   [▶ video]  │             │
│  └─────────────┘   └─────────────┘   └─────────────┘             │
│  Only slots with an uploaded video render — up to 3, in a          │
│  3-column grid on desktop, stacked on mobile.                       │
└──────────────────────────────────────────────────────────────────┘

──────────────────────────────────────────────────────────────────────
NOTES (kept in sync with singleProjectPage.tsx — Phase 2D):

- Actual render order: Hero → Intro → Features → Highlight →
  Challenges → Takeaway → Future Improvements → Gallery (images) →
  Demo Videos. Media galleries render LAST, not right after Features.
- Highlight, Challenges, Takeaway, and Future Improvements are each
  independently optional — every one only renders if it has content
  (hand-written highlight/takeaway, or README-parsed
  challenges/future improvements). A brand-new project with none of
  these written yet just skips straight from Features to Gallery/Videos
  (or to nothing, if there's no media either).
- Section labels above match the literal on-page text, not a
  stylized "MEDIA GALLERY — X" heading — the components render
  "Gallery" and "Demo Videos" verbatim.
──────────────────────────────────────────────────────────────────────