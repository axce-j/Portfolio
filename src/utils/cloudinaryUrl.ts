/**
 * ═══════════════════════════════════════════════════════════════
 * CLOUDINARY URL HELPERS
 * ═══════════════════════════════════════════════════════════════
 *
 * Every image/video URL in this project comes from Cloudinary
 * (see ARCHITECTURE.md — media upload path). URLs look like:
 *
 *   https://res.cloudinary.com/<cloud>/image/upload/v123/portfolio/abc.png
 *
 * Cloudinary lets you inject a transformation string right after
 * `/upload/` to get a resized/recompressed/reformatted version of
 * the *same* asset, generated on the fly, with no separate upload
 * step. That's what these helpers do:
 *
 *  - a tiny, heavily-blurred, heavily-compressed placeholder that
 *    downloads almost instantly, even on a slow connection
 *  - a right-sized "real" image with automatic format (AVIF/WebP
 *    where the browser supports it) and automatic quality, so
 *    people on low data never download more bytes than their
 *    screen can even show
 *
 * If a URL isn't a Cloudinary `/upload/` URL (shouldn't happen in
 * practice, but images are user-uploaded content, not something we
 * fully control), every helper here just returns the original URL
 * unchanged rather than producing something broken.
 */

const UPLOAD_MARKER = "/upload/";

function isCloudinaryUrl(url: string): boolean {
  return url.includes("res.cloudinary.com") && url.includes(UPLOAD_MARKER);
}

function withTransform(url: string, transform: string): string {
  if (!isCloudinaryUrl(url)) return url;
  const idx = url.indexOf(UPLOAD_MARKER) + UPLOAD_MARKER.length;
  return url.slice(0, idx) + transform + "/" + url.slice(idx);
}

/**
 * A ~20px-wide, heavily blurred, very low quality stand-in for the
 * real image. Typically a few KB regardless of how large the source
 * photo is — this is what should paint first, even on 2G.
 */
export function getPlaceholderSrc(url: string): string {
  return withTransform(url, "w_24,e_blur:1000,q_1,f_auto");
}

/**
 * The "real" image, capped at `maxWidth` and using automatic
 * format/quality negotiation (f_auto picks AVIF/WebP when the
 * browser supports it, q_auto picks the smallest quality that still
 * looks good). Never returns something larger than the source.
 */
export function getOptimizedSrc(url: string, maxWidth = 1200): string {
  return withTransform(url, `w_${maxWidth},c_limit,f_auto,q_auto`);
}

/**
 * A `srcset` string across common breakpoints (capped by maxWidth),
 * paired with `sizes`, so the browser — not us — decides which one
 * to fetch based on actual rendered size and screen density. This is
 * the main lever for "low data": a phone showing a 300px-wide card
 * never pulls the same bytes as a 1200px desktop hero.
 */
const SRCSET_WIDTHS = [320, 480, 640, 800, 1000, 1200, 1600, 2000];

export function getSrcSet(url: string, maxWidth = 2000): string {
  if (!isCloudinaryUrl(url)) return "";
  return SRCSET_WIDTHS.filter((w) => w <= maxWidth)
    .map((w) => `${getOptimizedSrc(url, w)} ${w}w`)
    .join(", ");
}