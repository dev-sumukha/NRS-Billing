// App.js
import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Customers from "./pages/Customer";
import Vouchers from "./pages/Vouchers";
import Login from "./pages/Login";
import Dashboard from "./components/Dashboard";

const App = () => {
  const location = useLocation()
  const isLoginPage = location.pathname === "/login-logout"

  return (
    <>
        <div className="flex min-h-screen bg-gray-50">
          {/* Conditionally render the Navbar */}
          {!isLoginPage && <Navbar />}

          {/* Main Content */}
          <main className="flex-1 p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/vouchers" element={<Vouchers />} />
              <Route path="/login-logout" element={<Login />} />
            </Routes>
          </main>
        </div>
    </>
  );
};

export default App;
