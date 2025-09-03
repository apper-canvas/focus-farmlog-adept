class CropService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'crop_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "CropType_c"}},
          {"field": {"Name": "PlantingDate_c"}},
          {"field": {"Name": "ExpectedHarvest_c"}},
          {"field": {"Name": "Field_c"}},
          {"field": {"Name": "Status_c"}},
          {"field": {"Name": "Notes_c"}},
          {"field": {"Name": "FarmId_c"}}
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching crops:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "CropType_c"}},
          {"field": {"Name": "PlantingDate_c"}},
          {"field": {"Name": "ExpectedHarvest_c"}},
          {"field": {"Name": "Field_c"}},
          {"field": {"Name": "Status_c"}},
          {"field": {"Name": "Notes_c"}},
          {"field": {"Name": "FarmId_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response?.data) {
        throw new Error("Crop not found");
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching crop ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async getByFarm(farmId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "CropType_c"}},
          {"field": {"Name": "PlantingDate_c"}},
          {"field": {"Name": "ExpectedHarvest_c"}},
          {"field": {"Name": "Field_c"}},
          {"field": {"Name": "Status_c"}},
          {"field": {"Name": "Notes_c"}},
          {"field": {"Name": "FarmId_c"}}
        ],
        where: [{"FieldName": "FarmId_c", "Operator": "EqualTo", "Values": [parseInt(farmId)]}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching crops by farm:", error?.response?.data?.message || error);
      return [];
    }
  }

  async create(cropData) {
    try {
      const params = {
        records: [{
          CropType_c: cropData.type,
          PlantingDate_c: cropData.plantingDate,
          ExpectedHarvest_c: cropData.expectedHarvest,
          Field_c: cropData.field,
          Status_c: cropData.status,
          Notes_c: cropData.notes,
          FarmId_c: parseInt(cropData.farmId)
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
          console.error(`Failed to create ${failed.length} crops:`, failed);
          throw new Error(failed[0].message || "Failed to create crop");
        }
        
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error creating crop:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, cropData) {
    try {
      const params = {
        records: [{
          Id: id,
          CropType_c: cropData.type,
          PlantingDate_c: cropData.plantingDate,
          ExpectedHarvest_c: cropData.expectedHarvest,
          Field_c: cropData.field,
          Status_c: cropData.status,
          Notes_c: cropData.notes,
          FarmId_c: parseInt(cropData.farmId)
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
          console.error(`Failed to update ${failed.length} crops:`, failed);
          throw new Error(failed[0].message || "Failed to update crop");
        }
        
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error updating crop:", error?.response?.data?.message || error);
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
          console.error(`Failed to delete ${failed.length} crops:`, failed);
          throw new Error(failed[0].message || "Failed to delete crop");
        }
        
        return true;
      }
    } catch (error) {
      console.error("Error deleting crop:", error?.response?.data?.message || error);
      throw error;
    }
  }
}

export const cropService = new CropService();

export const cropService = new CropService();