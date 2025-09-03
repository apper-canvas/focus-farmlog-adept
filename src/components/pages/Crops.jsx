import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { cropService } from "@/services/api/cropService";
import { farmService } from "@/services/api/farmService";
import { toast } from "react-toastify";
import { format } from "date-fns";

const Crops = () => {
  const [crops, setCrops] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCrop, setEditingCrop] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [formData, setFormData] = useState({
    farmId: "",
    type: "",
    plantingDate: "",
    expectedHarvest: "",
    field: "",
    status: "planted",
    notes: ""
  });

  useEffect(() => {
    loadCrops();
    loadFarms();
  }, []);

  const loadCrops = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await cropService.getAll();
      setCrops(data);
    } catch (err) {
      setError("Failed to load crops");
    } finally {
      setLoading(false);
    }
  };

  const loadFarms = async () => {
    try {
      const data = await farmService.getAll();
      setFarms(data);
    } catch (err) {
      console.error("Error loading farms:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCrop) {
        await cropService.update(editingCrop.Id, formData);
        setCrops(crops.map(c => c.Id === editingCrop.Id ? { ...formData, Id: editingCrop.Id } : c));
        toast.success("Crop updated successfully!");
      } else {
        const newCrop = await cropService.create(formData);
        setCrops([...crops, newCrop]);
        toast.success("Crop added successfully!");
      }
      resetForm();
    } catch (err) {
      toast.error("Failed to save crop");
    }
  };

  const handleEdit = (crop) => {
    setEditingCrop(crop);
    setFormData({
      farmId: crop.farmId.toString(),
      type: crop.type,
      plantingDate: crop.plantingDate,
      expectedHarvest: crop.expectedHarvest,
      field: crop.field,
      status: crop.status,
      notes: crop.notes
    });
    setShowForm(true);
  };

  const handleDelete = async (cropId) => {
    if (window.confirm("Are you sure you want to delete this crop?")) {
      try {
        await cropService.delete(cropId);
        setCrops(crops.filter(c => c.Id !== cropId));
        toast.success("Crop deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete crop");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      farmId: "",
      type: "",
      plantingDate: "",
      expectedHarvest: "",
      field: "",
      status: "planted",
      notes: ""
    });
    setShowForm(false);
    setEditingCrop(null);
  };

  const getFarmName = (farmId) => {
    const farm = farms.find(f => f.Id === parseInt(farmId));
    return farm ? farm.name : "Unknown Farm";
  };

  const filteredCrops = crops.filter(crop => {
    const matchesSearch = crop.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         crop.field.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "" || crop.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const cropTypeOptions = [
    { value: "corn", label: "Corn" },
    { value: "wheat", label: "Wheat" },
    { value: "soybeans", label: "Soybeans" },
    { value: "rice", label: "Rice" },
    { value: "tomatoes", label: "Tomatoes" },
    { value: "potatoes", label: "Potatoes" },
    { value: "carrots", label: "Carrots" },
    { value: "lettuce", label: "Lettuce" }
  ];

  const statusOptions = [
    { value: "planted", label: "Planted" },
    { value: "growing", label: "Growing" },
    { value: "ready", label: "Ready for Harvest" },
    { value: "harvested", label: "Harvested" }
  ];

  const farmOptions = farms.map(farm => ({
    value: farm.Id.toString(),
    label: farm.name
  }));

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadCrops} />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-3xl bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
          Crop Management
        </h1>
        <Button 
          onClick={() => setShowForm(true)}
          className="shadow-lg"
        >
          <ApperIcon name="Plus" size={20} className="mr-2" />
          Add Crop
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6" gradient>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SearchBar
            placeholder="Search crops or fields..."
            value={searchTerm}
            onChange={setSearchTerm}
          />
          <Select
            placeholder="Filter by status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={statusOptions}
          />
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              Showing {filteredCrops.length} of {crops.length} crops
            </span>
          </div>
        </div>
      </Card>

      {showForm && (
        <Card className="p-6" gradient>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-semibold text-xl text-gray-900">
              {editingCrop ? "Edit Crop" : "Add New Crop"}
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
              label="Crop Type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              options={cropTypeOptions}
              placeholder="Select crop type"
              required
            />
            
            <Input
              label="Planting Date"
              type="date"
              value={formData.plantingDate}
              onChange={(e) => setFormData({ ...formData, plantingDate: e.target.value })}
              required
            />
            
            <Input
              label="Expected Harvest"
              type="date"
              value={formData.expectedHarvest}
              onChange={(e) => setFormData({ ...formData, expectedHarvest: e.target.value })}
              required
            />
            
            <Input
              label="Field Name/Location"
              value={formData.field}
              onChange={(e) => setFormData({ ...formData, field: e.target.value })}
              placeholder="e.g., North Field, Field A"
              required
            />
            
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={statusOptions}
            />

            <div className="md:col-span-2">
              <Input
                label="Notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes about this crop"
              />
            </div>

            <div className="md:col-span-2 flex space-x-4">
              <Button type="submit" className="flex-1">
                <ApperIcon name="Save" size={16} className="mr-2" />
                {editingCrop ? "Update Crop" : "Add Crop"}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {filteredCrops.length === 0 ? (
        crops.length === 0 ? (
          <Empty
            title="No crops planted yet"
            description="Start by adding your first crop to begin tracking your agricultural operations"
            icon="Sprout"
            action={() => setShowForm(true)}
            actionLabel="Plant First Crop"
          />
        ) : (
          <Empty
            title="No crops match your filters"
            description="Try adjusting your search or filter criteria to find crops"
            icon="Search"
          />
        )
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCrops.map((crop) => (
            <Card key={crop.Id} className="p-6 hover:scale-105 transition-transform duration-200" gradient>
              <div className="flex items-start justify-between mb-4">
                <div className="bg-gradient-to-br from-primary-500 to-secondary-400 p-3 rounded-xl">
                  <ApperIcon name="Sprout" size={24} className="text-white" />
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={crop.status} size="sm">
                    {crop.status}
                  </Badge>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEdit(crop)}
                      className="p-2 text-gray-400 hover:text-primary-500 transition-colors duration-200"
                    >
                      <ApperIcon name="Edit2" size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(crop.Id)}
                      className="p-2 text-gray-400 hover:text-error transition-colors duration-200"
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </button>
                  </div>
                </div>
              </div>
              
              <h3 className="font-display font-bold text-xl text-gray-900 mb-2 capitalize">
                {crop.type}
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-gray-600">
                  <ApperIcon name="MapPin" size={16} />
                  <span>{getFarmName(crop.farmId)} - {crop.field}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-gray-600">
                  <ApperIcon name="Calendar" size={16} />
                  <span>Planted: {format(new Date(crop.plantingDate), "MMM d, yyyy")}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-gray-600">
                  <ApperIcon name="CalendarCheck" size={16} />
                  <span>Harvest: {format(new Date(crop.expectedHarvest), "MMM d, yyyy")}</span>
                </div>
                
                {crop.notes && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">{crop.notes}</p>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Crops;