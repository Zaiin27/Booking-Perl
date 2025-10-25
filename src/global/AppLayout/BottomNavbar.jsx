// components/BottomNavbar.jsx
import { NavLink } from 'react-router-dom';
import { BottomHomeIcon, FavIcon, UserIcon } from '../../utils/icons';

const BottomNavbar = () => {
    const navItems = [
        { to: '/', icon: BottomHomeIcon },
        { to: '/', icon: FavIcon },
        { to: '/', icon: UserIcon },
    ];

    return (
        <div className="fixed bottom-[-1px] left-0 right-0 bg-[#F8F8F8] gap-16 rounded-t-3xl shadow-md px-10 py-4 flex justify-around items-center max-w-md mx-auto">
            {navItems.map(({ to, icon: Icon }) => (
                <NavLink
                    key={to}
                    to={to}
                    end
                    className={({ isActive }) =>
                        `flex flex-col items-center ${isActive ? 'text-primary' : 'text-gray-400'}`
                    }
                >
                    <Icon size={24} />
                    {({ isActive }) =>
                        isActive ? (
                            <span className="w-2 h-2 mt-1 rounded-full bg-primary" />
                        ) : (
                            <span className="w-2 h-2 mt-1" />
                        )
                    }
                </NavLink>
            ))}
        </div>
    );
};

export default BottomNavbar;
