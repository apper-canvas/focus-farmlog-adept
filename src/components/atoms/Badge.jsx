import React from "react";
import { cn } from "@/utils/cn";

const Badge = ({ variant = "default", size = "md", className, children, ...props }) => {
  const baseStyles = "inline-flex items-center font-semibold rounded-full";
  
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800",
    secondary: "bg-gradient-to-r from-secondary-100 to-secondary-200 text-secondary-800",
    success: "bg-gradient-to-r from-green-100 to-green-200 text-green-800",
    warning: "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800",
    error: "bg-gradient-to-r from-red-100 to-red-200 text-red-800",
    planted: "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800",
    growing: "bg-gradient-to-r from-green-100 to-green-200 text-green-800",
    ready: "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800",
    harvested: "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800"
  };
  
  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base"
  };

  return (
    <span
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;