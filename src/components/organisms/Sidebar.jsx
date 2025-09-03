import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: "BarChart3" },
    { name: "Farms", href: "/farms", icon: "MapPin" },
    { name: "Crops", href: "/crops", icon: "Sprout" },
    { name: "Tasks", href: "/tasks", icon: "CheckSquare" },
    { name: "Finance", href: "/finance", icon: "DollarSign" },
    { name: "Weather", href: "/weather", icon: "Cloud" }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Mobile sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-primary-600 to-primary-700 z-50 lg:hidden transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between p-6 border-b border-primary-500">
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-lg">
              <ApperIcon name="Sprout" size={24} className="text-primary-600" />
            </div>
            <span className="font-display font-bold text-xl text-white">FarmLog Pro</span>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-primary-500 p-1 rounded transition-colors duration-200"
          >
            <ApperIcon name="X" size={20} />
          </button>
        </div>
        
        <nav className="p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200",
                  isActive
                    ? "bg-white text-primary-600 shadow-lg"
                    : "text-primary-100 hover:bg-primary-500 hover:text-white"
                )}
              >
                <ApperIcon name={item.icon} size={20} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 bg-gradient-to-b from-primary-600 to-primary-700 border-r border-primary-500">
        <div className="p-6 border-b border-primary-500">
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-lg">
              <ApperIcon name="Sprout" size={24} className="text-primary-600" />
            </div>
            <span className="font-display font-bold text-xl text-white">FarmLog Pro</span>
          </div>
        </div>
        
        <nav className="p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200",
                  isActive
                    ? "bg-white text-primary-600 shadow-lg"
                    : "text-primary-100 hover:bg-primary-500 hover:text-white"
                )}
              >
                <ApperIcon name={item.icon} size={20} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;