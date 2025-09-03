class TaskService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'task_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Title_c"}},
          {"field": {"Name": "Description_c"}},
          {"field": {"Name": "DueDate_c"}},
          {"field": {"Name": "Priority_c"}},
          {"field": {"Name": "Completed_c"}},
          {"field": {"Name": "FarmId_c"}},
          {"field": {"Name": "CropId_c"}}
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Title_c"}},
          {"field": {"Name": "Description_c"}},
          {"field": {"Name": "DueDate_c"}},
          {"field": {"Name": "Priority_c"}},
          {"field": {"Name": "Completed_c"}},
          {"field": {"Name": "FarmId_c"}},
          {"field": {"Name": "CropId_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response?.data) {
        throw new Error("Task not found");
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async getByFarm(farmId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Title_c"}},
          {"field": {"Name": "Description_c"}},
          {"field": {"Name": "DueDate_c"}},
          {"field": {"Name": "Priority_c"}},
          {"field": {"Name": "Completed_c"}},
          {"field": {"Name": "FarmId_c"}},
          {"field": {"Name": "CropId_c"}}
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
      console.error("Error fetching tasks by farm:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getPending() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Title_c"}},
          {"field": {"Name": "Description_c"}},
          {"field": {"Name": "DueDate_c"}},
          {"field": {"Name": "Priority_c"}},
          {"field": {"Name": "Completed_c"}},
          {"field": {"Name": "FarmId_c"}},
          {"field": {"Name": "CropId_c"}}
        ],
        where: [{"FieldName": "Completed_c", "Operator": "EqualTo", "Values": [false]}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching pending tasks:", error?.response?.data?.message || error);
      return [];
    }
  }

  async create(taskData) {
    try {
      const params = {
        records: [{
          Title_c: taskData.title,
          Description_c: taskData.description,
          DueDate_c: taskData.dueDate,
          Priority_c: taskData.priority,
          Completed_c: false,
          FarmId_c: parseInt(taskData.farmId),
          CropId_c: taskData.cropId ? parseInt(taskData.cropId) : null
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
          console.error(`Failed to create ${failed.length} tasks:`, failed);
          throw new Error(failed[0].message || "Failed to create task");
        }
        
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error creating task:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, taskData) {
    try {
      const params = {
        records: [{
          Id: id,
          Title_c: taskData.title,
          Description_c: taskData.description,
          DueDate_c: taskData.dueDate,
          Priority_c: taskData.priority,
          Completed_c: taskData.completed !== undefined ? taskData.completed : false,
          FarmId_c: parseInt(taskData.farmId),
          CropId_c: taskData.cropId ? parseInt(taskData.cropId) : null
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
          console.error(`Failed to update ${failed.length} tasks:`, failed);
          throw new Error(failed[0].message || "Failed to update task");
        }
        
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error updating task:", error?.response?.data?.message || error);
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
          console.error(`Failed to delete ${failed.length} tasks:`, failed);
          throw new Error(failed[0].message || "Failed to delete task");
        }
        
        return true;
      }
    } catch (error) {
      console.error("Error deleting task:", error?.response?.data?.message || error);
      throw error;
    }
  }
}

export const taskService = new TaskService();
export const taskService = new TaskService();