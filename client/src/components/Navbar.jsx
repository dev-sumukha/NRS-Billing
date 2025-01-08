import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <>
      <aside
        className="w-64 bg-white border-r shadow-md"
        style={{ borderColor: "#e5e5e5" }}
      >
        <div
          className="p-4 text-center border-b"
          style={{ borderColor: "#e5e5e5" }}
        >
          <h1 className="text-2xl font-bold" style={{ color: "#4E45E5" }}>
            NRS Billing
          </h1>
        </div>
        <nav className="mt-4">
          <ul className="space-y-2">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg ${
                    isActive
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`
                }
              >
                🏠 Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/customers"
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg ${
                    isActive
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`
                }
              >
                👥 Customers
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/vouchers"
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg ${
                    isActive
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`
                }
              >
                💳 Vouchers
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/login-logout"
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg ${
                    isActive
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`
                }
              >
                🔑 Login / Logout
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Navbar;
