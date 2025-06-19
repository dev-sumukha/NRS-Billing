import { Link } from 'react-router-dom';
import React from 'react';

const TopBar = () => {
  return (
    <div className="bg-white shadow-md py-4 px-6 sticky">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#2D69D4]">Billing Manager</h1>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Link to="/dashboard/profile">
            <button className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden border-2 border-[#2D69D4]">
              <img
                src="https://www.example.com/path-to-your-profile-pic.jpg" // Replace with the actual image URL
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
