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
            description: "Welcome back.",
            icon: DashboardIcon,
          },
          properties: {
            name: "Properties Management",
            description: "Manage hotel properties",
            icon: FaBuilding,
          },
          bookings: {
            name: "Bookings Management",
            description: "Manage bookings and reservations",
            icon: FaCalendarCheck,
          },
          staff: {
            name: "Staff Management",
            description: "Manage staff members  ",
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
            description: "Manage admin profile and account settings.",
            icon: StaffIcon,
          },
        },
        staff: {
          dashboard: {
            name: "Dashboard",
            description: "Welcome back.",
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
    <header className="w-full text-white lg:ml-[18.5625rem] lg:w-[calc(100%-18.5625rem)] border-b border-[#FFFFFF05] relative overflow-hidden">
      <div className="flex items-center justify-between px-6 lg:px-10 py-4 lg:py-6 h-[72px] lg:h-[100px]">
        {/* Brand/Path Context */}
        <div className="flex items-center gap-4 lg:gap-5 flex-1 min-w-0">
          <div
            className="w-10 h-10 lg:w-14 lg:h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-2xl shadow-[#14F19520] relative group overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #9945FF 0%, #14F195 100%)",
            }}
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <currentPage.icon
              className="w-5 h-5 lg:w-7 lg:h-7 text-white relative z-10"
            />
          </div>

          <div className="flex flex-col min-w-0">
            <h1 className="text-lg lg:text-3xl font-bold text-white tracking-tight leading-none">
              {currentPage.name}
            </h1>
            <p className="text-[#AEB9E1] text-[10px] lg:text-sm font-medium uppercase tracking-widest opacity-40 mt-1 lg:mt-2">
              {currentPage.description.split('.')[0]}
            </p>
          </div>
        </div>

        {/* Action Suite */}
        <div className="flex items-center gap-3 lg:gap-8">
          {/* Dashboard specific actions could go here */}

          {/* User Presence & Sidebar Trigger */}
          <div className="flex items-center gap-4">
            {/* Search potentially here in future */}

            {/* Mobile Menu Button - Glassmorphic design */}
            <button
              onClick={toggleSidebar}
              className="lg:hidden w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl active:scale-90 transition-all text-[#14F195]"
            >
              <Menu size={20} />
            </button>

            {/* Desktop User Action */}
            <div className="hidden lg:block">
              <div className="flex items-center gap-4 pl-8 border-l border-white/10">
                <div className="text-right">
                  <p className="text-white font-bold text-sm">{user?.name || "Admin"}</p>
                  <p className="text-[#AEB9E1] text-[10px] uppercase font-medium tracking-widest opacity-40">{user?.role || "Manager"}</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 p-[1px]">
                  <div className="w-full h-full bg-[#0A1330] rounded-[15px] flex items-center justify-center font-bold text-[#14F195]">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
