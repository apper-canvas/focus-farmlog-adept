import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import StatCard from "@/components/molecules/StatCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { transactionService } from "@/services/api/transactionService";
import { farmService } from "@/services/api/farmService";
import { toast } from "react-toastify";
import { format } from "date-fns";

const Finance = () => {
  const [transactions, setTransactions] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [formData, setFormData] = useState({
    farmId: "",
    type: "expense",
    category: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    description: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [transactionsData, farmsData] = await Promise.all([
        transactionService.getAll(),
        farmService.getAll()
      ]);
      setTransactions(transactionsData);
      setFarms(farmsData);
    } catch (err) {
      setError("Failed to load financial data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount)
      };
      
      if (editingTransaction) {
        await transactionService.update(editingTransaction.Id, transactionData);
        setTransactions(transactions.map(t => t.Id === editingTransaction.Id ? { ...transactionData, Id: editingTransaction.Id } : t));
        toast.success("Transaction updated successfully!");
      } else {
        const newTransaction = await transactionService.create(transactionData);
        setTransactions([...transactions, newTransaction]);
        toast.success("Transaction recorded successfully!");
      }
      resetForm();
    } catch (err) {
      toast.error("Failed to save transaction");
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      farmId: transaction.farmId.toString(),
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount.toString(),
      date: transaction.date,
      description: transaction.description
    });
    setShowForm(true);
  };

  const handleDelete = async (transactionId) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await transactionService.delete(transactionId);
        setTransactions(transactions.filter(t => t.Id !== transactionId));
        toast.success("Transaction deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete transaction");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      farmId: "",
      type: "expense",
      category: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      description: ""
    });
    setShowForm(false);
    setEditingTransaction(null);
  };

  const getFarmName = (farmId) => {
    const farm = farms.find(f => f.Id === parseInt(farmId));
    return farm ? farm.name : "Unknown Farm";
  };

  const getFinancialStats = () => {
    const currentMonth = new Date();
    const currentYear = currentMonth.getFullYear();
    const currentMonthIndex = currentMonth.getMonth();
    
    const thisMonthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getFullYear() === currentYear && 
             transactionDate.getMonth() === currentMonthIndex;
    });
    
    const thisYearTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getFullYear() === currentYear;
    });
    
    const monthIncome = thisMonthTransactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
      
    const monthExpenses = thisMonthTransactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
      
    const yearIncome = thisYearTransactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
      
    const yearExpenses = thisYearTransactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
      
    return {
      monthIncome,
      monthExpenses,
      monthProfit: monthIncome - monthExpenses,
      yearProfit: yearIncome - yearExpenses
    };
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "" || transaction.type === typeFilter;
    const matchesCategory = categoryFilter === "" || transaction.category === categoryFilter;
    return matchesSearch && matchesType && matchesCategory;
  });

  const sortedTransactions = filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

  const expenseCategories = [
    { value: "seeds", label: "Seeds" },
    { value: "fertilizer", label: "Fertilizer" },
    { value: "equipment", label: "Equipment" },
    { value: "fuel", label: "Fuel" },
    { value: "labor", label: "Labor" },
    { value: "irrigation", label: "Irrigation" },
    { value: "pest_control", label: "Pest Control" },
    { value: "maintenance", label: "Maintenance" },
    { value: "other", label: "Other" }
  ];

  const incomeCategories = [
    { value: "crop_sales", label: "Crop Sales" },
    { value: "livestock", label: "Livestock" },
    { value: "subsidies", label: "Subsidies" },
    { value: "grants", label: "Grants" },
    { value: "other", label: "Other" }
  ];

  const typeOptions = [
    { value: "expense", label: "Expense" },
    { value: "income", label: "Income" }
  ];

  const categoryOptions = formData.type === "expense" ? expenseCategories : incomeCategories;
  const farmOptions = farms.map(farm => ({ value: farm.Id.toString(), label: farm.name }));

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const stats = getFinancialStats();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-3xl bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
          Financial Management
        </h1>
        <Button 
          onClick={() => setShowForm(true)}
          className="shadow-lg"
        >
          <ApperIcon name="Plus" size={20} className="mr-2" />
          Add Transaction
        </Button>
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Month Income"
          value={`$${stats.monthIncome.toLocaleString()}`}
          icon="TrendingUp"
          trend="+12% from last month"
          trendDirection="up"
        />
        <StatCard
          title="Month Expenses"
          value={`$${stats.monthExpenses.toLocaleString()}`}
          icon="TrendingDown"
          trend="+8% from last month"
          trendDirection="up"
        />
        <StatCard
          title="Month Profit"
          value={`$${stats.monthProfit.toLocaleString()}`}
          icon="DollarSign"
          trend={stats.monthProfit >= 0 ? "+5% from last month" : "-3% from last month"}
          trendDirection={stats.monthProfit >= 0 ? "up" : "down"}
        />
        <StatCard
          title="Year Profit"
          value={`$${stats.yearProfit.toLocaleString()}`}
          icon="BarChart3"
          trend="+15% from last year"
          trendDirection="up"
        />
      </div>

      {/* Filters */}
      <Card className="p-6" gradient>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SearchBar
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={setSearchTerm}
          />
          <Select
            placeholder="Filter by type"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            options={typeOptions}
          />
          <Select
            placeholder="Filter by category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={[...expenseCategories, ...incomeCategories]}
          />
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              Showing {sortedTransactions.length} of {transactions.length} transactions
            </span>
          </div>
        </div>
      </Card>

      {showForm && (
        <Card className="p-6" gradient>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-semibold text-xl text-gray-900">
              {editingTransaction ? "Edit Transaction" : "Add New Transaction"}
            </h2>
            <Button variant="ghost" onClick={resetForm}>
              <ApperIcon name="X" size={20} />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Farm"
              value={formData.farmId}
              onChange={(e) => setFormData({ ...formData, farmId: e.target.value })}
              options={farmOptions}
              placeholder="Select farm"
              required
            />
            
            <Select
              label="Type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value, category: "" })}
              options={typeOptions}
            />
            
            <Select
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={categoryOptions}
              placeholder="Select category"
              required
            />
            
            <Input
              label="Amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
            
            <Input
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />

            <div className="md:col-span-2">
              <Input
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Transaction description"
                required
              />
            </div>

            <div className="md:col-span-2 flex space-x-4">
              <Button type="submit" className="flex-1">
                <ApperIcon name="Save" size={16} className="mr-2" />
                {editingTransaction ? "Update Transaction" : "Add Transaction"}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {sortedTransactions.length === 0 ? (
        transactions.length === 0 ? (
          <Empty
            title="No transactions recorded"
            description="Start tracking your farm finances by recording your first transaction"
            icon="DollarSign"
            action={() => setShowForm(true)}
            actionLabel="Add First Transaction"
          />
        ) : (
          <Empty
            title="No transactions match your filters"
            description="Try adjusting your search or filter criteria to find transactions"
            icon="Search"
          />
        )
      ) : (
        <Card className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Farm</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Amount</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedTransactions.map((transaction) => (
                  <tr key={transaction.Id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {format(new Date(transaction.date), "MMM d, yyyy")}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {getFarmName(transaction.farmId)}
                    </td>
                    <td className="py-4 px-4">
                      <Badge 
                        variant={transaction.type === "income" ? "success" : "warning"} 
                        size="sm"
                      >
                        {transaction.type}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600 capitalize">
                      {transaction.category.replace("_", " ")}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {transaction.description}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className={`font-semibold ${transaction.type === "income" ? "text-success" : "text-error"}`}>
                        {transaction.type === "income" ? "+" : "-"}${transaction.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(transaction)}
                          className="p-1 text-gray-400 hover:text-primary-500 transition-colors duration-200"
                        >
                          <ApperIcon name="Edit2" size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(transaction.Id)}
                          className="p-1 text-gray-400 hover:text-error transition-colors duration-200"
                        >
                          <ApperIcon name="Trash2" size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Finance;