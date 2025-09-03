class FarmService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'farm_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name_c"}},
          {"field": {"Name": "Location_c"}},
          {"field": {"Name": "Size_c"}},
          {"field": {"Name": "SizeUnit_c"}}
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching farms:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name_c"}},
          {"field": {"Name": "Location_c"}},
          {"field": {"Name": "Size_c"}},
          {"field": {"Name": "SizeUnit_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response?.data) {
        throw new Error("Farm not found");
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching farm ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async create(farmData) {
    try {
      const params = {
        records: [{
          Name_c: farmData.name,
          Location_c: farmData.location,
          Size_c: parseFloat(farmData.size),
          SizeUnit_c: farmData.sizeUnit
        }]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} farms:`, failed);
          throw new Error(failed[0].message || "Failed to create farm");
        }
        
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error creating farm:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, farmData) {
    try {
      const params = {
        records: [{
          Id: id,
          Name_c: farmData.name,
          Location_c: farmData.location,
          Size_c: parseFloat(farmData.size),
          SizeUnit_c: farmData.sizeUnit
        }]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} farms:`, failed);
          throw new Error(failed[0].message || "Failed to update farm");
        }
        
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error updating farm:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = { 
        RecordIds: [id]
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} farms:`, failed);
          throw new Error(failed[0].message || "Failed to delete farm");
        }
        
        return true;
      }
    } catch (error) {
      console.error("Error deleting farm:", error?.response?.data?.message || error);
      throw error;
    }
  }
}

export const farmService = new FarmService();