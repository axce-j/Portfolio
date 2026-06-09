
import React from "react";

interface BlurredImageFrameProps {
  src: string;
  alt: string;
  className?: string;
}

const BlurredImageFrame: React.FC<BlurredImageFrameProps> = ({ src, alt, className = "" }) => {
  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Layer 1: blurred fill */}
      <img
        src={src}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover scale-110"
        style={{ filter: "blur(16px)", opacity: 0.6 }}
      />

      {/* Layer 2: real image, fully visible */}
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full object-contain"
        style={{ zIndex: 1 }}
      />
    </div>
  );
};

export default BlurredImageFrame;