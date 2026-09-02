import { useRef, useState, useMemo } from "react";
import ProjectCard from "@/components/ui/cards";
import { ProjectSection } from "../data/projectsData";

// ─────────────────────────────────────────────
// Scrollbar style
// ─────────────────────────────────────────────
const scrollbarHideStyle = {
  scrollbarWidth: "none" as const,
  msOverflowStyle: "none" as const,
};

// ─────────────────────────────────────────────
// ProjectsScrollSection
// ─────────────────────────────────────────────

interface ProjectsScrollSectionProps {
  sections: ProjectSection[];
}

export default function ProjectsScrollSection({
  sections,
}: ProjectsScrollSectionProps) {
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

  // Per-card randomized gradient — independent of category. Category's
  // fixed gradient (CATEGORY_META) is a separate concern, used for the
  // home page's featured category cards, not for individual project
  // cards within a section here.
  const sectionsWithGradients = useMemo(() => {
    const themes = ["teal", "blue", "yellow", "mixed"] as const;

    return sections.map((section) => {
      const shuffled = [...themes].sort(() => Math.random() - 0.5);

      const projectsWithGradient = section.projects.map((project, idx) => ({
        ...project,
        gradient: shuffled[idx % shuffled.length],
      }));

      return {
        ...section,
        projects: projectsWithGradient,
      };
    });
  }, [sections]);

  return (
    <>
      {sectionsWithGradients.map((section, sectionIndex) => (
        <div key={sectionIndex} className="relative">

          {/* Section header */}
          {section.title && (
            <div className="flex justify-between items-center pl-4 md:pl-40 pr-4 pb-8">
              <h3 className="font-bold text-2xl">{section.title}</h3>

              <button
                onClick={() => toggleScroll(sectionIndex)}
                className="group flex items-center gap-2 text-sm text-white/60 hover:text-white/80 transition-colors duration-300"
              >
                <span>
                  {atEnd[sectionIndex] ? "Back to start" : "See end"}
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
          )}

          {/* Horizontal scroll row */}
          <div
            ref={(el) => { scrollRefs.current[sectionIndex] = el; }}
            className="flex gap-8 overflow-x-auto overflow-y-hidden pb-4 hide-scrollbar horizontal-scroll-container"
            style={scrollbarHideStyle}
          >
            <div className="flex gap-4 md:gap-8 pl-4 md:pl-40">
              {section.projects.map((project, projectIndex) => (
                <ProjectCard
                  key={projectIndex}
                  id={project.id}
                  title={project.title}
                  subtitle={project.subtitle}
                  cover={project.cover}
                  gradient={project.gradient}
                />
              ))}
              <div className="flex-shrink-0 w-4" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}