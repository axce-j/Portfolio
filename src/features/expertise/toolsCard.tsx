import { tools } from "./data/expertiseData";

interface ToolsCardProps {
  className?: string;
}

const ToolsCard = ({ className = "" }: ToolsCardProps) => {
  return (
    <div
      className={[
        "relative flex flex-col justify-between p-6 rounded-2xl overflow-hidden",
        "bg-gradient-to-br from-orange-900/20 via-gray-900/60 to-gray-950/80",
        "border border-white/5",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_8px_40px_rgba(0,0,0,0.4)]",
        "backdrop-blur-md group",
        className,
      ].join(" ")}
    >
      {/* Subtle radial glow top-right */}
      <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-orange-500/10 blur-2xl pointer-events-none" />

      {/* Tools grid — wraps automatically based on card width */}
      <div
        className="relative z-10 grid gap-3"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(5rem, 1fr))" }}
      >
        {tools.map((tool) => (
          <div
            key={tool.name}
            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl
              bg-white/5 border border-white/5
              hover:bg-white/10 hover:border-white/10
              transition-all duration-200 cursor-default group/tool"
          >
            <span className="text-2xl leading-none group-hover/tool:scale-110 transition-transform duration-200">
              {tool.icon}
            </span>
            <span className="text-[10px] text-white/50 group-hover/tool:text-white/80 transition-colors duration-200 text-center leading-tight">
              {tool.name}
            </span>
          </div>
        ))}
      </div>

      {/* Footer label */}
      <div className="relative z-10 flex items-center gap-3 mt-6 pt-4 border-t border-white/5">
        <span className="text-lg">🔧</span>
        <div>
          <p className="text-sm font-semibold text-white/90">Tools</p>
          <p className="text-xs text-white/40">Everything in my stack</p>
        </div>
      </div>
    </div>
  );
};

export default ToolsCard;