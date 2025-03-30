import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 bg-white shadow-lg h-[calc(100vh-4rem)] sticky top-16">
      <div className="p-4 flex-shrink-0">
        <div className="mb-6">
          <span className="font-semibold text-lg">Admin</span>
        </div>

        {/* Register User Button */}
        <Link
          to="/register-user"
          className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 mb-6 flex items-center justify-center"
        >
          Register New User
        </Link>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
