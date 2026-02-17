import { Image } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase } from "lucide-react";
import { ExpertiseEntry } from "@/features/Home/data/home-section-data";


interface ProjectCardProps {
  title: string;
  subtitle: string;
  cover?: string;
  gradient?: string;
  type?: string;
  id?: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  subtitle,
  cover,
  id,
  // type,
  gradient = "from-slate-800 via-slate-700 to-slate-600",
}) => {
  // Darker theme gradient variants for inner content
  const gradientVariants = {
    teal: "from-black via-teal-950/95 to-slate-950",
    blue: "from-black via-blue-950/95 to-slate-950", 
    yellow: "from-black via-yellow-950/80 to-slate-950",
    mixed: "from-black via-blue-950/80 via-teal-950/60 to-slate-950"
  };

  // Hover gradient overlays that extend to subtitle area
  const hoverGradients = {
    teal: "from-teal-800/40 via-teal-700/30 to-slate-800/20",
    blue: "from-blue-800/40 via-blue-700/30 to-slate-800/20",
    yellow: "from-yellow-800/40 via-yellow-700/30 to-slate-800/20", 
    mixed: "from-blue-800/30 via-teal-700/25 to-yellow-800/15"
  };
  const navigate = useNavigate();

// const handleNavigation = (type:string|undefined) => {
//   if (type?.startsWith("D")) {
//     navigate("/projects/single-project/");
//   } else if (type?.startsWith("F.E.P")) {
//     navigate("/projects/frontendprojects");
//   } else if (type?.startsWith("B.E.P")) {
//     navigate("/projects/backendprojects");
//   }
// };



const handleNavigation = (id:string|undefined) => {
   
  navigate(`/projects/single-project/${id}`);
};



  // Use the provided gradient or default to mixed
  const bgGradient = gradient.includes('teal') ? gradientVariants.teal :
                   gradient.includes('blue') ? gradientVariants.blue :
                   gradient.includes('yellow') ? gradientVariants.yellow :
                   gradientVariants.mixed;

  const hoverGradient = gradient.includes('teal') ? hoverGradients.teal :
                       gradient.includes('blue') ? hoverGradients.blue :
                       gradient.includes('yellow') ? hoverGradients.yellow :
                       hoverGradients.mixed;

  return (
    <div onClick={()=>handleNavigation(id)} 
     className="group flex-shrink-0 w-[32rem] h-80 rounded-2xl overflow-hidden shadow-[inset_0_1px_2px_rgba(255,255,255,0.05),inset_0_-1px_2px_rgba(0,0,0,0.4),0_4px_12px_rgba(0,0,0,0.4)] border border-gray-600/30 transition-all duration-300 hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),inset_0_-1px_2px_rgba(0,0,0,0.5),0_6px_20px_rgba(0,0,0,0.5)] bg-slate-900 cursor-pointer">      
      
      {/* Main Content Area with darker gradient background */}
      <div className={`h-full w-full flex flex-col justify-between relative`}>
        
        {/* Cover/Image Section with gradient background */}
        <div className={`flex-1 p-4 bg-gradient-to-br ${bgGradient} relative`}>
          {/* Hover gradient overlay - only covers image area initially, extends down on hover */}
          <div className={`absolute inset-0 bg-gradient-to-br ${hoverGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 group-hover:bottom-[-4rem]`} />
          
          <div className="w-full h-full flex items-center justify-center relative z-10">
            {cover ? (
              <div className="relative w-full h-full rounded-lg overflow-hidden">
                <img
                  src={cover}
                  alt={title}
                  className="w-full h-full object-cover"
                />
                {/* Overlay Text */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <h2 className="text-2xl font-bold text-white text-center px-4">
                    {title}
                  </h2>
                </div>
              </div>
            ) : (
              <div className="w-full h-full rounded-lg bg-slate-800/40 flex items-center justify-center border border-slate-700/40 backdrop-blur-sm">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-white mb-4 tracking-wide">
                    {title}
                  </h2>
                  <div className="text-slate-400 text-sm mb-4">Replace with cover</div>
                  <Image size={28} className="mx-auto text-slate-500" />
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Bottom Info Section - separate from gradient */}
        <div className="flex gap-4 items-center p-4 pt-3 bg-slate-900 relative z-10">
          <div className="w-8 h-8 rounded-full bg-slate-700/50 border border-slate-600/50 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-slate-400"></div>
          </div>
          <div>
            <h3 className="font-medium text-white text-base tracking-wide">{title}</h3>
            <p className="text-slate-300 text-sm mt-1">{subtitle}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

 

interface WorkExperienceCardProps {
  role: string;
  company: string;
  period: string;
  duration: string;
  tags: string[];
  accentColor: string;
  cover?: string;
  gradient?: string;
  path: string;
}

export const WorkExperienceCard: React.FC<WorkExperienceCardProps> = ({
  role,
  company,
  period,
  duration,
  tags,
  accentColor,
  cover,
  gradient = "mixed",
  path,
}) => {
  const navigate = useNavigate();

  // ── Same gradient variants as ProjectCard ──
  const gradientVariants: Record<string, string> = {
    teal:   "from-black via-teal-950/95 to-slate-950",
    blue:   "from-black via-blue-950/95 to-slate-950",
    yellow: "from-black via-yellow-950/80 to-slate-950",
    mixed:  "from-black via-blue-950/80 via-teal-950/60 to-slate-950",
  };

  const hoverGradients: Record<string, string> = {
    teal:   "from-teal-800/40 via-teal-700/30 to-slate-800/20",
    blue:   "from-blue-800/40 via-blue-700/30 to-slate-800/20",
    yellow: "from-yellow-800/40 via-yellow-700/30 to-slate-800/20",
    mixed:  "from-blue-800/30 via-teal-700/25 to-yellow-800/15",
  };

  const bgGradient =
    gradient.includes("teal")   ? gradientVariants.teal   :
    gradient.includes("blue")   ? gradientVariants.blue   :
    gradient.includes("yellow") ? gradientVariants.yellow :
    gradientVariants.mixed;

  const hoverGradient =
    gradient.includes("teal")   ? hoverGradients.teal   :
    gradient.includes("blue")   ? hoverGradients.blue   :
    gradient.includes("yellow") ? hoverGradients.yellow :
    hoverGradients.mixed;

  return (
    <div
      onClick={() => navigate(path)}
      className="group flex-shrink-0 w-[32rem] h-80 rounded-2xl overflow-hidden shadow-[inset_0_1px_2px_rgba(255,255,255,0.05),inset_0_-1px_2px_rgba(0,0,0,0.4),0_4px_12px_rgba(0,0,0,0.4)] border border-gray-600/30 transition-all duration-300 hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),inset_0_-1px_2px_rgba(0,0,0,0.5),0_6px_20px_rgba(0,0,0,0.5)] bg-slate-900 cursor-pointer"
    >
      <div className="h-full w-full flex flex-col justify-between relative">

        {/* ── Top: cover area (same shell as ProjectCard) ── */}
        <div className={`flex-1 p-4 bg-gradient-to-br ${bgGradient} relative`}>
          {/* Accent top bar */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{ background: accentColor, opacity: 0.8 }}
          />

          {/* Hover overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${hoverGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
          />

          <div className="w-full h-full flex items-center justify-center relative z-10">
            {cover ? (
              <div className="relative w-full h-full rounded-lg overflow-hidden">
                <img src={cover} alt={company} className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <h2 className="text-2xl font-bold text-white text-center px-4">{role}</h2>
                </div>
              </div>
            ) : (
              /* No cover — show job info styled like ProjectCard's placeholder */
              <div className="w-full h-full rounded-lg bg-slate-800/40 flex flex-col items-center justify-center border border-slate-700/40 backdrop-blur-sm gap-3 px-6">
                {/* Company initials badge */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold border"
                  style={{
                    background: `${accentColor}18`,
                    color: accentColor,
                    borderColor: `${accentColor}30`,
                  }}
                >
                  {company.slice(0, 2).toUpperCase()}
                </div>

                {/* Role title */}
                <h2 className="text-2xl font-bold text-white text-center tracking-wide leading-snug">
                  {role}
                </h2>

                {/* Duration badge */}
                <span
                  className="text-[11px] font-mono px-3 py-1 rounded-full border"
                  style={{
                    color: accentColor,
                    borderColor: `${accentColor}40`,
                    background: `${accentColor}10`,
                  }}
                >
                  {duration} · {period}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── Bottom: info bar (same shell as ProjectCard) ── */}
        <div className="flex gap-4 items-center p-4 pt-3 bg-slate-900 relative z-10">
          {/* Avatar dot — tinted with accentColor instead of plain slate */}
          <div
            className="w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0"
            style={{
              background: `${accentColor}15`,
              borderColor: `${accentColor}35`,
            }}
          >
            <Briefcase size={14} style={{ color: accentColor }} />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-white text-base tracking-wide truncate">
              {role}
            </h3>
            <p className="text-slate-300 text-sm mt-1">{company}</p>
          </div>

          {/* Tags — right side of the bar */}
          <div className="flex gap-1.5 flex-shrink-0">
            {tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded-full border text-white/40"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  borderColor: "rgba(255,255,255,0.08)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

 
 

// ─────────────────────────────────────────────
// Gradient variants — same as ProjectCard
// ─────────────────────────────────────────────

const gradientVariants: Record<string, string> = {
  teal:   "from-black via-teal-950/95 to-slate-950",
  blue:   "from-black via-blue-950/95 to-slate-950",
  yellow: "from-black via-yellow-950/80 to-slate-950",
  mixed:  "from-black via-blue-950/80 via-teal-950/60 to-slate-950",
};

const hoverGradients: Record<string, string> = {
  teal:   "from-teal-800/40 via-teal-700/30 to-slate-800/20",
  blue:   "from-blue-800/40 via-blue-700/30 to-slate-800/20",
  yellow: "from-yellow-800/40 via-yellow-700/30 to-slate-800/20",
  mixed:  "from-blue-800/30 via-teal-700/25 to-yellow-800/15",
};

const cardGradientMap: Record<ExpertiseEntry["type"], string> = {
  skills: "teal",
  tools:  "yellow",
  cv:     "mixed",
};

// ─────────────────────────────────────────────
// Skills block
// ─────────────────────────────────────────────

function SkillsContent({ item }: { item: ExpertiseEntry }) {
  return (
    <div className="w-full h-full flex flex-col justify-center gap-3 px-1">
      {item.skillCategories?.map((cat) => (
        <div key={cat.label}>
          <p
            className="text-[11px] font-mono mb-1.5"
            style={{ color: cat.accent }}
          >
            {cat.label}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {cat.skills.map((skill) => (
              <span
                key={skill}
                className="text-[11px] px-2.5 py-0.5 rounded-full border text-white/50 hover:text-white/80 transition-colors"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  borderColor: "rgba(255,255,255,0.08)",
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// Tools block
// ─────────────────────────────────────────────

function ToolsContent({ item }: { item: ExpertiseEntry }) {
  return (
    <div className="w-full h-full grid grid-cols-3 gap-2 content-center">
      {item.tools?.map((tool) => (
        <div
          key={tool.name}
          className="flex flex-col items-center gap-1.5 py-2 px-1 rounded-xl border transition-colors group/tool"
          style={{
            background: "rgba(255,255,255,0.03)",
            borderColor: "rgba(255,255,255,0.07)",
          }}
        >
          <span className="text-xl">{tool.icon}</span>
          <span className="text-[10px] text-white/40 group-hover/tool:text-white/65 transition-colors text-center leading-tight">
            {tool.name}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// CV block
// ─────────────────────────────────────────────

function CVContent({ item }: { item: ExpertiseEntry }) {
  const cv = item.cv!;
  return (
    <div className="w-full h-full flex flex-col justify-between">
      {/* Info */}
      <div>
        <p className="text-white text-[15px] font-semibold leading-tight">{cv.name}</p>
        <p className="text-white/40 text-[13px] mt-1">{cv.title}</p>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-[11px] font-mono text-white/25">Updated {cv.lastUpdated}</span>
          <span className="text-[11px] font-mono text-white/25">PDF · {cv.fileSize}</span>
        </div>

        {/* Document preview skeleton */}
        <div
          className="mt-3 p-3 rounded-xl border"
          style={{
            background: "rgba(255,255,255,0.03)",
            borderColor: "rgba(255,255,255,0.07)",
          }}
        >
          <div className="h-[5px] w-3/5 rounded-full bg-white/10 mb-2" />
          <div className="h-[4px] w-11/12 rounded-full bg-white/[0.06] mb-1.5" />
          <div className="h-[4px] w-4/5 rounded-full bg-white/[0.06] mb-1.5" />
          <div className="h-[4px] w-2/3 rounded-full bg-white/[0.06]" />
        </div>
      </div>

      {/* Download button — uses slate tones, no green */}
      <a
        href={cv.downloadUrl}
        download
        onClick={(e) => e.stopPropagation()}
        className="mt-3 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 hover:opacity-90 active:scale-[0.98] border"
        style={{
          background: "rgba(255,255,255,0.08)",
          borderColor: "rgba(255,255,255,0.13)",
          color: "rgba(255,255,255,0.85)",
        }}
      >
        ↓ Download CV
      </a>
    </div>
  );
}

// ─────────────────────────────────────────────
// Label map for the bottom bar
// ─────────────────────────────────────────────

const bottomLabel: Record<ExpertiseEntry["type"], { title: string; subtitle: string }> = {
  skills: { title: "Skills",           subtitle: "Design · Front-End · Back-End" },
  tools:  { title: "Tools",            subtitle: "Everything in my stack" },
  cv:     { title: "Curriculum Vitae", subtitle: "Download my latest CV" },
};

const bottomIcon: Record<ExpertiseEntry["type"], string> = {
  skills: "🧠",
  tools:  "🔧",
  cv:     "📄",
};

// ─────────────────────────────────────────────
// SkillsCVCard — same outer shell as ProjectCard
// ─────────────────────────────────────────────

interface SkillsCVCardProps {
  item: ExpertiseEntry;
}

export const SkillsCVCard: React.FC<SkillsCVCardProps> = ({ item }) => {
  const navigate = useNavigate();
  const gradientKey = cardGradientMap[item.type];
  const bgGradient   = gradientVariants[gradientKey];
  const hoverGradient = hoverGradients[gradientKey];
  const label = bottomLabel[item.type];

  return (
    <div
      onClick={() => navigate(item.path)}
      className="group flex-shrink-0 w-[32rem] h-80 rounded-2xl overflow-hidden shadow-[inset_0_1px_2px_rgba(255,255,255,0.05),inset_0_-1px_2px_rgba(0,0,0,0.4),0_4px_12px_rgba(0,0,0,0.4)] border border-gray-600/30 transition-all duration-300 hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),inset_0_-1px_2px_rgba(0,0,0,0.5),0_6px_20px_rgba(0,0,0,0.5)] bg-slate-900 cursor-pointer"
    >
      <div className="h-full w-full flex flex-col justify-between relative">

        {/* ── Top content area ── */}
        <div className={`flex-1 p-4 bg-gradient-to-br ${bgGradient} relative overflow-hidden`}>
          {/* Hover overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${hoverGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
          />
          <div className="relative z-10 w-full h-full">
            {item.type === "skills" && <SkillsContent item={item} />}
            {item.type === "tools"  && <ToolsContent  item={item} />}
            {item.type === "cv"     && <CVContent     item={item} />}
          </div>
        </div>

        {/* ── Bottom info bar — identical structure to ProjectCard ── */}
        <div className="flex gap-4 items-center p-4 pt-3 bg-slate-900 relative z-10">
          <div className="w-8 h-8 rounded-full bg-slate-700/50 border border-slate-600/50 flex items-center justify-center text-base flex-shrink-0">
            {bottomIcon[item.type]}
          </div>
          <div>
            <h3 className="font-medium text-white text-base tracking-wide">{label.title}</h3>
            <p className="text-slate-300 text-sm mt-1">{label.subtitle}</p>
          </div>
        </div>

      </div>
    </div>
  );
};

 export default ProjectCard