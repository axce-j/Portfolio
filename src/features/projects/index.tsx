 import FeaturedSwiper, { SlideItem } from "@/components/ui/featured-swipper";
 import { projectSections } from "./data/projectsData";
import ProfilePic1 from "@/assets/profilePic1.jpeg";
import ProfilePic2 from "@/assets/profilePic2.jpeg";
import ProfilePic3 from "@/assets/profilePic3.jpeg";
import ProjectsScrollSection from "./component/projectScrollSection";

// ─────────────────────────────────────────────
// Static data (not section data — stays here)
// ─────────────────────────────────────────────

const name = "Ezeani Obinna Jachike";

const slides: SlideItem[] = [
  { id: 1, src: ProfilePic1, alt: "Hero",      title: " " },
  { id: 2, src: ProfilePic2, alt: "Profile 2", title: "", subtitle: "" },
  { id: 3, src: ProfilePic3, alt: "Profile 3", title: "", subtitle: "" },
];

// ─────────────────────────────────────────────
// Inject webkit scrollbar hide once
// ─────────────────────────────────────────────

if (typeof document !== "undefined") {
  if (!document.head.querySelector("[data-scrollbar-hide]")) {
    const style = document.createElement("style");
    style.setAttribute("data-scrollbar-hide", "true");
    style.textContent = `.hide-scrollbar::-webkit-scrollbar { display: none; }`;
    document.head.appendChild(style);
  }
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────

const ProjectIndex = () => {
  return (
    <div className="flex flex-col gap-[6.5rem] pb-16">

      {/* Header */}
      <header className="flex justify-between items-center pl-40 pr-4">
        <div className="w-full flex flex-col gap-12">
          <h1 className="text-8xl font-bold">J.O.E</h1>
          <p className="text-xl text-white/60">
            Welcome to the extraordinary world of {name}, a versatile and
            imaginative artist who skillfully navigates the realms of product
            design, photography and digital art. With a keen eye for detail and
            a relentless pursuit of innovation, {name} crafts captivating visual
            narratives, immersive digital realms, and functional yet
            aesthetically pleasing products.
          </p>
        </div>
        <div className="w-[50%]">
          <div className="w-full h-100 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <FeaturedSwiper slides={slides} autoplayDelay={5000} />
          </div>
        </div>
      </header>

      {/* Project sections */}
      <ProjectsScrollSection sections={projectSections} />

    </div>
  );
};

export default ProjectIndex;