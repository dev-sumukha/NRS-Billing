import React from "react";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Navbar */}
      {/* <Navbar /> */}
      {/* Main Content */}
      <main className="flex-1 p-6">
        <header className="flex items-center justify-between pb-4 border-b">
          <h2 className="text-xl font-semibold" style={{ color: "#4E45E5" }}>
            Dashboard
          </h2>
          <button
            className="px-4 py-2 text-sm text-white rounded-md"
            style={{ backgroundColor: "#4E45E5" }}
          >
            Add New
          </button>
        </header>

        {/* Dashboard Content */}
        <div className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Dashboard Cards */}
            <div
              className="p-4 bg-white border rounded-lg shadow"
              style={{ borderColor: "#e5e5e5" }}
            >
              <h3 className="text-lg font-semibold text-gray-700">Total Customers</h3>
              <p className="mt-2 text-2xl font-bold" style={{ color: "#4E45E5" }}>
                125
              </p>
            </div>
            <div
              className="p-4 bg-white border rounded-lg shadow"
              style={{ borderColor: "#e5e5e5" }}
            >
              <h3 className="text-lg font-semibold text-gray-700">Pending Vouchers</h3>
              <p className="mt-2 text-2xl font-bold" style={{ color: "#4E45E5" }}>
                45
              </p>
            </div>
            <div
              className="p-4 bg-white border rounded-lg shadow"
              style={{ borderColor: "#e5e5e5" }}
            >
              <h3 className="text-lg font-semibold text-gray-700">Total Sales</h3>
              <p className="mt-2 text-2xl font-bold" style={{ color: "#4E45E5" }}>
                ₹75,000
              </p>
            </div>
            <div
              className="p-4 bg-white border rounded-lg shadow"
              style={{ borderColor: "#e5e5e5" }}
            >
              <h3 className="text-lg font-semibold text-gray-700">Revenue</h3>
              <p className="mt-2 text-2xl font-bold" style={{ color: "#4E45E5" }}>
                ₹1,50,000
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
