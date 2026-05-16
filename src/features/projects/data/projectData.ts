import { singleProjects } from "./singleProjectData";

export type ProjectSection = {
  title: string;
  projects: Array<{
    id: string;
    type: string;
    title: string;
    subtitle: string;
    cover?: string;
   }>;
};

// Group projects into sections
export const projectSections: ProjectSection[] = [
  {
    title: "Frontend",
    projects: singleProjects
      .filter((p) => p.id.startsWith("frontend"))
      .map((p) => ({
        id: p.id,
        type: "frontend",
        title: p.intro.title,
        subtitle: p.intro.tagline,
        cover: p.heroImage,
        gradient: "teal",
      })),
  },
  {
    title: "Design",
    projects: singleProjects
      .filter((p) => p.id.startsWith("design"))
      .map((p) => ({
        id: p.id,
        type: "design",
        title: p.intro.title,
        subtitle: p.intro.tagline,
        cover: p.heroImage,
        gradient: "blue",
      })),
  },
  {
    title: "Backend",
    projects: singleProjects
      .filter((p) => p.id.startsWith("backend"))
      .map((p) => ({
        id: p.id,
        type: "backend",
        title: p.intro.title,
        subtitle: p.intro.tagline,
        cover: p.heroImage,
        gradient: "yellow",
      })),
  },
];