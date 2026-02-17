import { useRef, useState } from "react";
import { Link } from "react-router-dom";

import {
  FeaturedSection,
  ProjectEntry,
  WorkEntry,
  ExpertiseEntry,
} from "./data/home-section-data";
import { ProjectCard, SkillsCVCard, WorkExperienceCard } from "@/components/ui/cards";

// ─────────────────────────────────────────────
// ViewAllCard
// ─────────────────────────────────────────────

function ViewAllCard({ section }: { section: FeaturedSection }) {
  return (
    <Link to={section.viewMorePath} className="flex-shrink-0">
      <div className="w-[32rem] h-80 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 rounded-2xl flex flex-col items-center justify-center gap-4 hover:from-white/10 hover:to-white/15 transition-all duration-300 group cursor-pointer">
        <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">
          👀
        </div>
        <h4 className="text-xl font-semibold text-white">View All</h4>
        <p className="text-white/60 text-center px-6 group-hover:text-white/80 transition-colors">
          Explore all {section.title.toLowerCase()}
        </p>
        <svg
          className="w-6 h-6 text-white/40 group-hover:text-white/60 group-hover:translate-y-1 transition-all duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </Link>
  );
}

// ─────────────────────────────────────────────
// HorizontalScrollSection
// ─────────────────────────────────────────────

const scrollbarHideStyle = {
  scrollbarWidth: "none" as const,
  msOverflowStyle: "none" as const,
};

interface HorizontalScrollSectionProps {
  sections: FeaturedSection[];
}

export default function HorizontalScrollSection({
  sections,
}: HorizontalScrollSectionProps) {
  const scrollRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [atEnd, setAtEnd] = useState<boolean[]>(sections.map(() => false));

  const toggleScroll = (index: number) => {
    const el = scrollRefs.current[index];
    if (!el) return;

    if (atEnd[index]) {
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
    }

    setAtEnd((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  return (
    <>
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="relative">

          {/* Section header */}
          <div className="flex justify-between items-center pl-40 pr-4 pb-8">
            <h3 className="font-bold text-2xl">{section.title}</h3>

            <button
              onClick={() => toggleScroll(sectionIndex)}
              className="group flex items-center gap-2 text-sm text-white/60 hover:text-white/80 transition-colors duration-300"
            >
              <span>
                {atEnd[sectionIndex] ? "Back to start" : "See all"}
              </span>
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${
                  atEnd[sectionIndex]
                    ? "rotate-180 group-hover:-translate-x-1"
                    : "group-hover:translate-x-1"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* Scroll row */}
          <div
            ref={(el) => { scrollRefs.current[sectionIndex] = el; }}
            className="flex gap-8 overflow-x-auto overflow-y-hidden pb-4 hide-scrollbar"
            style={scrollbarHideStyle}
          >
            <div className="flex gap-8 pl-40">

              {/* Work Experience cards */}
              {section.type === "work" &&
                (section.items as WorkEntry[]).map((item, i) => (
                  <WorkExperienceCard key={i} {...item} />
                ))}

              {/* Project cards */}
              {section.type === "projects" &&
                (section.items as ProjectEntry[]).map((project, i) => (
                  <Link key={i} to={project.path} className="flex-shrink-0">
                    <ProjectCard
                      title={project.title}
                      subtitle={project.subtitle}
                      gradient={project.gradient}
                    />
                  </Link>
                ))}

              {/* Skills & CV cards */}
              {section.type === "expertise" &&
                (section.items as ExpertiseEntry[]).map((item, i) => (
                  <SkillsCVCard key={i} item={item} />
                ))}

              <ViewAllCard section={section} />
              <div className="flex-shrink-0 w-4" />
            </div>
          </div>

        </div>
      ))}
    </>
  );
}