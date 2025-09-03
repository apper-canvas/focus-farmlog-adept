class WeatherService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'weather_c';
  }

  async getCurrent() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Temperature_c"}},
          {"field": {"Name": "Condition_c"}},
          {"field": {"Name": "Humidity_c"}},
          {"field": {"Name": "Precipitation_c"}},
          {"field": {"Name": "Date_c"}}
        ],
        orderBy: [{"fieldName": "Date_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 1, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.data?.[0] || null;
    } catch (error) {
      console.error("Error fetching current weather:", error?.response?.data?.message || error);
      return null;
    }
  }

  async getForecast() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Temperature_c"}},
          {"field": {"Name": "Condition_c"}},
          {"field": {"Name": "Humidity_c"}},
          {"field": {"Name": "Precipitation_c"}},
          {"field": {"Name": "Date_c"}}
        ],
        orderBy: [{"fieldName": "Date_c", "sorttype": "ASC"}],
        pagingInfo: {"limit": 7, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching weather forecast:", error?.response?.data?.message || error);
      return [];
    }
  }
}

export const weatherService = new WeatherService();