import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Home, LogIn, LogOut, Moon, PlaneTakeoff, Settings, ThermometerSun, User } from "lucide-react"; // Import icons

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
              <div className="size-9 rounded-lg  flex items-center justify-center">
              <PlaneTakeoff className="text-primary-300" />
              </div>
              <h1 className="text-2xl font-bold">Ai Trip Planner</h1>
            </Link>
          </div>

          {/* Button Section */}
          <div className="flex items-center gap-2">

          <Link to="/" className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl btn-ghost gap-2 transition-colors">
              <Home className="text-primary-300" />
              <span className="hidden sm:inline">Home</span>
            </Link> 
            <Link to="/themes" className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl btn-ghost gap-2 transition-colors">
              <Moon className="text-primary-300" />
              <span className="hidden sm:inline">Themes</span>
            </Link>
        
           

            {isAuthenticated ? (
              <>
                {/* Profile Link */}
                <Link to="/profile" className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl btn-ghost gap-2">
                  <User className=" text-primary-300" />
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
                 <LogIn className=" text-primary-300" />
                 <span className="hidden sm:inline ">Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
