import CVCard from "@/features/expertise/cvCard";
import SkillsCard from "@/features/expertise/skillsCard";
import ToolsCard from "@/features/expertise/toolsCard";

const Expertise = () => {
  return (
    <div className="min-h-screen pb-32">

      {/* ── Header ───────────────────────────────── */}
      <section className="px-40 pt-16 pb-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">✨</span>
          <h1 className="text-7xl font-bold text-white">Expertise</h1>
        </div>
        <p className="text-xl text-white/60 max-w-3xl leading-relaxed">
          A full view of my craft — the skills I've built, the tools I rely on daily,
          and my resume available to download.
        </p>
      </section>

      {/* ── Cards ── */}
      <section className="px-40 pb-16">
        <div className="flex gap-6 items-start">

          {/* Left column — 80% — ToolsCard + CVCard stacked */}
          <div className="flex flex-col gap-6 w-[80%]">
            <ToolsCard className="w-full" />
            <CVCard    className="w-full" />
          </div>

          {/* Right column — 20% — SkillsCard, content wraps naturally */}
          <div className="w-[20%] shrink-0">
            <SkillsCard className="w-full" />
          </div>

        </div>
      </section>

    </div>
  );
};

export default Expertise;