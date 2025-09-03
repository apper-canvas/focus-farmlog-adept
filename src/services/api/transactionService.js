class TransactionService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'transaction_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Type_c"}},
          {"field": {"Name": "Category_c"}},
          {"field": {"Name": "Amount_c"}},
          {"field": {"Name": "Date_c"}},
          {"field": {"Name": "Description_c"}},
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
      console.error("Error fetching transactions:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Type_c"}},
          {"field": {"Name": "Category_c"}},
          {"field": {"Name": "Amount_c"}},
          {"field": {"Name": "Date_c"}},
          {"field": {"Name": "Description_c"}},
          {"field": {"Name": "FarmId_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response?.data) {
        throw new Error("Transaction not found");
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching transaction ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async getByFarm(farmId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Type_c"}},
          {"field": {"Name": "Category_c"}},
          {"field": {"Name": "Amount_c"}},
          {"field": {"Name": "Date_c"}},
          {"field": {"Name": "Description_c"}},
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
      console.error("Error fetching transactions by farm:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getByType(type) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Type_c"}},
          {"field": {"Name": "Category_c"}},
          {"field": {"Name": "Amount_c"}},
          {"field": {"Name": "Date_c"}},
          {"field": {"Name": "Description_c"}},
          {"field": {"Name": "FarmId_c"}}
        ],
        where: [{"FieldName": "Type_c", "Operator": "EqualTo", "Values": [type]}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching transactions by type:", error?.response?.data?.message || error);
      return [];
    }
  }

  async create(transactionData) {
    try {
      const params = {
        records: [{
          Type_c: transactionData.type,
          Category_c: transactionData.category,
          Amount_c: parseFloat(transactionData.amount),
          Date_c: transactionData.date,
          Description_c: transactionData.description,
          FarmId_c: parseInt(transactionData.farmId)
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
          console.error(`Failed to create ${failed.length} transactions:`, failed);
          throw new Error(failed[0].message || "Failed to create transaction");
        }
        
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error creating transaction:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, transactionData) {
    try {
      const params = {
        records: [{
          Id: id,
          Type_c: transactionData.type,
          Category_c: transactionData.category,
          Amount_c: parseFloat(transactionData.amount),
          Date_c: transactionData.date,
          Description_c: transactionData.description,
          FarmId_c: parseInt(transactionData.farmId)
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
          console.error(`Failed to update ${failed.length} transactions:`, failed);
          throw new Error(failed[0].message || "Failed to update transaction");
        }
        
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error updating transaction:", error?.response?.data?.message || error);
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
          console.error(`Failed to delete ${failed.length} transactions:`, failed);
          throw new Error(failed[0].message || "Failed to delete transaction");
        }
        
        return true;
      }
    } catch (error) {
      console.error("Error deleting transaction:", error?.response?.data?.message || error);
      throw error;
    }
  }
}

export const transactionService = new TransactionService();
export const transactionService = new TransactionService();