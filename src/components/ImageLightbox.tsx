import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Maximize2, Minimize2 } from "lucide-react";
import { getOptimizedSrc, getSrcSet } from "@/utils/cloudinaryUrl";

export type LightboxMode = "mini" | "full";

interface ImageLightboxProps {
  src: string;
  alt: string;
  mode: LightboxMode;
  onExpand: () => void;
  onShrink: () => void;
  onClose: () => void;
}

/**
 * Rendered via a portal into document.body, so it always sits above
 * everything regardless of which card/section it was opened from.
 *
 * "mini" — a preview centered in roughly half the viewport.
 * "full" — the same image, fullscreen, for actually reading detail.
 */
export default function ImageLightbox({
  src,
  alt,
  mode,
  onExpand,
  onShrink,
  onClose,
}: ImageLightboxProps) {
  // Lock background scroll while open, and let Escape close it
  // regardless of mode.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  const isFull = mode === "full";
  // Fullscreen viewing needs more resolution than a half-screen
  // preview — ask Cloudinary for a bigger variant only once we're
  // actually in full mode, rather than always paying for the largest.
  const maxWidth = isFull ? 2000 : 1200;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt || "Image preview"}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      onClick={(e) => {
        // Portals still bubble through the React tree (not the DOM
        // tree), so without this, a backdrop click would close the
        // modal here and then keep bubbling into whatever trigger
        // rendered <ImageLightbox> — e.g. ExpandableImage's own
        // onClick={open} — reopening it in the same event.
        e.stopPropagation();
        onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-200" />

      {/* Content frame — 50% of viewport in mini mode, full in full mode */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative z-10 overflow-hidden rounded-2xl border border-white/10
          bg-black/40 shadow-[0_16px_60px_rgba(0,0,0,0.6)]
          transition-all duration-300 ease-out
          ${isFull ? "w-full h-full max-w-none max-h-none rounded-none" : "w-[90vw] h-[70vh] sm:w-[50vw] sm:h-[50vh]"}`}
      >
        <img
          src={getOptimizedSrc(src, maxWidth)}
          srcSet={getSrcSet(src, maxWidth)}
          sizes={isFull ? "100vw" : "50vw"}
          alt={alt}
          className="w-full h-full object-contain"
        />

        {/* Clicking anywhere on the image toggles size — faster than
            reaching for the corner button. Rendered first so the
            controls below sit visually on top of it. */}
        <button
          aria-hidden="true"
          tabIndex={-1}
          onClick={isFull ? onShrink : onExpand}
          className="absolute inset-0 w-full h-full"
          style={{ cursor: isFull ? "zoom-out" : "zoom-in" }}
        />

        {/* Controls */}
        <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
          {isFull ? (
            <button
              onClick={onShrink}
              aria-label="Shrink preview"
              className="flex items-center justify-center w-9 h-9 rounded-full
                bg-black/50 border border-white/10 text-white/70 hover:text-white hover:bg-black/70
                backdrop-blur-sm transition-all duration-150"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onExpand}
              aria-label="Expand to fullscreen"
              className="flex items-center justify-center w-9 h-9 rounded-full
                bg-black/50 border border-white/10 text-white/70 hover:text-white hover:bg-black/70
                backdrop-blur-sm transition-all duration-150"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            aria-label="Close preview"
            className="flex items-center justify-center w-9 h-9 rounded-full
              bg-black/50 border border-white/10 text-white/70 hover:text-white hover:bg-black/70
              backdrop-blur-sm transition-all duration-150"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}