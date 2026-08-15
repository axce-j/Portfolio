// Hidden admin-access configuration.
//
// IMPORTANT: everything in this file is OBSCURITY, not security — the
// real access control is the server-side password check in api/*.ts.
// These values (including VITE_ADMIN_ROUTE) get bundled into client
// JS and are readable by anyone who opens devtools, same as any other
// client-side route. That's fine and expected — per the Phase 2 plan,
// "security comes from the password either way."

export const ADMIN_ROUTE = import.meta.env.VITE_ADMIN_ROUTE ?? "/admin-7f2a9c";

// Click-sequence trigger (works on mobile) — click the trigger element
// this many times within the window to navigate to ADMIN_ROUTE. Same
// idea as Android's "tap build number 7 times" pattern.
export const SECRET_CLICK_COUNT = 7;
export const SECRET_CLICK_WINDOW_MS = 3000;

// Typed-phrase trigger (desktop/keyboard) — type this string anywhere
// on the page (outside inputs/textareas, so normal typing elsewhere on
// the site is never affected) within the per-keystroke timeout to
// navigate to ADMIN_ROUTE.
export const SECRET_PHRASE = import.meta.env.VITE_ADMIN_SECRET_PHRASE ?? "opensesame";
export const SECRET_PHRASE_TIMEOUT_MS = 2000;