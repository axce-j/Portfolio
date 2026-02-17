import React, { useCallback, useMemo, useState } from "react";
import type { FC } from "react";
// import { Button } from "../components/ui/button";
import { cn } from "@/lib/utils";
// import { cn } from "../lib/utils";

export type Project = {
  type: string;
  title: string;
  subtitle?: string;
  gradient?: string;
};

export type ProjectSection = {
  title: string;
  projects: Project[];
};

interface ProjectAccordionProps {
  projectSections: ProjectSection[];
  /** optional initial active project type (e.g. "D1") */
  initialActiveProjectType?: string | null;
}

function PreviewCard({ project, isActive }: { project: Project; isActive?: boolean }) {
  return (
    <div
      className={cn(
        "w-60 min-w-[14rem] p-3 rounded-lg border shadow-sm flex flex-col",
        isActive
          ? "ring-2 ring-offset-2 ring-primary bg-gradient-to-br from-white/5 to-black/10"
          : "bg-white/3 hover:scale-[1.01] transition-transform"
      )}
      aria-current={isActive || undefined}
    >
      <div className="text-sm font-semibold">{project.title}</div>
      {project.subtitle && (
        <div className="text-xs text-muted-foreground mt-1">{project.subtitle}</div>
      )}
      <div className="mt-3 text-[10px] uppercase text-muted-foreground">{project.type}</div>
    </div>
  );
}

const ProjectAccordion: FC<ProjectAccordionProps> = React.memo(function ProjectAccordion({
  projectSections,
  initialActiveProjectType = null,
}) {
  const [expandedSection, setExpandedSection] = useState<number | null>(null);
  const [activeProjectType, setActiveProjectType] = useState<string | null>(initialActiveProjectType);

  // Handler when a project preview or item is clicked
  const handleProjectClick = useCallback((sectionIndex: number, projectType: string) => {
    setActiveProjectType(projectType);
    // open the section (if clicking the same project's section again, keep it open)
    setExpandedSection((prev) => (prev === sectionIndex ? sectionIndex : sectionIndex));
  }, []);

  // Toggle section when clicking the header area
  const toggleSection = useCallback((i: number) => {
    setExpandedSection((prev) => (prev === i ? null : i));
  }, []);

  return (
    <div className="flex items-center gap-2">
    {navigationItems.map((item) => {
      const Icon = item.icon;
      const isActive = location.pathname === item.path;
      return (
        <div key={item.path} className="relative group">
          <Button
            asChild
            variant={isActive ? "default" : "ghost"}
            size="icon"
            className={cn(
              "w-8 h-8 rounded-lg transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            <Link to={item.path}>
              <Icon className="w-4 h-4" />
              <span className="sr-only">{item.label}</span>
            </Link>
          </Button>
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
            {item.label}
          </div>
        </div>
      );
    })}
  </div>
  )

export default ProjectAccordion;
