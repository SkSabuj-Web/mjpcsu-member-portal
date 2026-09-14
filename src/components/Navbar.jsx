import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  LogOut,
  User,
  Sparkles,
  ChevronRight,
  House,
  Target,
  Users,
  Images,
  Vote,
  MessageSquareText,
} from "lucide-react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogout = async () => {
    // Logout logic পরে AuthContext থেকে আসবে
    setIsOpen(false);
    navigate("/login");
  };

  const navLinks = [
    { name: "Home", path: "/", icon: House },
    { name: "Mission", path: "/mission", icon: Target },
    { name: "Committee", path: "/committee", icon: Users },
    { name: "Memories", path: "/memories", icon: Images },
    { name: "Election", path: "/election", icon: Vote },
    { name: "Proposal", path: "/proposal", icon: MessageSquareText },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-xl">

      {/* ================= NAVBAR ================= */}
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* ================= LOGO ================= */}
        <Link
          to="/"
          onClick={() => setIsOpen(false)}
          className="group flex items-center gap-3"
        >
          {/* Logo Icon */}
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20 transition duration-300 group-hover:scale-105">
            <Sparkles size={20} />
          </div>

          {/* Logo Text */}
          <div>
            <p className="text-lg font-black tracking-tight text-slate-900">
              MJPCSU
            </p>

            <p className="-mt-1 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Student Union
            </p>
          </div>
        </Link>

        {/* ================= DESKTOP NAVIGATION ================= */}
        <div className="hidden items-center gap-1 md:flex">

          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/"}
              className={({ isActive }) =>
                `relative rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-cyan-50 text-cyan-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-cyan-600"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}

        </div>

        {/* ================= DESKTOP ACTIONS ================= */}
        <div className="hidden items-center gap-2 md:flex">

          {/* Profile */}
          <Link
            to="/profile"
            className="group flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition-all hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
          >
            <User
              size={16}
              className="transition group-hover:scale-110"
            />

            <span>Profile</span>
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="group flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/20"
          >
            <LogOut
              size={16}
              className="transition group-hover:translate-x-0.5"
            />

            <span>Logout</span>
          </button>
        </div>

        {/* ================= MOBILE BUTTON ================= */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-600 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {isOpen && (
        <div className="border-t border-slate-200/80 bg-white px-4 pb-6 pt-4 shadow-xl md:hidden">

          {/* Mobile Menu Header */}
          <div className="mb-4 flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-sm">
              <Sparkles size={17} />
            </div>

            <div>
              <p className="text-sm font-black tracking-tight text-slate-900">
                MJPCSU
              </p>

              <p className="text-[10px] font-medium text-slate-400">
                Student Union Portal
              </p>
            </div>

          </div>

          {/* Navigation */}
          <div className="space-y-1">

            {navLinks.map((link) => {
              const Icon = link.icon;

              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === "/"}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `group flex items-center justify-between rounded-xl px-3 py-3 transition-all ${
                      isActive
                        ? "bg-cyan-50 text-cyan-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-cyan-600"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">

                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                            isActive
                              ? "bg-white text-cyan-600 shadow-sm"
                              : "bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-cyan-600"
                          }`}
                        >
                          <Icon size={17} />
                        </div>

                        <span className="text-sm font-semibold">
                          {link.name}
                        </span>

                      </div>

                      {isActive && (
                        <ChevronRight size={17} />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}

          </div>

          {/* Divider */}
          <div className="my-4 h-px bg-slate-100" />

          {/* Account Section */}
          <div className="mb-2 px-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Account
            </p>
          </div>

          {/* Profile */}
          <Link
            to="/profile"
            onClick={() => setIsOpen(false)}
            className="group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-cyan-600"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition group-hover:bg-cyan-50 group-hover:text-cyan-600">
              <User size={17} />
            </div>

            <span>Profile</span>
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="mt-2 flex w-full items-center gap-3 rounded-xl bg-slate-900 px-3 py-3 text-left text-sm font-semibold text-white transition hover:bg-red-500"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
              <LogOut size={17} />
            </div>

            <span>Logout</span>
          </button>

        </div>
      )}
    </nav>
  );
}

export default Navbar;