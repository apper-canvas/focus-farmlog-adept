import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className, 
  type = "text", 
  label,
  error,
  ...props 
}, ref) => {
  const inputStyles = "block w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:ring-0 transition-colors duration-200 text-gray-900 placeholder-gray-400";
  
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        className={cn(
          inputStyles,
          error && "border-error focus:border-error",
          className
        )}
        ref={ref}
        {...props}
      />
      {error && (
        <p className="text-sm text-error mt-1">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;