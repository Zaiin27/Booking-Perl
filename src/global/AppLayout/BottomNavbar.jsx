import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    CalendarCheck,
    Users,
    UserCircle
} from "lucide-react";
import { useSelector } from "react-redux";

const BottomNavbar = () => {
    const { user } = useSelector((state) => state.auth);
    const role = user?.role || "user";

    const navItems = [
        {
            to: `/${role}/dashboard`,
            icon: LayoutDashboard,
            label: "Home"
        },
        {
            to: `/${role}/bookings`,
            icon: CalendarCheck,
            label: "Bookings"
        },
        {
            to: role === "admin" ? "/admin/staff" : "/staff/properties",
            icon: role === "admin" ? Users : LayoutDashboard,
            label: role === "admin" ? "Staff" : "Properties"
        },
        {
            to: `/${role}/profile`,
            icon: UserCircle,
            label: "Profile"
        },
    ];

    return (
        <div className="px-4 pb-4 w-full max-w-md mx-auto">
            <div
                className="bg-[#171D41]/90 backdrop-blur-xl border border-[#FFFFFF1A] rounded-2xl shadow-[0_-8px_30px_rgb(0,0,0,0.4)] px-6 py-3 flex justify-between items-center transition-all duration-300"
            >
                {navItems.map(({ to, icon: Icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            `flex flex-col items-center gap-1 group relative transition-all duration-300 ${isActive ? "scale-110" : "opacity-60 hover:opacity-100"
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <div
                                    className={`p-2 rounded-xl transition-all duration-300 ${isActive
                                            ? "bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white shadow-lg shadow-[#14F19533]"
                                            : "text-white"
                                        }`}
                                >
                                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                </div>
                                <span
                                    className={`text-[10px] font-medium transition-all duration-300 ${isActive ? "text-white opacity-100" : "text-white opacity-0"
                                        }`}
                                >
                                    {label}
                                </span>

                                {/* Active Indicator Dot */}
                                {isActive && (
                                    <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-[#14F195]" />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </div>
    );
};

export default BottomNavbar;
