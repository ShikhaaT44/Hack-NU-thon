import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const users = [
    "Folno Reelv",
    "Aebnvcat",
    "Aect",
    "Aeatnaelrt",
    "Aelie Reims",
    "Agoo Pony",
    "Frrig Reidg",
  ];

  return (
    <div className="w-64 bg-white shadow-lg h-full flex flex-col">
      <div className="p-4 flex-shrink-0">
        <div className="flex items-center space-x-2 mb-6">
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          <span className="font-semibold">Admin</span>
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

      {/* User List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {users.map((user) => (
            <button
              key={user}
              className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 flex items-center space-x-2"
            >
              <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
              <span>{user}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
