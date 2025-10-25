"use client";

import { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  useNavigate,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, clearUser } from "../../store/slices/authSlice";
import { persistor } from "../../store";
import {
  DashboardIcon,
  OrdersIcon,
  TicketsIcon,
  StaffIcon,
  SettingsIcon,
  LogoutIcon,
  ChatIcon,
  XIcon,
} from "../../assets/icons";
import { FaBuilding, FaCalendarCheck } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";

function Sidebar({ isMobileSidebarOpen, toggleSidebar, setActivePage }) {
  const [othersExpanded, setOthersExpanded] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const selectedStatus = searchParams.get("role");
  const [logoLoaded, setLogoLoaded] = useState(false);
  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobileSidebarOpen &&
        !event.target.closest(".sidebar-content") &&
        !event.target.closest(".mobile-menu-button")
      ) {
        toggleSidebar();
      }
    };

    if (isMobileSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Prevent scrolling when mobile sidebar is open
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      // Restore scrolling when mobile sidebar is closed
      document.body.style.overflow = "unset";
    };
  }, [isMobileSidebarOpen, toggleSidebar]);

  // React Icons for sidebar navigation

  const getRoleBasedMenuItems = (role) => {
    const menu = {
      admin: {
        main: [
          { path: "/admin/dashboard", name: "Dashboard", icon: DashboardIcon },
          { path: "/admin/properties", name: "Properties", icon: FaBuilding },
          { path: "/admin/bookings", name: "Bookings", icon: FaCalendarCheck },
          { path: "/admin/staff", name: "Staff", icon: StaffIcon },
        ],
        bottom: [
          { path: "/admin/settings", name: "Settings", icon: SettingsIcon },
        ],
      },
      staff: {
        main: [
          { path: "/staff/dashboard", name: "Dashboard", icon: DashboardIcon },
          { path: "/staff/properties", name: "Properties", icon: FaBuilding },
          { path: "/staff/bookings", name: "Bookings", icon: FaCalendarCheck },
        ],
        bottom: [
          { path: "/staff/settings", name: "Settings", icon: SettingsIcon },
        ],
      },
      "company-owner": {
        main: [
          {
            path: "/company-owner/dashboard",
            name: "Dashboard",
            icon: DashboardIcon,
          },
          {
            path: "/company-owner/orders",
            name: "My Orders",
            icon: OrdersIcon,
          },
        ],
        bottom: [
          {
            path: "/company-owner/tickets",
            name: "Support",
            icon: TicketsIcon,
          },
          { path: "/company-owner/profile", name: "Profile", icon: StaffIcon },
          {
            path: "/company-owner/settings",
            name: "Settings",
            icon: SettingsIcon,
          },
        ],
      },
      user: {
        main: [
          {
            path: "/user/orders",
            name: "My Orders",
            icon: OrdersIcon,
          },
          {
            path: "/user/tickets",
            name: "Support",
            icon: TicketsIcon,
          },
        ],
        bottom: [
          {
            path: "/user/profile",
            name: "Profile",
            icon: StaffIcon,
          },
          {
            path: "/user/settings",
            name: "Settings",
            icon: SettingsIcon,
          },
        ],
      },
    };

    return menu[role] || {};
  };
  const currentUser = useSelector((state) => state.auth.user);
  const currentRole = currentUser?.role;

  // Determine role based on current URL path (for development/testing)
  const getRoleFromPath = () => {
    if (location.pathname.startsWith("/admin")) return "admin";
    if (location.pathname.startsWith("/staff")) return "staff";
    if (location.pathname.startsWith("/company-owner")) return "company-owner";
    if (location.pathname.startsWith("/user")) return "user";
    return null;
  };

  // Use Redux role if available, otherwise use path-based role detection
  const roleName = currentRole || getRoleFromPath();

  const menuItems = getRoleBasedMenuItems(roleName);

  // Fallback for testing - if no role is detected, show user menu
  const finalMenuItems = menuItems?.main
    ? menuItems
    : getRoleBasedMenuItems("user");
  // Utility function to render NavLink items
  const handleLogout = async () => {
    try {
      console.log("Starting logout process...");

      // Clear local state immediately
      persistor.purge();
      console.log("Persisted state cleared");

      // Clear Redux state
      dispatch(clearUser());
      console.log("Redux state cleared");

      // Navigate to login
      navigate("/login");
      console.log("Navigated to login page");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout fails, clear local state and redirect
      persistor.purge();
      dispatch(clearUser());
      navigate("/login");
    }
  };
  const isMobile = window.innerWidth <= 768; // Adjust the breakpoint as needed

  const handleClickMobile = () => {
    if (isMobile) {
      toggleSidebar(); // your custom function
    }
  };
  const renderNavLink = (item, extraClasses = "") => {
    // Check if this item should be active based on current location
    const isActive =
      location.pathname === item.path ||
      location.pathname.startsWith(item.path + "/");

    const handleNavigation = () => {
      handleClickMobile();
      
      // Always navigate to ensure proper routing
      console.log(`Navigating from ${location.pathname} to ${item.path}`);
      
      // Force navigation
      navigate(item.path, { replace: false });
    };

    return (
      <div
        onClick={handleNavigation}
        className={`
          flex items-center w-full h-[42px] pl-[10px] pr-4 gap-[10px] group transition-all duration-200 relative rounded-md cursor-pointer
          ${
            isActive
              ? "bg-[#7E89AC33] text-white"
              : "text-white/70 hover:bg-white/5 hover:text-white"
          }
          ${extraClasses}
        `}
      >
        {/* Active state left indicator bar */}
        {isActive && (
          <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-[#14F195] to-[#9945FF] rounded-l-md"></div>
        )}

        <div
          className={`w-5 h-5 flex items-center justify-center ${
            isActive ? "text-white" : "text-white/70"
          }`}
        >
          <item.icon />
        </div>
        <span className="text-[15px] font-medium leading-[25px] font-inter">
          {item.name}
        </span>
        {item.badge && (
          <span className="ml-auto bg-white/20 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {item.badge}
          </span>
        )}
      </div>
    );
  };

  const renderSidebarContent = () => {
    // Debug logging
    console.log("Current user from Redux:", currentUser);
    console.log("Current role from Redux:", currentRole);
    console.log("Role name (detected):", roleName);
    console.log("Current path:", location.pathname);
    console.log("Menu items:", menuItems);

    return (
      <div className="sidebar-content w-[18.5625rem] bg-[#060B27] flex flex-col h-[100vh] relative pl-0 sm:pl-4 py-0 sm:py-4">
        <div className="bg-[#121B36] rounded-lg flex flex-col h-full">
          {/* Mobile close button */}
          <button
            onClick={toggleSidebar}
            className="absolute top-4 right-4 text-white/70 hover:text-white md:hidden z-50"
          >
            <XIcon size={20} />
          </button>

          {/* Brand Section */}
          <div className="pt-8 pb-8 px-6">
            <h1 className="text-white text-xl font-bold font-inter tracking-wide">
              FORKWARD.
            </h1>
          </div>

          {/* Navigation Section */}
          <nav className="flex-1 px-4">
            <div className="space-y-1">
              {finalMenuItems?.main?.map((item, index) => (
                <div key={index}>{renderNavLink(item)}</div>
              ))}
            </div>

            {/* Divider */}
            <div className="my-6 border-t border-white/20"></div>

            {/* Bottom Navigation */}
            <div className="space-y-1">
              {finalMenuItems?.bottom?.map((item, index) => (
                <div key={index}>{renderNavLink(item)}</div>
              ))}
            </div>
          </nav>

          {/* User Section */}
          <div className="p-4">
            <div className="flex items-center gap-3 mb-4 border-b border-[#7E89AC33] pb-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                {roleName === "admin" ? (
                  <img
                    src="/logo.svg"
                    alt="Meal Logo"
                    className="w-6 h-6 object-contain"
                  />
                ) : (
                  <span className="text-white text-base font-medium">
                    {currentUser?.name
                      ? currentUser.name.charAt(0).toUpperCase()
                      : currentUser?.email
                      ? currentUser.email.charAt(0).toUpperCase()
                      : roleName === "staff"
                      ? "S"
                      : "U"}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <div className="text-[#EDEDED] text-sm font-medium font-inter truncate">
                  {(() => {
                    const displayText =
                      currentUser?.name ||
                      currentUser?.email ||
                      (roleName === "admin"
                        ? "Admin User"
                        : roleName === "staff"
                        ? "Staff Member"
                        : "User");

                    // If it's longer than 15 characters, truncate it
                    if (displayText.length > 15) {
                      return displayText.substring(0, 15) + "...";
                    }
                    return displayText;
                  })()}
                </div>
                <div className="text-[#EDEDED80] text-[10px] font-inter">
                  {currentUser?.role ? 
                    currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1) : 
                    (currentRole === "admin"
                      ? "Admin"
                      : currentRole === "staff"
                      ? "Staff"
                      : currentRole === "user"
                      ? "User"
                      : "User")}
                </div>
              </div>
              <button className="text-[#EDEDED] hover:text-[#EDEDED80]">
                <IoMdArrowDropdown className="w-6 h-6 mr-16 mb-3" />
              </button>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center w-full h-[42px] pl-[10px] pr-4 gap-[10px] text-[#EDEDED] rounded-lg bg-[#7E89AC33] hover:bg-white/5 transition-all duration-200"
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <LogoutIcon color="#EDEDED" />
              </div>
              <span className="text-sm font-medium leading-[25px] font-inter">
                Log out
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Desktop Sidebar - always visible on larger screens */}
      <aside className="hidden md:block mt-0 bg-[#1A202C]">
        {renderSidebarContent()}
      </aside>

      {/* Mobile Sidebar - only visible when toggled */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        {renderSidebarContent()}
      </aside>

      {/* Overlay when mobile sidebar is open */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}

export default Sidebar;
