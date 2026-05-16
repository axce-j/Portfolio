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
				<div className="w-full md:w-[80%] flex flex-col gap-6">
					<h1 className="text-5xl space-x-4 font-bold">
						<span>J.O.E</span>
						<span className="text-xl italic font-bold">Engineer. Builder. Founder.</span>
					</h1>
					<p className="text-lg text-white/60 leading-relaxed space-y-3">
  <span className="block text-white font-medium">
    I'm {name} — a software engineer and product builder.
  </span>

  <span className="block mt-3">
    Founding member of{" "}
    <span className="text-white font-semibold">CareerlyAI</span>
    {" "}— an AI-powered platform helping secondary school students
    navigate their futures with clarity and confidence.
  </span>

  <span className="block mt-4 text-white/90 text-xl italic font-light">
    Some engineers build features.{" "}
    <span className="text-white font-semibold not-italic">I build futures.</span>
  </span>

  <span className="block mt-4">
    My work spans{" "}
    <span className="text-white/90">backend architecture</span>,{" "}
    <span className="text-white/90">authentication systems</span>,{" "}
    <span className="text-white/90">payments</span>, and{" "}
    <span className="text-white/90">product design</span>{" "}
    — always centered on real people: students who need direction,
    parents who need answers, schools that need tools that actually work.
  </span>

  <span className="block mt-3 text-white/50 text-base">
    My obsession is the rare space where great engineering
    directly changes a life trajectory.
  </span>
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
