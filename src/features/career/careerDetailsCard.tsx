import React from "react";
import { Career } from "./data/careerData";
import { GraduationCap, Briefcase, Sparkles, MapPin } from "lucide-react";
import FeaturedSwiper, { SlideItem } from "@/components/ui/featured-swipper";
import testImage1 from "@/assets/profilePic3.jpeg";  


interface CareerDetailCardProps {
  career: Career;
}

const CareerDetailCard: React.FC<CareerDetailCardProps> = ({ career }) => {
  const isEducation = career.type === "education";
  const Icon = isEducation ? GraduationCap : career.type === "freelance" ? Sparkles : Briefcase;

  // Convert gallery images to swiper format
  const swiperSlides: SlideItem[] | undefined = career.gallery?.map((img, i) => ({
    id: i + 1,
    src: testImage1, // Replace with actual img when available
    alt: `${career.organization} - Image ${i + 1}`,
    title: "",
  }));

  return (
    <div className="w-full max-w-4xl mx-auto animate-fadeIn">
      {/* Main Card */}
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm p-8">
        
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center border flex-shrink-0"
            style={{
              background: "#2dd4bf15",
              borderColor: "#2dd4bf30",
            }}
          >
            <Icon size={26} style={{ color: "#2dd4bf" }} />
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white mb-2">{career.title}</h2>
            <p className="text-white/70 text-lg">{career.organization}</p>
            {career.role && career.type !== "education" && (
              <p className="text-white/50 text-sm mt-1">{career.role}</p>
            )}
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-white/50 text-sm">{career.startDate} — {career.endDate}</p>
            <p className="text-white/40 text-xs mt-1">{career.duration}</p>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 mb-6 text-white/50 text-sm">
          <MapPin size={16} />
          <span>{career.location}</span>
        </div>

        {/* Education-specific: CGPA */}
        {isEducation && career.cgpa && (
          <div className="mb-6 p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]">
            <p className="text-white/40 text-xs font-medium mb-1">CGPA</p>
            <p className="text-white text-2xl font-bold">{career.cgpa}</p>
          </div>
        )}

        {/* Gallery Swiper (Work only) */}
        { swiperSlides && swiperSlides.length > 0 && (
          <div className="mb-6 rounded-xl overflow-hidden border border-white/[0.08]">
            <FeaturedSwiper slides={swiperSlides} autoplayDelay={4000} />
          </div>
        )}

        {/* Description */}
        <p className="text-white/60 text-base leading-relaxed mb-6">
          {career.description}
        </p>

        {/* Work-specific: Responsibilities */}
        {career.responsibilities && career.responsibilities.length > 0 && (
          <div className="mb-6">
            <h3 className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
              <span className="text-[#2dd4bf]">🎯</span> Key Responsibilities
            </h3>
            <ul className="space-y-2">
              {career.responsibilities.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-white/60 text-sm">
                  <span className="text-[#2dd4bf] mt-1 flex-shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Work-specific: Tech Stack */}
        {career.technologies && career.technologies.length > 0 && (
          <div className="mb-6">
            <h3 className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
              <span className="text-[#fb923c]">🛠</span> Tech Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {career.technologies.map((tech) => (
                <span
                  key={tech}
                  className="text-xs px-3 py-1.5 rounded-full border text-white/50"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    borderColor: "rgba(255,255,255,0.1)",
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Highlights */}
        {career.highlights && career.highlights.length > 0 && (
          <div className="mb-6">
            <h3 className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
              <span className="text-[#818cf8]">🏆</span> {isEducation ? "Achievements" : "Highlights"}
            </h3>
            <ul className="space-y-2">
              {career.highlights.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-white/60 text-sm">
                  <span className="text-[#818cf8] mt-1 flex-shrink-0">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Personal Take/Reflection */}
        {career.personalTake && (
          <div className="mt-6 p-5 rounded-xl bg-gradient-to-br from-[#2dd4bf]/10 to-[#2dd4bf]/5 border border-[#2dd4bf]/20">
            <p className="text-white/40 text-xs font-medium mb-3 flex items-center gap-2">
              <span>💭</span> Personal Reflection
            </p>
            <p className="text-white/70 text-sm leading-relaxed italic">
              "{career.personalTake}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerDetailCard;