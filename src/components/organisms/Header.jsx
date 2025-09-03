import React, { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import { farmService } from "@/services/api/farmService";

const Header = ({ currentPage, onMenuToggle }) => {
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState("");

  useEffect(() => {
    loadFarms();
  }, []);

  const loadFarms = async () => {
    try {
      const data = await farmService.getAll();
      setFarms(data);
      if (data.length > 0) {
        setSelectedFarm(data[0].Id);
      }
    } catch (error) {
      console.error("Error loading farms:", error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-4 lg:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 text-gray-600 hover:text-primary-500 transition-colors duration-200"
          >
            <ApperIcon name="Menu" size={24} />
          </button>
          <h1 className="font-display font-bold text-2xl bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
            {currentPage}
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {farms.length > 0 && (
            <div className="relative">
              <select
                value={selectedFarm}
                onChange={(e) => setSelectedFarm(e.target.value)}
                className="appearance-none bg-gradient-to-r from-primary-500 to-secondary-400 text-white px-4 py-2 rounded-lg font-semibold pr-8 focus:outline-none focus:ring-2 focus:ring-primary-300"
              >
                {farms.map((farm) => (
                  <option key={farm.Id} value={farm.Id} className="text-gray-900">
                    {farm.name}
                  </option>
                ))}
              </select>
              <ApperIcon 
                name="ChevronDown" 
                size={16} 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white pointer-events-none"
              />
            </div>
          )}
          
          <div className="flex items-center space-x-2 bg-gradient-to-r from-primary-50 to-secondary-50 px-3 py-2 rounded-lg">
            <ApperIcon name="User" size={20} className="text-primary-600" />
            <span className="text-primary-700 font-semibold hidden sm:inline">Farmer</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;