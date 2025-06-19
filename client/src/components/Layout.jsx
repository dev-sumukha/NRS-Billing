import React from 'react';
import { Outlet } from 'react-router-dom'; // Renders child routes
import Navbar from './Navbar';  
import TopBar from './TopBar'  

function Layout() {
  return (
    <div className="flex h-screen">
      <Navbar />  {/* Sidebar */}
      <div className="flex-1 flex flex-col">
        <TopBar /> {/* Top Bar */}
        <div className="flex-1 overflow-auto p-5 mt-3"> {/* Main content area */}
          <Outlet />  {/* Child routes (Login, Dashboard, etc.) */}
        </div>
      </div>
    </div>
  );
}

export default Layout;
