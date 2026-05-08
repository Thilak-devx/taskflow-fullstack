import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, LogOut, Menu, Settings } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import BrandMark from "./BrandMark";

const navClassName = ({ isActive }) =>
  `inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium transition ${
    isActive
      ? "bg-brand-400 text-slate-950 shadow-[0_12px_30px_rgba(34,201,122,0.22)]"
      : "border border-white/10 bg-white/5 text-slate-300 hover:border-white/18 hover:bg-white/8 hover:text-white"
  }`;

const AppLayout = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen px-3 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1180px]">
        <div className="sticky top-3 z-40 mb-6 rounded-[1.8rem] glass-panel p-3 sm:p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <BrandMark />
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen((current) => !current)}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 sm:hidden"
              aria-label="Toggle navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          <div className={`mt-4 ${menuOpen ? "block" : "hidden"} sm:block`}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-brand-400/10 text-lg font-semibold text-brand-300">
                  {user?.name?.slice(0, 1)?.toUpperCase() || "T"}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{user?.name}</p>
                  <p className="truncate text-xs uppercase tracking-[0.26em] text-slate-500">{user?.role}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <NavLink to="/" end className={navClassName} onClick={() => setMenuOpen(false)}>
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </NavLink>
                <NavLink to="/settings" className={navClassName} onClick={() => setMenuOpen(false)}>
                  <Settings className="h-4 w-4" />
                  Settings
                </NavLink>
                <button
                  type="button"
                  onClick={() => logout("You have been signed out.")}
                  className="btn btn-secondary"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="page-fade-in">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
