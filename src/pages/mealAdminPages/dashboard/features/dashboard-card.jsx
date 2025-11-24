import React from "react";

// Simple Stat Card Component
const StatCard = React.memo(({ title, value, icon: Icon, className = "", gradient = "from-[#9945FF] to-[#14F195]" }) => {
  return (
    <div
      className={`bg-[#171D41] rounded-lg p-4 sm:p-6 shadow-sm border border-[#3A3A4E] hover:border-[#14F195]/50 transition-all duration-300 ${className}`}
      style={{
        borderRadius: "0.5rem",
      }}
    >
      <div className="flex justify-between items-start h-full">
        <div className="flex flex-col justify-between h-full flex-1">
          <h3 className="text-xs sm:text-sm text-[#AEB9E1] font-medium mb-2">{title}</h3>
          <div className="text-xl sm:text-2xl font-bold text-white">{value}</div>
        </div>
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-r ${gradient} flex items-center justify-center shadow-lg`}>
          {Icon && <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />}
        </div>
      </div>
    </div>
  );
});

StatCard.displayName = "StatCard";

// Simple container for three cards - spreads them evenly across 1046p

export default StatCard;
