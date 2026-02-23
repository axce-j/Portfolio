import { Download, Linkedin, Briefcase, GraduationCap, User } from "lucide-react";
import { cvInfo } from "./data/expertiseData";

interface CVCardProps {
  className?: string;
}

const CVCard = ({ className = "" }: CVCardProps) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = cvInfo.downloadUrl;
    link.download = `${cvInfo.name.replace(/\s+/g, "-")}-CV.pdf`;
    link.click();
  };

  const handleLinkedIn = () => {
    window.open(cvInfo.linkedInUrl, "_blank", "noopener noreferrer");
  };

  return (
    <div
      className={[
        "relative flex flex-col gap-5 p-6 rounded-2xl overflow-hidden",
        "bg-gradient-to-br from-blue-900/20 via-gray-900/60 to-gray-950/80",
        "border border-white/5",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_8px_40px_rgba(0,0,0,0.4)]",
        "backdrop-blur-md",
        className,
      ].join(" ")}
    >
      {/* Glow */}
      <div className="absolute -bottom-10 -right-10 w-56 h-56 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

      {/* ── Header: name + title ── */}
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-white/90 leading-tight">{cvInfo.name}</h3>
          <p className="text-xs text-white/50 mt-1 leading-snug">{cvInfo.title}</p>
          <p className="text-[10px] text-white/30 mt-2">
            Updated {cvInfo.updatedDate} · PDF · {cvInfo.fileSize}
          </p>
        </div>
        {/* LinkedIn pill */}
        <button
          onClick={handleLinkedIn}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
            bg-[#0A66C2]/20 border border-[#0A66C2]/30
            hover:bg-[#0A66C2]/40 hover:border-[#0A66C2]/60
            text-[#5B9BD5] hover:text-white
            text-[10px] font-medium
            transition-all duration-200 shrink-0"
        >
          <Linkedin className="w-3 h-3" />
          LinkedIn
        </button>
      </div>

      {/* ── Summary ── */}
      <div className="relative z-10">
        <div className="flex items-center gap-1.5 mb-1.5">
          <User className="w-3 h-3 text-white/30" />
          <span className="text-[10px] font-semibold tracking-widest uppercase text-white/30">Summary</span>
        </div>
        <p className="text-xs text-white/55 leading-relaxed">{cvInfo.summary}</p>
      </div>

      {/* ── Experience ── */}
      <div className="relative z-10">
        <div className="flex items-center gap-1.5 mb-2.5">
          <Briefcase className="w-3 h-3 text-white/30" />
          <span className="text-[10px] font-semibold tracking-widest uppercase text-white/30">Experience</span>
        </div>
        <div className="flex flex-col gap-2.5">
          {cvInfo.experience.map((exp, i) => (
            <div key={i} className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-medium text-white/80 leading-tight">{exp.role}</p>
                <p className="text-[10px] text-white/40 mt-0.5">{exp.org} · {exp.location}</p>
              </div>
              <span className="text-[10px] text-white/30 shrink-0 mt-0.5">{exp.period}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="relative z-10 h-px bg-white/5" />

      {/* ── Education ── */}
      <div className="relative z-10">
        <div className="flex items-center gap-1.5 mb-2.5">
          <GraduationCap className="w-3 h-3 text-white/30" />
          <span className="text-[10px] font-semibold tracking-widest uppercase text-white/30">Education</span>
        </div>
        {cvInfo.education.map((edu, i) => (
          <div key={i} className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-medium text-white/80 leading-tight">{edu.degree}</p>
              <p className="text-[10px] text-white/40 mt-0.5">{edu.org}</p>
            </div>
            <span className="text-[10px] text-white/30 shrink-0 mt-0.5">{edu.period}</span>
          </div>
        ))}
      </div>

      {/* ── Action buttons ── */}
      <div className="relative z-10 flex gap-2 mt-1">
        <button
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl
            bg-white/[0.08] border border-white/10
            hover:bg-white/15 hover:border-white/20
            text-white/70 hover:text-white
            text-xs font-medium
            transition-all duration-200 group/btn"
        >
          <Download className="w-3.5 h-3.5 group-hover/btn:-translate-y-0.5 transition-transform duration-200" />
          Download CV
        </button>
        <button
          onClick={handleLinkedIn}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl
            bg-[#0A66C2]/15 border border-[#0A66C2]/25
            hover:bg-[#0A66C2]/30 hover:border-[#0A66C2]/50
            text-[#5B9BD5] hover:text-white
            text-xs font-medium
            transition-all duration-200"
        >
          <Linkedin className="w-3.5 h-3.5" />
          View Profile
        </button>
      </div>

      {/* ── Footer ── */}
      <div className="relative z-10 flex items-center gap-3 pt-4 border-t border-white/5">
        <span className="text-lg">📄</span>
        <div>
          <p className="text-sm font-semibold text-white/90">Curriculum Vitae</p>
          <p className="text-xs text-white/40">Full résumé · LinkedIn profile</p>
        </div>
      </div>
    </div>
  );
};

export default CVCard;