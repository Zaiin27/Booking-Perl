import React from "react";

// Simple Stat Card Component
const StatCard = React.memo(({ title, value, icon: Icon, className = "" }) => {
  return (
    <div
      className={`bg-[#171D41] rounded-lg p-4 shadow-sm ${className}`}
      style={{
        // width: '21.25rem',
        height: "6.25rem",
        borderRadius: "0.5rem",
      }}
    >
      <div className="flex justify-between items-start h-full">
        <div className="flex flex-col justify-between h-full">
          <h3 className="text-sm text-white font-normal">{title}</h3>
          <div className="text-2xl font-semibold text-white">{value}</div>
        </div>
        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#9945FF] to-[#14F195] flex items-center justify-center">
          {Icon && <Icon className="w-5 h-5 text-white" />}
        </div>
      </div>
    </div>
  );
});

StatCard.displayName = "StatCard";

// Simple container for three cards - spreads them evenly across 1046p

export default StatCard;
