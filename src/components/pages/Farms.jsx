import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Modal from "@/components/atoms/Modal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { farmService } from "@/services/api/farmService";
import { toast } from "react-toastify";

const Farms = () => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingFarm, setEditingFarm] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    size: "",
    sizeUnit: "acres"
  });

  useEffect(() => {
    loadFarms();
  }, []);

  const loadFarms = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await farmService.getAll();
      setFarms(data);
    } catch (err) {
      setError("Failed to load farms");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFarm) {
        await farmService.update(editingFarm.Id, formData);
        setFarms(farms.map(f => f.Id === editingFarm.Id ? { ...formData, Id: editingFarm.Id } : f));
        toast.success("Farm updated successfully!");
      } else {
        const newFarm = await farmService.create(formData);
        setFarms([...farms, newFarm]);
        toast.success("Farm added successfully!");
      }
      resetForm();
    } catch (err) {
      toast.error("Failed to save farm");
    }
  };

  const handleEdit = (farm) => {
    setEditingFarm(farm);
    setFormData({
      name: farm.name,
      location: farm.location,
      size: farm.size.toString(),
      sizeUnit: farm.sizeUnit
    });
    setShowForm(true);
  };

  const handleDelete = async (farmId) => {
    if (window.confirm("Are you sure you want to delete this farm?")) {
      try {
        await farmService.delete(farmId);
        setFarms(farms.filter(f => f.Id !== farmId));
        toast.success("Farm deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete farm");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      location: "",
      size: "",
      sizeUnit: "acres"
    });
    setShowForm(false);
    setEditingFarm(null);
  };

  const sizeUnitOptions = [
    { value: "acres", label: "Acres" },
    { value: "hectares", label: "Hectares" },
    { value: "square_feet", label: "Square Feet" },
    { value: "square_meters", label: "Square Meters" }
  ];

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadFarms} />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-3xl bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
          Farm Management
        </h1>
<Button 
          onClick={() => setShowForm(true)}
          className="shadow-lg"
        >
          <ApperIcon name="Plus" size={20} className="mr-2" />
          Add Farm
        </Button>
      </div>

<Modal
        isOpen={showForm}
        onClose={resetForm}
        title={editingFarm ? "Edit Farm" : "Add New Farm"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Farm Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter farm name"
            required
          />
          
          <Input
            label="Location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Enter farm location"
            required
          />
          
          <Input
            label="Farm Size"
            type="number"
            value={formData.size}
            onChange={(e) => setFormData({ ...formData, size: e.target.value })}
            placeholder="Enter size"
            min="0"
            step="0.1"
            required
          />
          
          <Select
            label="Size Unit"
            value={formData.sizeUnit}
            onChange={(e) => setFormData({ ...formData, sizeUnit: e.target.value })}
            options={sizeUnitOptions}
          />

          <div className="md:col-span-2 flex space-x-4">
            <Button type="submit" className="flex-1">
              <ApperIcon name="Save" size={16} className="mr-2" />
              {editingFarm ? "Update Farm" : "Add Farm"}
            </Button>
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {farms.length === 0 ? (
<Empty
          title="No farms added yet"
          description="Start by adding your first farm to begin managing your agricultural operations"
          icon="MapPin"
          action={() => setShowForm(true)}
          actionLabel="Add First Farm"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farms.map((farm) => (
            <Card key={farm.Id} className="p-6 hover:scale-105 transition-transform duration-200" gradient>
              <div className="flex items-start justify-between mb-4">
                <div className="bg-gradient-to-br from-primary-500 to-secondary-400 p-3 rounded-xl">
                  <ApperIcon name="MapPin" size={24} className="text-white" />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(farm)}
                    className="p-2 text-gray-400 hover:text-primary-500 transition-colors duration-200"
                  >
                    <ApperIcon name="Edit2" size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(farm.Id)}
                    className="p-2 text-gray-400 hover:text-error transition-colors duration-200"
                  >
                    <ApperIcon name="Trash2" size={16} />
                  </button>
                </div>
              </div>
              
              <h3 className="font-display font-bold text-xl text-gray-900 mb-2">
                {farm.name}
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-gray-600">
                  <ApperIcon name="MapPin" size={16} />
                  <span>{farm.location}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-gray-600">
                  <ApperIcon name="Ruler" size={16} />
                  <span>{farm.size} {farm.sizeUnit}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Farms;