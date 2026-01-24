import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaHome, FaSearch, FaUser, FaBars, FaRegBuilding, FaCompass } from "react-icons/fa";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { auth } = useSelector((state) => state);

  const isLoggedIn = auth?.isAuthenticated && auth?.user;

  // Scroll logic for glass effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled ? 'glass-header py-3' : 'bg-white py-5 shadow-sm'}`}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex items-center justify-between">
          {/* Elite Branding */}
          <Link to="/" className="group relative flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
              <span className="text-white font-black text-xl italic">B</span>
            </div>
            <span className="hidden sm:block text-xl md:text-2xl font-inter font-black text-[#0F172A] tracking-tighter">
              BOOKING<span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">PEARL</span>
            </span>
          </Link>

          {/* Floating Nav Pills (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200/50">
            {[
              { label: 'Home', path: '/' },
              { label: 'Properties', path: '/properties' },
              { label: 'FAQ', path: '/faq' },
              { label: 'Support', path: '/contact' },
              { label: 'Reviews', path: '/reviews' }
            ].map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link-pill ${isActive(link.path)
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 scale-100'
                  : 'text-slate-600 hover:text-[#0F172A]'}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Cinematic Auth Area (Desktop & Mobile Trigger) */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <Link
                to="/profile"
                className="group relative w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-blue-600 to-purple-600 hover:scale-110 transition-all duration-300 hidden lg:block"
              >
                <div className="w-full h-full bg-white rounded-full p-0.5">
                  <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-blue-600 font-bold overflow-hidden shadow-inner">
                    <FaUser className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            ) : (
              <Link
                to="/login"
                className="hidden lg:block px-8 py-3 bg-[#0F172A] hover:bg-blue-600 text-white font-inter font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-slate-900/10 active:scale-95"
              >
                Join Elite
              </Link>
            )}

            {/* Hamburger Menu (Mobile/Tablet Only) */}
            <button
              onClick={toggleMenu}
              className="lg:hidden w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-[#0F172A] hover:bg-slate-200 transition-colors active:scale-95"
            >
              <FaBars className="text-xl" />
            </button>
          </div>
        </div>
      </header>


      {/* Glassmorphic Side Drawer */}
      <div
        className={`fixed inset-0 z-[200] lg:hidden transition-all duration-500 ${isMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}
      >
        <div className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-md" onClick={closeMenu}></div>
        <div className={`absolute top-0 right-0 h-full w-[85vw] max-w-sm glass-drawer shadow-2xl p-10 flex flex-col transition-transform duration-500 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between mb-12">
            <span className="text-2xl font-black text-[#0F172A] tracking-tighter">
              BOOKING<span className="text-blue-600">PEARL</span>
            </span>
            <button onClick={closeMenu} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-[#0F172A]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <nav className="flex flex-col gap-6 flex-1">
            {[
              { label: 'Discovery Home', path: '/' },
              { label: 'Premier Properties', path: '/properties' },
              { label: 'Common Questions', path: '/faq' },
              { label: 'Concierge Support', path: '/contact' },
              { label: 'Guest Reviews', path: '/reviews' }
            ].map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={closeMenu}
                className={`text-lg font-inter font-semibold transition-all ${isActive(link.path) ? 'text-blue-600 translate-x-4' : 'text-slate-400 hover:text-[#0F172A]'}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link
            to={isLoggedIn ? "/profile" : "/login"}
            onClick={closeMenu}
            className="mt-auto px-2 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-inter font-black text-center uppercase tracking-widest rounded-2xl shadow-2xl shadow-blue-600/40"
          >
            {isLoggedIn ? "Elite Profile" : "Join the Elite"}
          </Link>
        </div>
      </div>
    </>
  );
};

export default Header;
