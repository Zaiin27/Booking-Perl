import React from "react";
import { FaShieldAlt, FaCheckCircle, FaCrown } from "react-icons/fa";

const PlanBadges = ({ property }) => {
  if (!property?.planFeatures) return null;

  const badges = [];

  if (property.planFeatures.verifiedBadge) {
    badges.push({
      icon: <FaCheckCircle />,
      label: "Verified",
      color: "blue",
      className: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    });
  }

  if (property.planFeatures.trustedHostBadge) {
    badges.push({
      icon: <FaShieldAlt />,
      label: "Trusted Host",
      color: "green",
      className: "bg-green-500/20 text-green-400 border-green-500/30",
    });
  }

  if (property.planFeatures.premiumBadge) {
    badges.push({
      icon: <FaCrown />,
      label: "Premium",
      color: "yellow",
      className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    });
  }

  if (property.isFeatured) {
    badges.push({
      icon: <FaCrown />,
      label: "Featured",
      color: "purple",
      className: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    });
  }

  if (badges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge, index) => (
        <span
          key={index}
          className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border ${badge.className}`}
        >
          {badge.icon}
          {badge.label}
        </span>
      ))}
    </div>
  );
};

export default PlanBadges;
