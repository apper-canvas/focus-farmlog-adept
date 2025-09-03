import React, { useState, useEffect } from "react";
import StatCard from "@/components/molecules/StatCard";
import WeatherCard from "@/components/molecules/WeatherCard";
import TaskItem from "@/components/molecules/TaskItem";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { cropService } from "@/services/api/cropService";
import { taskService } from "@/services/api/taskService";
import { transactionService } from "@/services/api/transactionService";
import { weatherService } from "@/services/api/weatherService";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [data, setData] = useState({
    crops: [],
    tasks: [],
    transactions: [],
    weather: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [crops, tasks, transactions, weather] = await Promise.all([
        cropService.getAll(),
        taskService.getAll(),
        transactionService.getAll(),
        weatherService.getCurrent()
      ]);

      setData({ crops, tasks, transactions, weather });
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = async (taskId) => {
    try {
      const task = data.tasks.find(t => t.Id === taskId);
      const updatedTask = { ...task, completed: !task.completed };
      await taskService.update(taskId, updatedTask);
      
      setData(prev => ({
        ...prev,
        tasks: prev.tasks.map(t => t.Id === taskId ? updatedTask : t)
      }));
      
      toast.success(updatedTask.completed ? "Task completed!" : "Task reopened");
    } catch (err) {
      toast.error("Failed to update task");
    }
  };

  const getStats = () => {
    const activeCrops = data.crops.filter(c => c.status !== "harvested").length;
    const pendingTasks = data.tasks.filter(t => !t.completed).length;
    const weekExpenses = data.transactions
      .filter(t => t.type === "expense" && new Date(t.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
      .reduce((sum, t) => sum + t.amount, 0);
    const monthIncome = data.transactions
      .filter(t => t.type === "income" && new Date(t.date) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
      .reduce((sum, t) => sum + t.amount, 0);

    return { activeCrops, pendingTasks, weekExpenses, monthIncome };
  };

  if (loading) return <Loading type="dashboard" />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  const stats = getStats();
  const upcomingTasks = data.tasks
    .filter(t => !t.completed)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Crops"
          value={stats.activeCrops}
          icon="Sprout"
          trend="+2 this month"
          trendDirection="up"
        />
        <StatCard
          title="Pending Tasks"
          value={stats.pendingTasks}
          icon="CheckSquare"
          trend="-5 this week"
          trendDirection="down"
        />
        <StatCard
          title="Week Expenses"
          value={`$${stats.weekExpenses.toLocaleString()}`}
          icon="TrendingDown"
          trend="+12% from last week"
          trendDirection="up"
        />
        <StatCard
          title="Month Income"
          value={`$${stats.monthIncome.toLocaleString()}`}
          icon="TrendingUp"
          trend="+8% from last month"
          trendDirection="up"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Tasks */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-xl text-gray-900">
                Upcoming Tasks
              </h2>
              <Button size="sm" variant="outline">
                <ApperIcon name="Plus" size={16} className="mr-2" />
                Add Task
              </Button>
            </div>
            
            {upcomingTasks.length > 0 ? (
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <TaskItem
                    key={task.Id}
                    task={task}
                    onToggle={handleToggleTask}
                    onEdit={() => {}}
                    onDelete={() => {}}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ApperIcon name="CheckCircle" size={48} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">All caught up! No pending tasks.</p>
              </div>
            )}
          </Card>
        </div>

        {/* Weather */}
        <div>
          <Card className="p-6 mb-6">
            <h2 className="font-display font-bold text-xl text-gray-900 mb-4">
              Weather Today
            </h2>
            {data.weather ? (
              <WeatherCard weather={data.weather} />
            ) : (
              <div className="text-center py-8">
                <ApperIcon name="CloudOff" size={48} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Weather data unavailable</p>
              </div>
            )}
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h2 className="font-display font-bold text-xl text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <ApperIcon name="Sprout" size={16} className="mr-3" />
                Add New Crop
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <ApperIcon name="MapPin" size={16} className="mr-3" />
                Add Farm
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <ApperIcon name="DollarSign" size={16} className="mr-3" />
                Record Transaction
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <ApperIcon name="CheckSquare" size={16} className="mr-3" />
                Create Task
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;