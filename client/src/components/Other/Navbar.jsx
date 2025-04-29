import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Home, LogIn, LogOut, Moon, PhoneCall, PlaneTakeoff } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { THEMES } from "../Themes/index"; // Or wherever your THEMES array is located

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { theme, changeTheme } = useTheme();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <nav className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Logo Section */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-9 rounded-lg flex items-center justify-center">
                <PlaneTakeoff className="text-primary-300" />
              </div>
              <h1 className="text-2xl font-bold">TRAWOMIND</h1>
            </Link>
          </div>

          {/* Button Section */}
          <div className="flex items-center gap-2">
            <Link to="/" className="btn btn-ghost gap-2 transition-colors">
              <Home className="text-primary-300" />
              <span className="hidden sm:inline">Home</span>
            </Link>

            <Link to="/chat" className="btn btn-ghost gap-2 transition-colors">
              <PhoneCall className="text-primary-300" />
              <span className="hidden sm:inline">Customer Service</span>
            </Link>

            {/* Theme Dropdown */}
            <div className="dropdown dropdown-hover">
              <div tabIndex={0} role="button" className="btn btn-ghost gap-2">
                <Moon className="text-primary-300" />
                <span className="hidden sm:inline">Themes</span>
              </div>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-56 max-h-64 overflow-y-auto">
                {THEMES.map((t) => (
                  <li key={t}>
                    <button
                      className={`flex flex-col items-start w-full p-2 rounded-lg text-sm ${
                        theme === t ? "bg-base-200" : "hover:bg-base-200/50"
                      }`}
                      onClick={() => changeTheme(t)}
                      data-theme={t}
                    >
                      <div className="flex gap-1 w-full">
                        <div className="w-4 h-4 rounded bg-primary" />
                        <div className="w-4 h-4 rounded bg-secondary" />
                        <div className="w-4 h-4 rounded bg-accent" />
                        <div className="w-4 h-4 rounded bg-neutral" />
                      </div>
                      <span className="text-xs mt-1">{t.charAt(0).toUpperCase() + t.slice(1)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {isAuthenticated ? (
              <button className="btn btn-ghost flex gap-2 items-center" onClick={handleLogout}>
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            ) : (
              <Link to="/login" className="btn btn-ghost">
                <LogIn className="text-primary-300" />
                <span className="hidden sm:inline">Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
