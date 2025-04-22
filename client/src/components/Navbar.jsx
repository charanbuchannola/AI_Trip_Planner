import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
      <div className="text-xl font-bold text-red-500">BUCHANNOLA</div>
      <Link to={"/login"}>
        <button className="px-4 py-2 text-white bg-black rounded-md">
          Sign In
        </button>
      </Link>
    </nav>
  );
};

export default Navbar;
