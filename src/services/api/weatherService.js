import weatherData from "../mockData/weather.json";

class WeatherService {
  async getCurrent() {
    await this.delay();
    return { ...weatherData.current };
  }

  async getForecast() {
    await this.delay();
    return [...weatherData.forecast];
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 200));
  }
}

export const weatherService = new WeatherService();