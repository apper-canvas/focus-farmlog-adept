import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import SearchBar from "@/components/molecules/SearchBar";
import TaskItem from "@/components/molecules/TaskItem";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { taskService } from "@/services/api/taskService";
import { farmService } from "@/services/api/farmService";
import { cropService } from "@/services/api/cropService";
import { toast } from "react-toastify";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [formData, setFormData] = useState({
    farmId: "",
    cropId: "",
    title: "",
    description: "",
    dueDate: "",
    priority: "medium"
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [tasksData, farmsData, cropsData] = await Promise.all([
        taskService.getAll(),
        farmService.getAll(),
        cropService.getAll()
      ]);
      setTasks(tasksData);
      setFarms(farmsData);
      setCrops(cropsData);
    } catch (err) {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const taskData = {
        ...formData,
        completed: false
      };
      
      if (editingTask) {
        await taskService.update(editingTask.Id, taskData);
        setTasks(tasks.map(t => t.Id === editingTask.Id ? { ...taskData, Id: editingTask.Id, completed: editingTask.completed } : t));
        toast.success("Task updated successfully!");
      } else {
        const newTask = await taskService.create(taskData);
        setTasks([...tasks, newTask]);
        toast.success("Task created successfully!");
      }
      resetForm();
    } catch (err) {
      toast.error("Failed to save task");
    }
  };

  const handleToggle = async (taskId) => {
    try {
      const task = tasks.find(t => t.Id === taskId);
      const updatedTask = { ...task, completed: !task.completed };
      await taskService.update(taskId, updatedTask);
      
      setTasks(tasks.map(t => t.Id === taskId ? updatedTask : t));
      toast.success(updatedTask.completed ? "Task completed!" : "Task reopened");
    } catch (err) {
      toast.error("Failed to update task");
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      farmId: task.farmId.toString(),
      cropId: task.cropId.toString(),
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority
    });
    setShowForm(true);
  };

  const handleDelete = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await taskService.delete(taskId);
        setTasks(tasks.filter(t => t.Id !== taskId));
        toast.success("Task deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete task");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      farmId: "",
      cropId: "",
      title: "",
      description: "",
      dueDate: "",
      priority: "medium"
    });
    setShowForm(false);
    setEditingTask(null);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === "" || task.priority === priorityFilter;
    const matchesStatus = statusFilter === "" || 
                         (statusFilter === "completed" && task.completed) ||
                         (statusFilter === "pending" && !task.completed);
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const sortedTasks = filteredTasks.sort((a, b) => {
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  const priorityOptions = [
    { value: "high", label: "High Priority" },
    { value: "medium", label: "Medium Priority" },
    { value: "low", label: "Low Priority" }
  ];

  const statusFilterOptions = [
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" }
  ];

  const farmOptions = farms.map(farm => ({
    value: farm.Id.toString(),
    label: farm.name
  }));

  const cropOptions = crops.map(crop => ({
    value: crop.Id.toString(),
    label: `${crop.type} - ${crop.field}`
  }));

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-3xl bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
          Task Management
        </h1>
        <Button 
          onClick={() => setShowForm(true)}
          className="shadow-lg"
        >
          <ApperIcon name="Plus" size={20} className="mr-2" />
          Add Task
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6" gradient>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SearchBar
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={setSearchTerm}
          />
          <Select
            placeholder="Filter by priority"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            options={priorityOptions}
          />
          <Select
            placeholder="Filter by status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={statusFilterOptions}
          />
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              Showing {sortedTasks.length} of {tasks.length} tasks
            </span>
          </div>
        </div>
      </Card>

      {showForm && (
        <Card className="p-6" gradient>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-semibold text-xl text-gray-900">
              {editingTask ? "Edit Task" : "Create New Task"}
            </h2>
            <Button variant="ghost" onClick={resetForm}>
              <ApperIcon name="X" size={20} />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Task Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter task title"
              required
            />
            
            <Select
              label="Priority"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              options={priorityOptions}
            />
            
            <Select
              label="Farm"
              value={formData.farmId}
              onChange={(e) => setFormData({ ...formData, farmId: e.target.value })}
              options={farmOptions}
              placeholder="Select farm"
              required
            />
            
            <Select
              label="Related Crop (Optional)"
              value={formData.cropId}
              onChange={(e) => setFormData({ ...formData, cropId: e.target.value })}
              options={cropOptions}
              placeholder="Select crop"
            />
            
            <Input
              label="Due Date"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              required
            />

            <div className="md:col-span-2">
              <Input
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the task details"
                required
              />
            </div>

            <div className="md:col-span-2 flex space-x-4">
              <Button type="submit" className="flex-1">
                <ApperIcon name="Save" size={16} className="mr-2" />
                {editingTask ? "Update Task" : "Create Task"}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {sortedTasks.length === 0 ? (
        tasks.length === 0 ? (
          <Empty
            title="No tasks created yet"
            description="Start by creating your first task to keep track of your farm activities"
            icon="CheckSquare"
            action={() => setShowForm(true)}
            actionLabel="Create First Task"
          />
        ) : (
          <Empty
            title="No tasks match your filters"
            description="Try adjusting your search or filter criteria to find tasks"
            icon="Search"
          />
        )
      ) : (
        <Card className="p-6">
          <div className="space-y-4">
            {sortedTasks.map((task) => (
              <TaskItem
                key={task.Id}
                task={task}
                onToggle={handleToggle}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Tasks;