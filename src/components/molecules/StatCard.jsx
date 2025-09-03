import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend,
  trendDirection = "up",
  className,
  gradient = true
}) => {
  const trendColor = trendDirection === "up" ? "text-success" : "text-error";
  const trendIcon = trendDirection === "up" ? "TrendingUp" : "TrendingDown";

  return (
    <Card className={cn("p-6", className)} gradient={gradient}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
            {value}
          </p>
          {trend && (
            <div className="flex items-center mt-2 space-x-1">
              <ApperIcon name={trendIcon} size={16} className={trendColor} />
              <span className={`text-sm font-medium ${trendColor}`}>{trend}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="bg-gradient-to-br from-primary-500 to-secondary-400 p-3 rounded-xl">
            <ApperIcon name={icon} size={24} className="text-white" />
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;