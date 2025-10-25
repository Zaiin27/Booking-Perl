import {
  EnvelopeIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";

import { Menu } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../store/slices/authSlice";
import { persistor } from "../../store";
import { BASE_URL } from "../../services/ApiEndpoints";
import { useGetDriverAlertReminderQuery } from "../../services/user/userApi";
import {
  DashboardIcon,
  OrdersIcon,
  TicketsIcon,
  StaffIcon,
  SettingsIcon,
  ChatIcon,
} from "../../assets/icons/icons";
import { FaBuilding, FaCalendarCheck } from "react-icons/fa";

function Header({ toggleSidebar }) {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentRole = useSelector((state) => state.auth.user?.role);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await dispatch(logout());
      persistor.purge();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout fails, clear local state and redirect
      persistor.purge();
      navigate("/login");
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };


  // Dynamic page configuration for different roles
  const getPageConfig = () => {
    const path = location.pathname;
    const segments = path.replace(/^\/|\/$/g, "").split("/");

    // Role-based routes (admin, staff, user)
    if (segments.length >= 2) {
      const role = segments[0]; // admin, staff, user
      const page = segments[1]; // dashboard, orders, tickets, staff, settings, profile

      // Page configurations for each role
      const pageConfigs = {
        admin: {
          dashboard: {
            name: "Dashboard",
            description:
              "Welcome back! Here's what's happening with your hotel today.",
            icon: DashboardIcon,
          },
          properties: {
            name: "Properties Management",
            description: "Manage and track all hotel properties",
            icon: FaBuilding,
          },
          bookings: {
            name: "Bookings Management",
            description: "Manage customer bookings and reservations",
            icon: FaCalendarCheck,
          },
          staff: {
            name: "Staff Management",
            description: "Manage staff members, roles, and permissions",
            icon: StaffIcon,
          },
          settings: {
            name: "System Settings",
            description:
              "Configure platform settings, discounts, tokens, and email templates",
            icon: SettingsIcon,
          },
          profile: {
            name: "Profile",
            description: "Manage your admin profile and account settings.",
            icon: StaffIcon,
          },
        },
        staff: {
          dashboard: {
            name: "Dashboard",
            description:
              "Welcome back! Here's what's happening with your hotel today.",
            icon: DashboardIcon,
          },
          properties: {
            name: "Properties",
            description: "Manage your assigned hotel properties efficiently.",
            icon: FaBuilding,
          },
          bookings: {
            name: "Bookings Management",
            description: "Handle bookings and reservations for your properties.",
            icon: FaCalendarCheck,
          },
          profile: {
            name: "Profile",
            description: "Manage your staff profile and account settings.",
            icon: StaffIcon,
          },
          chat: {
            name: "Chat",
            description: "Manage your chat with customers.",
            icon: ChatIcon,
          },
          settings: {
            name: "Settings",
            description: "Configure your personal settings and preferences.",
            icon: SettingsIcon,
          },
        },
        user: {
          dashboard: {
            name: "Dashboard",
            description:
              "Welcome back! Here's what's happening with your service today.",
            icon: DashboardIcon,
          },
          orders: {
            name: "Orders",
            description: "Track your order history and current orders.",
            icon: OrdersIcon,
          },
          tickets: {
            name: "Tickets Management",
            description: "Create and track your support tickets.",
            icon: TicketsIcon,
          },
          profile: {
            name: "Profile",
            description: "Manage your user profile and account settings.",
            icon: StaffIcon,
          },
          chat: {
            name: "Chat",
            description: "Manage your chat with customers.",
            icon: ChatIcon,
          },
          settings: {
            name: "Settings",
            description: "Configure your personal settings and preferences.",
            icon: SettingsIcon,
          },
        },
      };

      // Get the current role config
      const roleConfig = pageConfigs[role];
      if (roleConfig && roleConfig[page]) {
        return roleConfig[page];
      }
    }

    // Fallback for unknown routes
    return {
      name: "Dashboard",
      description: "Welcome back! Here's what's happening today.",
      icon: DashboardIcon,
    };
  };

  const currentPage = getPageConfig();

  // Helper to get current page name based on path (keeping for backward compatibility)
  const getCurrentPageName = () => {
    const path = location.pathname;
    const segments = path.replace(/^\/|\/$/g, "").split("/");

    // Role-based routes (admin, staff, user)
    if (segments.length >= 2) {
      const role = segments[0]; // admin, staff, user
      const page = segments[1]; // dashboard, orders, tickets, staff, settings, profile

      // Map page names to display names
      const pageNames = {
        dashboard: "Dashboard",
        orders: "Orders Management",
        tickets: "Tickets Management",
        staff: "Staff Management",
        chat: "Chat",
        settings: "Settings",
        profile: "Profile",
      };

      if (pageNames[page]) {
        return pageNames[page];
      }
    }

    // Fallback
    return "Dashboard";
  };

  // Helper to get current page icon based on path (keeping for backward compatibility)
  const getCurrentPageIcon = () => {
    const path = location.pathname;
    const segments = path.replace(/^\/|\/$/g, "").split("/");

    // Role-based routes (admin, staff, user)
    if (segments.length >= 2) {
      const role = segments[0]; // admin, staff, user
      const page = segments[1]; // dashboard, orders, tickets, staff, profile, settings

      // Map page names to icons
      const pageIcons = {
        dashboard: DashboardIcon,
        orders: OrdersIcon,
        tickets: TicketsIcon,
        staff: StaffIcon,
        profile: StaffIcon,
        chat: ChatIcon,
        settings: SettingsIcon,
      };

      if (pageIcons[page]) {
        return pageIcons[page];
      }
    }

    // Fallback
    return DashboardIcon;
  };

  return (
    <header className="bg-[#060b27] z-10 text-white md:ml-[18.5625rem] md:w-[calc(100%-18.5625rem)]">
      <div className="flex items-center justify-between px-3 md:px-6 py-2 md:py-4 min-h-[60px] md:min-h-[80px]">
        {/* Left Side - Dashboard Info */}
        <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
          {/* Dashboard Icon and Text - Responsive sizing */}
          <div className="flex items-center gap-2 md:gap-3">
            <div
              className="w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                background: "linear-gradient(90deg, #9945FF 0%, #14F195 100%)",
              }}
            >
              <currentPage.icon
                style={{ color: "white", width: "20px", height: "20px" }}
                className="w-5 h-5 md:w-6 md:h-6"
              />
            </div>

            <div className="flex flex-col min-w-0 flex-1">
              <h1 className="text-lg md:text-2xl font-semibold text-white break-words">
                {currentPage.name}
              </h1>
              <p className="text-white/70 text-xs font-inter break-words leading-tight">
                {currentPage.description}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Mobile Menu Button and Desktop Elements */}
        <div className="flex items-center gap-2 md:gap-6 flex-shrink-0">
          {/* Mobile Elements - Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {/* Mobile Menu Button */}
            <button
              onClick={toggleSidebar}
              className="bg-[#171D41] hover:bg-[#2a3342] text-white rounded-lg p-2 border border-[#EDEDED33] transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Desktop Elements - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-6">

            {/* Search Bar */}
            {/* <div className="relative">
              <div className="w-72 h-10 bg-[#171D41] rounded-full flex items-center px-4 shadow-sm">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  className="mr-3 flex-shrink-0"
                >
                  <path
                    d="M17.5 17.5L12.5 12.5M14.1667 8.33333C14.1667 11.555 11.555 14.1667 8.33333 14.1667C5.11167 14.1667 2.5 11.555 2.5 8.33333C2.5 5.11167 5.11167 2.5 8.33333 2.5C11.555 2.5 14.1667 5.11167 14.1667 8.33333Z"
                    stroke="#EDEDED80"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search orders, users...."
                  className="flex-1 bg-transparent text-white placeholder-[#EDEDED80] outline-none border-none focus:outline-none focus:ring-0 focus:border-none text-sm pr-2"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
            </div> */}

            {/* Export Button - Only show on Orders Management screen */}
            {currentPage.name === "Orders Management" && (
              <button
                onClick={() => {
                  // Trigger CSV export
                  const csvLink = document.getElementById("csv-export-link");
                  if (csvLink) {
                    csvLink.click();
                  }
                }}
                className="flex items-center gap-2 bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-white"
                >
                  <path
                    d="M10 2.5V12.5M10 12.5L7.5 10M10 12.5L12.5 10M17.5 12.5V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V12.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Export
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search - shown only when clicked */}
      {showMobileSearch && (
        <div className="px-4 pb-3 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Search here"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
            >
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </button>
          </form>
        </div>
      )}

      <hr />
    </header>
  );
}

export default Header;
