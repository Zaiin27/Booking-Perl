import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const MainWebLayout = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return (
    <div className="min-h-screen bg-[#003b95] flex flex-col">
      {/* Fixed Header */}
      <Header />

      {/* Dynamic Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Fixed Footer */}
      <Footer />
    </div>
  );
};

export default MainWebLayout;
