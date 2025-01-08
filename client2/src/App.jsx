import React from "react";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import Customer from "./pages/CustomerPage";
import Items from "./pages/Items";
import Profile from "./pages/Profile";
import ProtectedRoute from "./ProtectedRoute";
import Logout from "./pages/Logout";
import CustomerVouchers from "./pages/CustomerVouchers";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/dashboard/customers"
            element={
              <ProtectedRoute>
                <Customer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/customers/voucher/getVouchers/:customerId"
            element={
              <ProtectedRoute>
                <CustomerVouchers />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/dashboard/items"
            element={
              <ProtectedRoute>
                <Items />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
