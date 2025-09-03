import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Select = forwardRef(({ 
  className, 
  label,
  error,
  options = [],
  placeholder = "Select option",
  ...props 
}, ref) => {
  const selectStyles = "block w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:ring-0 transition-colors duration-200 text-gray-900 bg-white appearance-none";
  
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={cn(
            selectStyles,
            error && "border-error focus:border-error",
            className
          )}
          ref={ref}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ApperIcon 
          name="ChevronDown" 
          size={20} 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
        />
      </div>
      {error && (
        <p className="text-sm text-error mt-1">{error}</p>
      )}
    </div>
  );
});

Select.displayName = "Select";

export default Select;