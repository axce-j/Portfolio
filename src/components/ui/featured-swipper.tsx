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
    <Swiper
      modules={[Autoplay, Pagination]}
      autoplay={{ delay: autoplayDelay, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      loop={shouldLoop}
      className={`w-full rounded-xl overflow-hidden ${className}`}
    >
      {slides.map((slide) => (
        <SwiperSlide key={slide.id}>
          <div className="relative w-full aspect-video">
            <img
              src={slide.src}
              alt={slide.alt}
              className="w-full h-full object-cover"
            />
            {(slide.title || slide.subtitle) && (
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent p-6">
                {slide.title && (
                  <h2 className="text-white text-2xl font-bold leading-tight">
                    {slide.title}
                  </h2>
                )}
                {slide.subtitle && (
                  <p className="text-white/80 text-sm mt-1">{slide.subtitle}</p>
                )}
              </div>
            )}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
