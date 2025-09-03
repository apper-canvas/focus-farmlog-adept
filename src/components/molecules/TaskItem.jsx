import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { format } from "date-fns";

const TaskItem = ({ task, onToggle, onEdit, onDelete, className }) => {
  const getPriorityColor = (priority) => {
    const colors = {
      "high": "error",
      "medium": "warning",
      "low": "success"
    };
    return colors[priority.toLowerCase()] || "default";
  };

  const isOverdue = new Date(task.dueDate) < new Date() && !task.completed;

  return (
    <div className={cn(
      "flex items-center justify-between p-4 bg-white rounded-lg border transition-all duration-200 hover:shadow-md",
      task.completed && "opacity-60 bg-gray-50",
      isOverdue && !task.completed && "border-error bg-red-50",
      className
    )}>
      <div className="flex items-center space-x-4 flex-1">
        <button
          onClick={() => onToggle(task.Id)}
          className={cn(
            "flex-shrink-0 w-5 h-5 rounded border-2 transition-all duration-200",
            task.completed
              ? "bg-gradient-to-r from-primary-500 to-secondary-400 border-primary-500"
              : "border-gray-300 hover:border-primary-500"
          )}
        >
          {task.completed && (
            <ApperIcon name="Check" size={14} className="text-white m-0.5" />
          )}
        </button>
        
        <div className="flex-1 min-w-0">
          <h4 className={cn(
            "font-semibold text-gray-900 truncate",
            task.completed && "line-through text-gray-500"
          )}>
            {task.title}
          </h4>
          <p className="text-sm text-gray-600 truncate">{task.description}</p>
          <div className="flex items-center space-x-3 mt-2">
            <span className="text-xs text-gray-500 flex items-center">
              <ApperIcon name="Calendar" size={12} className="mr-1" />
              {format(new Date(task.dueDate), "MMM d, yyyy")}
            </span>
            <Badge variant={getPriorityColor(task.priority)} size="sm">
              {task.priority}
            </Badge>
            {isOverdue && !task.completed && (
              <Badge variant="error" size="sm">Overdue</Badge>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 ml-4">
        <button
          onClick={() => onEdit(task)}
          className="p-2 text-gray-400 hover:text-primary-500 transition-colors duration-200"
        >
          <ApperIcon name="Edit2" size={16} />
        </button>
        <button
          onClick={() => onDelete(task.Id)}
          className="p-2 text-gray-400 hover:text-error transition-colors duration-200"
        >
          <ApperIcon name="Trash2" size={16} />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;