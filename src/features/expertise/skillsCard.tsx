import { skillCategories } from "./data/expertiseData";

interface SkillsCardProps {
  className?: string;
}

const SkillsCard = ({ className = "" }: SkillsCardProps) => {
  return (
    <div
      className={[
        "relative flex flex-col justify-between p-6 rounded-2xl overflow-hidden",
        "bg-gradient-to-br from-teal-900/30 via-gray-900/60 to-gray-950/80",
        "border border-white/5",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_8px_40px_rgba(0,0,0,0.4)]",
        "backdrop-blur-md group",
        className,
      ].join(" ")}
    >
      {/* Subtle radial glow top-left */}
      <div className="absolute -top-8 -left-8 w-48 h-48 rounded-full bg-teal-500/10 blur-2xl pointer-events-none" />

      {/* Skills list */}
      <div className="relative z-10 flex flex-col gap-4">
        {skillCategories.map((cat) => (
          <div key={cat.label}>
            <span className={`text-xs font-semibold tracking-widest uppercase ${cat.color} mb-2 block`}>
              {cat.label}
            </span>
            <div className="flex flex-wrap gap-2">
              {cat.items.map((skill) => (
                <span
                  key={skill}
                  className="text-xs px-2.5 py-1 rounded-full border border-white/10 text-white/70
                    bg-white/5 hover:bg-white/10 hover:text-white/90 transition-all duration-200 cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer label */}
      <div className="relative z-10 flex items-center gap-3 mt-6 pt-4 border-t border-white/5">
        <span className="text-lg">🧠</span>
        <div>
          <p className="text-sm font-semibold text-white/90">Skills</p>
          <p className="text-xs text-white/40">Design · Front-End · Back-End · Human</p>
        </div>
      </div>
    </div>
  );
};

export default SkillsCard;