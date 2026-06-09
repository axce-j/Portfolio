"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export interface SlideItem {
  id: number;
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
}

interface FeaturedSwiperProps {
  slides: SlideItem[];
  autoplayDelay?: number;
  loop?: boolean;
  className?: string;
}

export default function FeaturedSwiper({
  slides,
  autoplayDelay = 4000,
  loop,
  className = "",
}: FeaturedSwiperProps) {
  const shouldLoop = loop ?? slides.length > 1;

  return (
    <div className={`relative w-full ${className}`}>
      <style>{`
        .featured-swiper .swiper-pagination-bullet {
          background-color: #ffffff;
          opacity: 0.5;
        }
        .featured-swiper .swiper-pagination-bullet-active {
          background-color: #2dd4bf;
          opacity: 1;
        }
      `}</style>

      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: autoplayDelay, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={shouldLoop}
        className="featured-swiper w-full rounded-xl overflow-hidden"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            {/* Fixed height container */}
            <div className="relative w-full aspect-video overflow-hidden">

              {/* Layer 1: blurred fill — covers every pixel */}
              <img
                src={slide.src}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  filter: "blur(20px)",
                  transform: "scale(1.15)", // prevents blur edge bleed
                  opacity: 0.55,
                }}
              />

              {/* Dark tint over blur so foreground pops */}
              <div className="absolute inset-0 bg-black/30" />

              {/* Layer 2: real image — fully visible, no cropping */}
              <img
                src={slide.src}
                alt={slide.alt}
                className="absolute inset-0 w-full h-full object-contain"
                style={{ zIndex: 1 }}
              />

              {/* Optional title/subtitle overlay */}
              {(slide.title || slide.subtitle) && (
                <div
                  className="absolute inset-x-0 bottom-0 flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent p-4 md:p-6"
                  style={{ zIndex: 2 }}
                >
                  {slide.title && (
                    <h2 className="text-white text-lg md:text-2xl font-bold leading-tight">
                      {slide.title}
                    </h2>
                  )}
                  {slide.subtitle && (
                    <p className="text-white/80 text-xs md:text-sm mt-1">
                      {slide.subtitle}
                    </p>
                  )}
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}