import { adaptReadme } from "./readmeAdapter";

 
const FULL_CONFORMING = `
# Team Task Tracker

A collaborative task tracker built to learn real-time sync.

## Live Demo

https://tasktracker.example.com

## Screenshots

### Home Page
### Search & Filtering

## Demo Videos

- Client Walkthrough: https://res.cloudinary.com/demo/video/upload/walkthrough.mp4
- Architecture & Decisions: https://res.cloudinary.com/demo/video/upload/arch.mp4
- Developer Reflection: https://res.cloudinary.com/demo/video/upload/reflection.mp4

## Features

- Real-time task sync across clients
- Drag-and-drop kanban board
- Per-user notification preferences

## Technologies Used

### Frontend
- React
- TailwindCSS

### Backend
- Node.js
- PostgreSQL

## Architecture Highlights

The sync engine uses optimistic updates with a reconciliation pass
against the server, rather than locking on every write.

## Challenges

- Getting websocket reconnection to not duplicate in-flight updates
- Race conditions between drag reorder and incoming sync events

## What I Learned

- Optimistic UI is harder to get right than it looks
- Websockets need their own reconnection state machine

## Looking Back

If I rebuilt this today I'd reach for a CRDT library instead of
hand-rolling reconciliation logic — it solved the same problem more
robustly than my custom pass ever did.

## Future Improvements

- Offline support with local-first sync
- Mobile app via React Native

## Author

Jane Doe
`;

const MISSING_HIGHLIGHT = `
# Minimal Project

## Features

- Does a thing

## Technologies Used

- React
`;

const MISSPELLED_HEADING = `
# Typo Project

## Architecture Highlihgts

This should NOT be picked up — heading is misspelled.

## Features

- One feature
`;

const NO_README = null;

function run(label: string, markdown: string | null) {
  console.log(`\n── ${label} ──`);
  console.log(JSON.stringify(adaptReadme(markdown), null, 2));
}

run("Full conforming README", FULL_CONFORMING);
run("Missing most sections", MISSING_HIGHLIGHT);
run("Misspelled heading (should be treated as absent)", MISSPELLED_HEADING);
run("No README at all", NO_README);