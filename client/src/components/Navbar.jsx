import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { LogOut, Settings, User } from "lucide-react"; // Import icons

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    const token = localStorage.getItem("token"); // Check token from localStorage
    if (token) {
      setIsAuthenticated(true); // User is authenticated
    } else {
      setIsAuthenticated(false); // User is not authenticated
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage on logout
    setIsAuthenticated(false); // Update state
  };

  return (
    <nav className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Logo Section */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                {/* Logo Placeholder */}
              </div>
              <h1 className="text-lg font-bold">Ai Trip Planner</h1>
            </Link>
          </div>

          {/* Button Section */}
          <div className="flex items-center gap-2">
            <Link to="/themes" className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl btn-ghost gap-2 transition-colors">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {isAuthenticated ? (
              <>
                {/* Profile Link */}
                <Link to="/profile" className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl btn-ghost gap-2">
                  <User className="w-5 h-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                {/* Logout Button */}
                <button
                  className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl btn-ghost flex gap-2 items-center"
                  onClick={handleLogout}
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              // Show Login button if not authenticated
              <Link to="/login" className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl btn-ghost">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
