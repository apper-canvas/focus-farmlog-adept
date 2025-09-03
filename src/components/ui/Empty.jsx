import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data found", 
  description = "Get started by adding your first item", 
  icon = "Sprout",
  action,
  actionLabel = "Add New"
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="bg-gradient-to-br from-primary-50 to-secondary-100 p-8 rounded-2xl shadow-lg inline-block mb-6">
          <div className="bg-gradient-to-r from-primary-500 to-secondary-400 p-4 rounded-full inline-block">
            <ApperIcon name={icon} size={48} className="text-white" />
          </div>
        </div>
        <h3 className="font-display font-bold text-2xl bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent mb-3">
          {title}
        </h3>
        <p className="text-gray-600 mb-8 leading-relaxed text-lg">{description}</p>
        {action && (
          <button
            onClick={action}
            className="bg-gradient-to-r from-accent-500 to-orange-500 text-white px-8 py-4 rounded-xl font-semibold hover:scale-105 transform transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
          >
            <ApperIcon name="Plus" size={20} className="inline mr-2" />
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default Empty;