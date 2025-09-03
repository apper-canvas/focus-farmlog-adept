import React, { useState } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const SearchBar = ({ 
  className, 
  placeholder = "Search...", 
  onSearch,
  value,
  onChange,
  ...props 
}) => {
  const [searchValue, setSearchValue] = useState(value || "");

  const handleChange = (e) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    if (onChange) onChange(newValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchValue);
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <div className="relative">
        <ApperIcon 
          name="Search" 
          size={20} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder={placeholder}
          value={searchValue}
          onChange={handleChange}
          className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:ring-0 transition-colors duration-200 text-gray-900 placeholder-gray-400"
          {...props}
        />
      </div>
    </form>
  );
};

export default SearchBar;