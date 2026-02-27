import FeaturedSwiper, { SlideItem } from "@/components/ui/featured-swipper";
import HorizontalScrollSection from "./horizontalScrollSection";
import {
  projectsFeaturedSections,
  experienceFeaturedSections,
  expertiseFeaturedSections,
} from "./data/home-section-data";
import ProfilePic1 from "@/assets/profilePic1.jpeg";
import ProfilePic2 from "@/assets/profilePic2.jpeg";
import ProfilePic3 from "@/assets/profilePic3.jpeg";

const name = "Ezeani Obinna Jachike";

const slides: SlideItem[] = [
  { id: 1, src: ProfilePic1, alt: "Hero", title: " " },
  { id: 2, src: ProfilePic2, alt: "Profile 2", title: "", subtitle: "" },
  { id: 3, src: ProfilePic3, alt: "Profile 3", title: "", subtitle: "" },
];

// ─────────────────────────────────────────────
// Inject webkit scrollbar hide once at module level
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

const HomeIndex = () => {
  return (
    <div className="flex flex-col gap-[6.5rem] pb-16">

      {/* Header */}
      {/* mobile: column, full-width, left-padded normally */}
      {/* desktop: original side-by-side row with pl-40 */}
      <header className="flex flex-col md:flex-row justify-between items-center p-4 gap-8 pl-4 md:pl-40 pr-4">

        {/* Text block: full width on mobile, 80% on desktop */}
        <div className="w-full md:w-[80%] flex flex-col gap-12">
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

        {/* Swiper block: full width on mobile, 50% on desktop */}
        <div className="w-full md:w-[50%]">
          <div className="w-full h-100 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <FeaturedSwiper slides={slides} autoplayDelay={5000} />
          </div>
        </div>

      </header>

      {/* Featured Projects */}
      <HorizontalScrollSection sections={projectsFeaturedSections} />

      {/* Work Experience */}
      <HorizontalScrollSection sections={experienceFeaturedSections} />

      {/* Skills & CV */}
      <HorizontalScrollSection sections={expertiseFeaturedSections} />

    </div>
  );
};

export default HomeIndex;