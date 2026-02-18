import React from "react";
import { Career } from "./data/careerData";

import testImage1 from "@/assets/profilePic1.jpeg";  
import testImage from "@/assets/profilePic3.jpeg";  


interface CareerCircleProps {
  career: Career;
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
  // Calculate arc position for 3 visible items (semicircular vertical curve)
  // Center is at index 1 (middle item)
  const center = (totalVisible - 1) / 2;
  const offset = index - center;
  const angle = (offset / totalVisible) * Math.PI * 0.9; // Spread across ~160 degrees
  const radius = 70; // Distance from center line
  
  const x = Math.sin(angle) * radius;
  const y = offset * 110; // Vertical spacing between circles

  return (
    <button
      onClick={onClick}
      className={`
        group absolute flex items-center justify-center rounded-full border transition-all duration-300 overflow-hidden
        ${isActive 
          ? "w-20 h-20 border-[#2dd4bf] shadow-[0_0_20px_rgba(45,212,191,0.4)] z-20" 
          : "w-16 h-16 border-white/20 opacity-60 hover:opacity-100 hover:scale-110 z-10"
        }
        bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm
        hover:border-white/40
      `}
      style={{
        transform: `translate(${x}px, ${y}px)`,
      }}
    >
      {/* Image */}
      {career.image ? (
        <img 
          src={testImage1} 
          alt={career.organization}
          className="w-full h-full object-cover"
        />
      ) : (
        <img 
        src={testImage} 
        alt={career.organization}
        className="w-full h-full object-cover"
      />      )}

      {/* Active indicator dot */}
      {isActive && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#2dd4bf] rounded-full animate-pulse" />
      )}

      {/* Tooltip on hover */}
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