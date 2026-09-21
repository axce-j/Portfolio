import { useState } from "react";
import { Maximize2 } from "lucide-react";
import BlurredImageFrame from "@/components/blurredImageFrame";
import ImageLightbox, { type LightboxMode } from "@/components/ImageLightbox";
import { useImagePreviewEnabled } from "@/components/ImagePreviewContext";

interface ExpandableImageProps {
  src: string | null;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
  maxWidth?: number;
  sizes?: string;
}

/**
 * Drop-in replacement for BlurredImageFrame anywhere on the project
 * page that should be previewable. Hovering (mouse/trackpad only —
 * touch has no hover) just reveals a faint fullscreen-icon overlay
 * as a hint that the image is interactive; clicking (or tapping, or
 * Enter/Space when focused) is what actually opens the ~50%-of-screen
 * preview. From there it can be expanded to a fullscreen view. Used
 * by Hero, Feature, Highlight, and the media gallery so the behavior
 * is identical everywhere.
 */
export default function ExpandableImage({
  src,
  alt,
  className = "",
  loading,
  maxWidth,
  sizes,
}: ExpandableImageProps) {
  const previewEnabled = useImagePreviewEnabled();
  const [mode, setMode] = useState<LightboxMode | null>(null);

  // Inside the admin Visual Editor this renders as a plain image with
  // none of the click/hover wiring below — see ImagePreviewContext
  // for why. BlurredImageFrame's own loading/skeleton/error behavior
  // still applies either way.
  if (!previewEnabled) {
    return (
      <BlurredImageFrame
        src={src ?? ""}
        alt={alt}
        loading={loading}
        maxWidth={maxWidth}
        sizes={sizes}
        className={className}
      />
    );
  }

  const open = () => {
    if (!src) return;
    setMode("mini");
  };

  const handleClose = () => setMode(null);

  return (
    <div
      className={`relative w-full h-full group ${className}`}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      }}
      role={src ? "button" : undefined}
      tabIndex={src ? 0 : undefined}
      aria-label={src ? `Preview image: ${alt}` : undefined}
    >
      <BlurredImageFrame
        src={src ?? ""}
        alt={alt}
        loading={loading}
        maxWidth={maxWidth}
        sizes={sizes}
      />

      {/* Hover affordance — subtle, only appears over an image that
          actually exists and is interactive. z-10 matters here: the
          real photo inside BlurredImageFrame is explicitly z-index:1
          (so it can fade in over its blur placeholder), which would
          otherwise sit on top of this and hide the icon completely. */}
      {src && (
        <div
          className="absolute inset-0 z-10 flex items-center justify-center bg-black/0 group-hover:bg-black/20
            transition-colors duration-200 pointer-events-none"
        >
          <div
            className="flex items-center justify-center w-10 h-10 rounded-full bg-black/50 border border-white/10
              text-white opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100
              transition-all duration-200"
          >
            <Maximize2 className="w-4 h-4" />
          </div>
        </div>
      )}

      {mode && src && (
        <ImageLightbox
          src={src}
          alt={alt}
          mode={mode}
          onExpand={() => setMode("full")}
          onShrink={() => setMode("mini")}
          onClose={handleClose}
        />
      )}
    </div>
  );
}