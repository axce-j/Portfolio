// Hidden admin-access configuration.
//
// IMPORTANT: everything in this file is OBSCURITY, not security — the
// real access control is the server-side password check in api/*.ts
// (ADMIN_UPLOAD_PASSWORD, which is NEVER exposed here or anywhere in
// client code). Values below get bundled into client JS and are
// readable by anyone who opens devtools — including
// ADMIN_ROUTE_SECRET and the rotation formula itself. That's fine:
// the goal here is only to stop the URL from being permanently
// bookmarkable/shareable, not to stop a determined attacker — a
// determined attacker was never blocked by the route being hidden,
// only by the password.

// Separate from ADMIN_UPLOAD_PASSWORD on purpose — that one must
// never reach the browser. This one is expected to be visible in the
// bundle; it just shouldn't be guessable.
const ADMIN_ROUTE_SECRET = import.meta.env.VITE_ADMIN_ROUTE_SECRET ?? "change-me-please";

const ADMIN_ROUTE_PREFIX = import.meta.env.VITE_ADMIN_ROUTE_PREFIX ?? "/admin-";

// How often the route changes. 24h is a reasonable default — long
// enough that you can actually use the route once you've navigated
// to it, short enough that a URL glimpsed today is dead within a day.
// Override via VITE_ADMIN_ROUTE_WINDOW_HOURS if you want it shorter
// (e.g. 1) or longer (e.g. 168 for weekly).
const ADMIN_ROUTE_WINDOW_HOURS = Number(import.meta.env.VITE_ADMIN_ROUTE_WINDOW_HOURS ?? 24);

// Small deterministic string hash (djb2 variant) — NOT cryptographic,
// deliberately: this only needs to be unpredictable to a casual
// observer, not resistant to a determined attacker (see note above),
// and staying synchronous means the route can be computed directly
// inline in JSX (React Router needs a plain string, not a Promise).
function simpleHash(input: string): string {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 33) ^ input.charCodeAt(i);
  }
  return (hash >>> 0).toString(36); // unsigned, base36 for a short string
}

/**
 * The currently-valid admin route. Deterministic: computing this
 * "generates" the route to navigate to (in the secret-click/typed-
 * phrase hooks) AND "validates" an incoming route (in App.tsx's
 * <Route path={...}>) using the exact same formula — both sides
 * independently arrive at the same value as long as they're within
 * the same time window, with no server round-trip needed.
 */
export function getAdminRoute(referenceDate: Date = new Date()): string {
  const windowMs = ADMIN_ROUTE_WINDOW_HOURS * 60 * 60 * 1000;
  const windowIndex = Math.floor(referenceDate.getTime() / windowMs);
  const suffix = simpleHash(`${ADMIN_ROUTE_SECRET}:${windowIndex}`);
  return `${ADMIN_ROUTE_PREFIX}${suffix}`;
}

// Click-sequence trigger (works on mobile) — click the trigger element
// this many times within the window to navigate to the current
// getAdminRoute(). Same idea as Android's "tap build number 7 times."
export const SECRET_CLICK_COUNT = 7;
export const SECRET_CLICK_WINDOW_MS = 3000;

// Typed-phrase trigger (desktop/keyboard) — type this string anywhere
// on the page (outside inputs/textareas) within the per-keystroke
// timeout to navigate to the current getAdminRoute().
export const SECRET_PHRASE = import.meta.env.VITE_ADMIN_SECRET_PHRASE ?? "opensesame";
export const SECRET_PHRASE_TIMEOUT_MS = 2000;