import React from "react";
  
import { CareerEntry } from "./data/careerData";

interface CareerCircleProps {
  career: CareerEntry;
  isActive: boolean;
  onClick: () => void;
  index: number;
  totalVisible: number;
}

const CareerCircle: React.FC<CareerCircleProps> = ({ 
  career, 
  isActive, 
  onClick, 
  index, 
  totalVisible 
}) => {
  const center = (totalVisible - 1) / 2;
  const offset = index - center;
  const angle = (offset / totalVisible) * Math.PI * 0.9;
  const radius = 70;
  
  const x = Math.sin(angle) * radius;
  const y = offset * 110;

  return (
    <button
      onClick={onClick}
      className={`
        group absolute flex items-center justify-center rounded-full border transition-all duration-300
        ${isActive 
          ? "w-20 h-20 border-[#2dd4bf] shadow-[0_0_20px_rgba(45,212,191,0.4)] z-20" 
          : "w-16 h-16 border-white/20 opacity-60 hover:opacity-100 hover:scale-110 z-10"
        }
        bg-slate-800
        hover:border-white/40
      `}
      style={{
        transform: `translate(${x}px, ${y}px)`,
        borderRadius: "9999px",
        overflow: "hidden",
      }}
    >
      {career.image ? (
        <img
          src={career.image}
          alt={career.organization}
          className="w-full h-full"
          style={{
            objectFit: "contain",
            objectPosition: "center",
            padding: "4px",
            borderRadius: "9999px",
            imageRendering: "crisp-edges",
          }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-lg font-bold text-[#2dd4bf]">
          {career.organization.slice(0, 2).toUpperCase()}
        </div>
      )}

      {isActive && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#2dd4bf] rounded-full animate-pulse" />
      )}

      <div className="absolute left-full ml-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30">
        <div className="bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5">
          <p className="text-white text-xs font-medium">{career.organization}</p>
          <p className="text-white/40 text-[10px]">{career.startDate}</p>
        </div>
      </div>
    </button>
  );
};

export default CareerCircle;