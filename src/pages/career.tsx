import CareerCircle from "@/features/career/careerCircle";
import CareerDetailCard from "@/features/career/careerDetailsCard";
import { careers } from "@/features/career/data/careerData";
import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

const Career = () => {
  const [activeCareerIndex, setActiveCareerIndex] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);
  const activeCareer = careers[activeCareerIndex];

  const maxVisible = 3;
  const canScrollUp = scrollOffset > 0;
  const canScrollDown = scrollOffset + maxVisible < careers.length;

  const handleScrollUp = () => {
    if (canScrollUp) setScrollOffset(prev => prev - 1);
  };

  const handleScrollDown = () => {
    if (canScrollDown) setScrollOffset(prev => prev + 1);
  };

  const visibleCareers = careers.slice(scrollOffset, scrollOffset + maxVisible);

  return (
    <div className="min-h-screen pb-32">

      {/* ── Header ── */}
      <section className="px-4 md:px-40 pt-16 pb-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl md:text-4xl">🌟</span>
          <h1 className="text-4xl md:text-7xl font-bold text-white">Career Journey</h1>
        </div>
        <p className="text-base md:text-xl text-white/60 max-w-3xl leading-relaxed">
          Explore my professional path from academic foundations to industry experience.
          Click the timeline below to view details about each chapter.
        </p>
      </section>

      {/* ── Mobile-only: horizontal pill selector ── */}
      {/* Replaces the arc entirely on small screens */}
      <div className="md:hidden px-4 pb-6">
        <div className="flex gap-2 overflow-x-auto pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {careers.map((career, index) => (
            <button
              key={career.id}
              onClick={() => setActiveCareerIndex(index)}
              className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-full border transition-all duration-200 ${
                index === activeCareerIndex
                  ? "border-[#2dd4bf] bg-[#2dd4bf]/10 text-white"
                  : "border-white/10 bg-white/5 text-white/50 hover:text-white/80 hover:border-white/20"
              }`}
            >
              {/* Avatar circle */}
              {career.image ? (
                <img
                  src={career.image}
                  alt={career.organization}
                  className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                  style={{ background: "#2dd4bf20", color: "#2dd4bf" }}
                >
                  {career.organization.slice(0, 2).toUpperCase()}
                </div>
              )}
              <span className="text-xs font-medium whitespace-nowrap">{career.organization}</span>
              {/* Active dot */}
              {index === activeCareerIndex && (
                <div className="w-1.5 h-1.5 rounded-full bg-[#2dd4bf] flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Detail Card ── */}
      <section className="px-4 md:px-40 pb-16">
        <CareerDetailCard career={activeCareer} />
      </section>

      {/* ── Desktop-only: fixed arc timeline ── */}
      <div className="hidden md:block fixed left-10 bottom-20 z-50">

        {/* Scroll Up */}
        {canScrollUp && (
          <button
            onClick={handleScrollUp}
            className="absolute -top-12 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-sm"
          >
            <ChevronUp size={16} className="text-white/60" />
          </button>
        )}

        {/* Arc Container */}
        <div className="relative w-28 h-[280px] flex items-center justify-center">
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 112 280"
          >
            <path
              d="M 56 30 Q 85 140 56 250"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1.5"
              fill="none"
              strokeDasharray="4 4"
            />
          </svg>

          {visibleCareers.map((career, visualIndex) => {
            const actualIndex = scrollOffset + visualIndex;
            return (
              <CareerCircle
                key={career.id}
                career={career}
                isActive={actualIndex === activeCareerIndex}
                onClick={() => setActiveCareerIndex(actualIndex)}
                index={visualIndex}
                totalVisible={maxVisible}
              />
            );
          })}
        </div>

        {/* Scroll Down */}
        {canScrollDown && (
          <button
            onClick={handleScrollDown}
            className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-sm"
          >
            <ChevronDown size={16} className="text-white/60" />
          </button>
        )}

        {/* Progress dots */}
        <div className="absolute -right-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5">
          {careers.map((_, index) => (
            <div
              key={index}
              className={`w-1 h-1 rounded-full transition-all duration-300 ${
                index === activeCareerIndex
                  ? "bg-[#2dd4bf] w-1.5 h-1.5"
                  : "bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
      `}</style>
    </div>
  );
};

export default Career;