import React from 'react';
import { Home, Users, Box, User, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <div className="flex flex-col w-64 bg-[#2D69D4] text-white min-h-screen">
      <div className="p-5 border-b border-[#4A80DB]">
        <h1 className="text-2xl font-bold text-center">NRS</h1>
      </div>

      <nav className="flex-1">
        <ul className="space-y-1 mt-5">
          <li>
            <Link
              to="/dashboard"
              className="flex items-center px-5 py-3 hover:bg-[#4A80DB] hover:text-gray-200 transition-colors"
            >
              <Home className="mr-2" />
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/customers"
              className="flex items-center px-5 py-3 hover:bg-[#4A80DB] hover:text-gray-200 transition-colors"
            >
              <Users className="mr-2" />
              Customers
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/items"
              className="flex items-center px-5 py-3 hover:bg-[#4A80DB] hover:text-gray-200 transition-colors"
            >
              <Box className="mr-2" />
              Items
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/profile"
              className="flex items-center px-5 py-3 hover:bg-[#4A80DB] hover:text-gray-200 transition-colors"
            >
              <User className="mr-2" />
              Profile
            </Link>
          </li>
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-5 border-t border-[#4A80DB]">
        <Link to="/logout">
          <button className="flex items-center w-full text-white hover:text-gray-200 transition-colors">
            <LogOut className="mr-2" />
            Logout
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
