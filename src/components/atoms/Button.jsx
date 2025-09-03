import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  icon,
  iconPosition = "left",
  loading = false,
  children, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:scale-105 hover:shadow-lg focus:ring-primary-500",
    secondary: "bg-gradient-to-r from-secondary-300 to-secondary-400 text-white hover:scale-105 hover:shadow-lg focus:ring-secondary-400",
    accent: "bg-gradient-to-r from-accent-500 to-orange-500 text-white hover:scale-105 hover:shadow-lg focus:ring-accent-500",
    outline: "border-2 border-primary-500 text-primary-600 hover:bg-primary-50 focus:ring-primary-500",
    ghost: "text-primary-600 hover:bg-primary-50 focus:ring-primary-500",
    danger: "bg-gradient-to-r from-error to-red-400 text-white hover:scale-105 hover:shadow-lg focus:ring-red-500"
  };
  
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-base",
    lg: "px-6 py-4 text-lg",
    xl: "px-8 py-5 text-xl"
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <ApperIcon name="Loader2" size={16} className="animate-spin mr-2" />
      ) : (
        icon && iconPosition === "left" && (
          <ApperIcon name={icon} size={16} className="mr-2" />
        )
      )}
      {children}
      {icon && iconPosition === "right" && !loading && (
        <ApperIcon name={icon} size={16} className="ml-2" />
      )}
    </button>
  );
});

Button.displayName = "Button";

export default Button;