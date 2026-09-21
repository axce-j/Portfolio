import React, { useState, useEffect } from "react";
import { ImageOff } from "lucide-react";
import { getPlaceholderSrc, getOptimizedSrc, getSrcSet } from "@/utils/cloudinaryUrl";

interface BlurredImageFrameProps {
  src: string;
  alt: string;
  className?: string;
  /** Native lazy-loading hint. Defaults to "lazy" — pass "eager" only
   * for images that are visible above the fold on first paint (e.g.
   * the hero), so those don't wait on the browser's lazy-load logic. */
  loading?: "lazy" | "eager";
  /** Widest size this image will ever actually be rendered at. Keeps
   * the srcset (and therefore what a low-data connection downloads)
   * capped to what's needed — no point offering a 2000px variant for
   * a 400px gallery thumbnail. */
  maxWidth?: number;
  /** Roughly how much of the viewport width this image occupies,
   * fed straight to the img's `sizes` attribute so the browser picks
   * the right srcset entry. */
  sizes?: string;
}

const BlurredImageFrame: React.FC<BlurredImageFrameProps> = ({
  src,
  alt,
  className = "",
  loading = "lazy",
  maxWidth = 1200,
  sizes = "100vw",
}) => {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");

  // Reset load state if the underlying image changes under us (e.g.
  // admin Visual Editor swapping an image without remounting).
  useEffect(() => {
    setStatus("loading");
  }, [src]);

  if (!src) {
    return (
      <div className={`relative w-full h-full overflow-hidden ${className}`} />
    );
  }

  return (
    <div className={`relative w-full h-full overflow-hidden bg-white/[0.03] ${className}`}>
      {/* Skeleton — visible until the placeholder or real image paints */}
      {status !== "error" && (
        <div
          className={`absolute inset-0 bg-gradient-to-br from-white/[0.04] to-white/[0.01] animate-pulse
            transition-opacity duration-500 ${status === "loaded" ? "opacity-0" : "opacity-100"}`}
        />
      )}

      {status === "error" ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/25">
          <ImageOff className="w-6 h-6" />
          <span className="text-[10px]">Image unavailable</span>
        </div>
      ) : (
        <>
          {/* Layer 1: tiny, heavily-compressed blurred stand-in.
              Downloads in a fraction of a second on any connection,
              so there's always *something* to look at immediately. */}
          <img
            src={getPlaceholderSrc(src)}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover scale-110"
            style={{ filter: "blur(16px)", opacity: 0.7 }}
          />

          {/* Layer 2: right-sized real image. Format/quality/size are
              negotiated by Cloudinary + the browser via f_auto/q_auto
              and srcset, so a phone on a slow connection never pulls
              a full desktop-resolution file. Fades in over the blur
              once actually decoded, instead of popping in abruptly. */}
          <img
            src={getOptimizedSrc(src, maxWidth)}
            srcSet={getSrcSet(src, maxWidth)}
            sizes={sizes}
            alt={alt}
            loading={loading}
            decoding="async"
            onLoad={() => setStatus("loaded")}
            onError={() => setStatus("error")}
            className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ${
              status === "loaded" ? "opacity-100" : "opacity-0"
            }`}
            style={{ zIndex: 1 }}
          />
        </>
      )}
    </div>
  );
};

export default BlurredImageFrame;