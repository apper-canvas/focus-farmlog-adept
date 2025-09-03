import React from "react";
import { cn } from "@/utils/cn";

const Card = ({ className, children, gradient = false, ...props }) => {
  const baseStyles = "bg-white rounded-xl shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-lg";
  const gradientStyles = gradient ? "bg-gradient-to-br from-white to-gray-50" : "";
  
  return (
    <div
      className={cn(baseStyles, gradientStyles, className)}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;