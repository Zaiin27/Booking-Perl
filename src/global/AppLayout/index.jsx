import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import BottomNavbar from "./BottomNavbar";

function AppLayout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const { pathname } = useLocation();

  const toggleSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const handlePageChange = () => {
    setIsMobileSidebarOpen(false); // Close sidebar on mobile when selecting a page
  };

  // Close sidebar when route changes
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  // Ensure URL is properly updated
  useEffect(() => {
    // Force URL update if needed
    if (window.location.pathname !== pathname) {
      console.log(`URL mismatch detected: window.location.pathname=${window.location.pathname}, pathname=${pathname}`);
    }
    console.log(`AppLayout: Current pathname is ${pathname}`);
  }, [pathname]);

  // Reset navigation state when route changes
  useEffect(() => {
    // Ensure body overflow is properly reset on route changes
    document.body.style.overflow = "unset";
  }, [pathname]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobileSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileSidebarOpen]);

  return (
    <div className="flex h-screen w-full max-w-[100vw] bg-[#0A1330] overflow-hidden">
      {/* Sidebar for Desktop / Mobile Overlay */}
      <div className="fixed h-screen z-[60] pointer-events-none">
        <div className="pointer-events-auto h-full">
          <Sidebar
            setActivePage={handlePageChange}
            isMobileSidebarOpen={isMobileSidebarOpen}
            toggleSidebar={toggleSidebar}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 w-full relative h-screen">
        {/* Unified App Header */}
        <div className="fixed top-0 right-0 w-full z-40 bg-[#0A1330]/80 backdrop-blur-2xl">
          <Header toggleSidebar={toggleSidebar} />
        </div>

        {/* Dynamic Page Content */}
        <main className="flex-1 scrollbar-custom text-[#EDEDED] lg:pl-[18.5625rem] pt-[4.5rem] lg:pt-[5.5rem] pb-24 lg:pb-0 overflow-y-auto overflow-x-hidden">
          <div className="min-h-full transition-all duration-300 ease-in-out">
            <Outlet key={pathname} />
          </div>
        </main>

        {/* Global Bottom Navigation (Touch First) */}
        <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden pointer-events-none">
          <div className="pointer-events-auto pb-4 px-4 bg-gradient-to-t from-[#0A1330] via-[#0A1330]/90 to-transparent pt-8">
            <BottomNavbar />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppLayout;
