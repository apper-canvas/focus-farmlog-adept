import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  
  const getPageTitle = (pathname) => {
    const titles = {
      "/": "Dashboard",
      "/farms": "Farms",
      "/crops": "Crops", 
      "/tasks": "Tasks",
      "/finance": "Finance",
      "/weather": "Weather"
    };
    return titles[pathname] || "FarmLog Pro";
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          currentPage={getPageTitle(location.pathname)}
          onMenuToggle={() => setSidebarOpen(true)}
        />
        
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;