// import React from 'react'
import { PlusCircle, Home } from "lucide-react";
import lpulogo from "../assets/lpulogo.png";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";

const Navbar = () => {
  const { isLoggedIn, user } = useAuth();
  return (
    <header className="fixed top-0 w-full z-50 bg-slate-900/40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link
            to="/"
            className="flex items-center gap-2 sm:gap-3 group shrink-0"
          >
            <div className="bg-white/10 backdrop-blur-md p-1.5 sm:p-2 rounded-xl border border-white/20 shadow-lg group-hover:bg-white/20 transition-all duration-300">
              <img
                src={lpulogo}
                alt="LPU Logo"
                className="w-6 h-6 sm:w-8 sm:h-8 object-contain drop-shadow-md"
              />
            </div>
            <div className="flex flex-col">
              <div className="text-lg sm:text-xl font-extrabold tracking-tight text-white drop-shadow-md">
                LPU <span className="text-[#fbad41]">RECOVERY</span>
              </div>
              <div className="hidden sm:block text-white/70 text-[10px] font-semibold tracking-widest uppercase">
                Secure Asset Platform
              </div>
            </div>
          </Link>

          <nav className="flex items-center gap-2 sm:gap-6 text-sm font-medium">
            <Link
              to="/report"
              className="flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white p-2 sm:px-5 sm:py-2 rounded-xl font-bold hover:bg-white/20 hover:border-white/40 transition-all shadow-lg text-xs sm:text-sm group"
            >
              <PlusCircle className="w-4 h-4 sm:w-4 sm:h-4 text-[#fbad41] group-hover:scale-110 transition-transform shrink-0" />
              <span className="hidden sm:inline">New Report</span>
              <span className="hidden min-[400px]:inline sm:hidden">
                Report
              </span>
            </Link>

            <div className="h-6 w-px bg-white/20 hidden sm:block"></div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* 1. UMS HOME SQUIRCLE ICON */}
              <a
                href="https://ums.lpu.in"
                title="LPU UMS Main Portal"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center bg-linear-to-b from-[#ffaf38] to-[#f7941d] hover:from-[#ffb84d] hover:to-[#fa9f2d] shadow-md shadow-amber-500/20 active:scale-95 transition-all duration-200 shrink-0"
              >
                <Home className="w-5 h-5 text-white stroke-[2.2]" />
              </a>

              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 p-1 sm:pr-3 rounded-full hover:bg-white/15 transition-all shadow-md">
                {/* Profile Avatar (Always visible) */}
                <div className="w-8 h-8 sm:w-8 sm:h-8 rounded-full border border-white/30 overflow-hidden bg-white/20 flex items-center justify-center shrink-0">
                  <img
                    src="https://api.dicebear.com/10.x/planets/svg"
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Name Label: Hidden on mobile (hidden), shown on desktop (sm:inline) */}

                <span className="text-xs font-bold text-white max-w-30 truncate hidden sm:inline select-none">
                  {isLoggedIn ? user?.name : <Link to="/login">Login</Link>}
                </span>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
