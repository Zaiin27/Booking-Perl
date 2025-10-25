import React from "react";
import { useSelector } from "react-redux";

const ProfileHero = () => {
  const { user } = useSelector((state) => state.auth);
  
  // Get user name, fallback to email if name not available
  const userName = user?.name || user?.email?.split('@')[0] || 'User';
  
  return (
    <div className="flex flex-col items-center justify-center gap-2 mb-8 z-10 pt-32">
      <svg
        width="41"
        height="40"
        viewBox="0 0 41 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20.4297 0C31.4754 0 40.4297 8.9543 40.4297 20C40.4297 31.0457 31.4754 40 20.4297 40C9.38399 40 0.429688 31.0457 0.429688 20C0.429688 8.9543 9.38399 0 20.4297 0C20.4297 15 7.09635 20 0.429688 20C15.4297 20 20.4297 33.3333 20.4297 40C20.4297 25 33.763 20 40.4297 20C25.4297 20 20.4297 6.66667 20.4297 0Z"
          fill="url(#paint0_linear_573_10507)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_573_10507"
            x1="0.429688"
            y1="20"
            x2="40.4297"
            y2="20"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#9945FF" />
            <stop offset="1" stopColor="#14F195" />
          </linearGradient>
        </defs>
      </svg>
      <div className="">
        <span className="text-white text-3xl md:text-[50px] !font-bold font-inter">
          Welcome back{" "}
        </span>
        <span className="bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent text-3xl md:text-[50px] !font-bold font-inter">
          {userName}!
        </span>
      </div>
    </div>
  );
};

export default ProfileHero;
