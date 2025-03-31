import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="px-8 mx-auto">
        <div className="flex justify-between h-16 items-center">
          <Link
            to="/"
            className="text-2xl font-bold text-indigo-600 tracking-tight"
          >
            Fraud Rakshak
          </Link>

          <div className="flex-1 flex justify-center space-x-8">
            <Link
              to="/"
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                isActive("/")
                  ? "border-indigo-500 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/users"
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                isActive("/users")
                  ? "border-indigo-500 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              Users
            </Link>
            <Link
              to="/settings"
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                isActive("/settings")
                  ? "border-indigo-500 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              Settings
            </Link>
          </div>

          <div className="flex space-x-4">
            <Link
              to="/register-user"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
            >
              Register New User
            </Link>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
