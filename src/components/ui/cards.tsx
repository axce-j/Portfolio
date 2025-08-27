import { Image } from "lucide-react";
import React from "react";

interface ProjectCardProps {
  title: string;
  subtitle: string;
  cover?: string;
  gradient?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  subtitle,
  cover,
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
    <div className="group flex-shrink-0 w-[32rem] h-80 rounded-2xl overflow-hidden shadow-[inset_0_1px_2px_rgba(255,255,255,0.05),inset_0_-1px_2px_rgba(0,0,0,0.4),0_4px_12px_rgba(0,0,0,0.4)] border border-gray-600/30 transition-all duration-300 hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),inset_0_-1px_2px_rgba(0,0,0,0.5),0_6px_20px_rgba(0,0,0,0.5)] bg-slate-900">      
      
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

export default ProjectCard;