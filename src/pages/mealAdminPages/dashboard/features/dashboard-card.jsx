import React from "react";

// Simple Stat Card Component
const StatCard = React.memo(({ title, value, icon: Icon, className = "", gradient = "from-[#9945FF] to-[#14F195]" }) => {
  return (
    <div
      className={`relative overflow-hidden group bg-[#171D41] rounded-[24px] p-5 sm:p-6 border border-[#FFFFFF0D] hover:border-[#FFFFFF1A] transition-all duration-300 shadow-xl ${className}`}
    >
      {/* Subtle Background Glow */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${gradient} opacity-5 blur-3xl group-hover:opacity-10 transition-opacity`}></div>

      <div className="flex justify-between items-center relative z-10">
        <div className="flex flex-col gap-1">
          <h3 className="text-xs text-[#AEB9E1] font-semibold uppercase tracking-[0.15em] opacity-60">{title}</h3>
          <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">{value}</div>
        </div>
        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.3)] group-hover:scale-110 transition-transform duration-500`}>
          {Icon && <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={2} />}
        </div>
      </div>

      {/* Bottom accent line */}
      <div className={`absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-100 transition-opacity rounded-full`}></div>
    </div>
  );
});

StatCard.displayName = "StatCard";

// Simple container for three cards - spreads them evenly across 1046p

export default StatCard;
