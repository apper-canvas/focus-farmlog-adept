import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-2xl shadow-lg text-center max-w-md mx-auto">
        <div className="bg-gradient-to-r from-error to-red-400 p-4 rounded-full inline-block mb-4">
          <ApperIcon name="AlertCircle" size={32} className="text-white" />
        </div>
        <h3 className="font-display font-semibold text-xl text-gray-800 mb-2">
          Oops! Something went wrong
        </h3>
        <p className="text-gray-600 mb-6 leading-relaxed">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:scale-105 transform transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <ApperIcon name="RefreshCw" size={16} className="inline mr-2" />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default Error;