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
    if (canScrollUp) {
      setScrollOffset(prev => prev - 1);
    }
  };

  const handleScrollDown = () => {
    if (canScrollDown) {
      setScrollOffset(prev => prev + 1);
    }
  };

  const visibleCareers = careers.slice(scrollOffset, scrollOffset + maxVisible);

  return (
    <div className="min-h-screen pb-32">
      
      {/* Header */}
      <section className="px-40 pt-16 pb-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">🌟</span>
          <h1 className="text-7xl font-bold text-white">Career Journey</h1>
        </div>
        <p className="text-xl text-white/60 max-w-3xl leading-relaxed">
          Explore my professional path from academic foundations to industry experience. 
          Click the timeline below to view details about each chapter.
        </p>
      </section>

      {/* Main Content - Active Career Details */}
      <section className="px-40 pb-16">
        <CareerDetailCard career={activeCareer} />
      </section>

      {/* Fixed Bottom-Left Vertical Arc Timeline */}
      <div className="fixed left-10 bottom-20 z-50">
        
        {/* Scroll Up Button */}
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
          {/* Decorative arc line */}
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

          {/* Career Circles */}
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

        {/* Scroll Down Button */}
        {canScrollDown && (
          <button
            onClick={handleScrollDown}
            className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-sm"
          >
            <ChevronDown size={16} className="text-white/60" />
          </button>
        )}

        {/* Progress indicator */}
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

      {/* Global styles for smooth transitions */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Career;