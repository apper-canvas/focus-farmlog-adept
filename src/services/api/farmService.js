import farmsData from "../mockData/farms.json";

class FarmService {
  constructor() {
    this.farms = [...farmsData];
  }

  async getAll() {
    await this.delay();
    return [...this.farms];
  }

  async getById(id) {
    await this.delay();
    const farm = this.farms.find(f => f.Id === id);
    if (!farm) throw new Error("Farm not found");
    return { ...farm };
  }

  async create(farmData) {
    await this.delay();
    const newId = Math.max(...this.farms.map(f => f.Id)) + 1;
    const newFarm = {
      ...farmData,
      Id: newId,
      size: parseFloat(farmData.size)
    };
    this.farms.push(newFarm);
    return { ...newFarm };
  }

  async update(id, farmData) {
    await this.delay();
    const index = this.farms.findIndex(f => f.Id === id);
    if (index === -1) throw new Error("Farm not found");
    
    this.farms[index] = {
      ...farmData,
      Id: id,
      size: parseFloat(farmData.size)
    };
    return { ...this.farms[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.farms.findIndex(f => f.Id === id);
    if (index === -1) throw new Error("Farm not found");
    
    this.farms.splice(index, 1);
    return true;
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 300));
  }
}

export const farmService = new FarmService();