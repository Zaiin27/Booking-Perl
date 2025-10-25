import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

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
    <div className="flex h-screen w-full max-w-[100vw] bg-[#060b27]">
      {/* Sidebar */}
      <div className="fixed h-screen z-50">
        <Sidebar
          setActivePage={handlePageChange}
          isMobileSidebarOpen={isMobileSidebarOpen}
          toggleSidebar={toggleSidebar}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 w-full">
        {/* Header with mobile menu button */}
        <div className="fixed top-0 right-0 w-full z-40">
          <Header toggleSidebar={toggleSidebar} />
        </div>

        {/* Main Content */}
        <main className="flex-1 scrollbar-custom text-text-black md:pl-[18.5625rem]  pt-[5rem]">
          <div className="h-full bg-[#060b27]">
            <Outlet key={pathname} />
          </div>
        </main>
        {/* <div className="fixed block md:hidden mt-10 bottom-0 left-0 right-0">
                    <BottomNavbar />
                </div> */}
      </div>
    </div>
  );
}

export default AppLayout;
