import React from "react";
import { LucideIcon } from "lucide-react";

interface ContactMethodCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
  accentColor?: string;
}

const ContactMethodCard: React.FC<ContactMethodCardProps> = ({
  icon: Icon,
  label,
  value,
  href,
  accentColor = "#2dd4bf",
}) => {
  const CardContent = (
    <div className="flex items-center gap-4 p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 group cursor-pointer bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm hover:from-white/8 hover:to-white/12">
      {/* Icon container */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center border flex-shrink-0"
        style={{
          background: `${accentColor}15`,
          borderColor: `${accentColor}30`,
        }}
      >
        <Icon size={22} style={{ color: accentColor }} />
      </div>

      {/* Text content */}
      <div className="flex-1 min-w-0">
        <p className="text-white/40 text-xs font-medium mb-1">{label}</p>
        <p className="text-white text-sm font-medium leading-tight group-hover:text-white/90 transition-colors">
          {value}
        </p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block">
        {CardContent}
      </a>
    );
  }

  return CardContent;
};

export default ContactMethodCard;