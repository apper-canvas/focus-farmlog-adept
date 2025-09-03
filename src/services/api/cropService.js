import cropsData from "../mockData/crops.json";

class CropService {
  constructor() {
    this.crops = [...cropsData];
  }

  async getAll() {
    await this.delay();
    return [...this.crops];
  }

  async getById(id) {
    await this.delay();
    const crop = this.crops.find(c => c.Id === id);
    if (!crop) throw new Error("Crop not found");
    return { ...crop };
  }

  async getByFarm(farmId) {
    await this.delay();
    return this.crops.filter(c => c.farmId === farmId).map(c => ({ ...c }));
  }

  async create(cropData) {
    await this.delay();
    const newId = Math.max(...this.crops.map(c => c.Id)) + 1;
    const newCrop = {
      ...cropData,
      Id: newId,
      farmId: parseInt(cropData.farmId),
      cropId: cropData.cropId ? parseInt(cropData.cropId) : null
    };
    this.crops.push(newCrop);
    return { ...newCrop };
  }

  async update(id, cropData) {
    await this.delay();
    const index = this.crops.findIndex(c => c.Id === id);
    if (index === -1) throw new Error("Crop not found");
    
    this.crops[index] = {
      ...cropData,
      Id: id,
      farmId: parseInt(cropData.farmId),
      cropId: cropData.cropId ? parseInt(cropData.cropId) : null
    };
    return { ...this.crops[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.crops.findIndex(c => c.Id === id);
    if (index === -1) throw new Error("Crop not found");
    
    this.crops.splice(index, 1);
    return true;
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 300));
  }
}

export const cropService = new CropService();