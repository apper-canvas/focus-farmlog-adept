import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import WeatherCard from "@/components/molecules/WeatherCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { weatherService } from "@/services/api/weatherService";

const Weather = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadWeatherData();
  }, []);

  const loadWeatherData = async () => {
    try {
      setLoading(true);
      setError("");
      const [current, forecastData] = await Promise.all([
        weatherService.getCurrent(),
        weatherService.getForecast()
      ]);
      setCurrentWeather(current);
      setForecast(forecastData);
    } catch (err) {
      setError("Failed to load weather data");
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition) => {
    const icons = {
      "sunny": "Sun",
      "cloudy": "Cloud",
      "rainy": "CloudRain",
      "snowy": "Snowflake",
      "stormy": "Zap",
      "clear": "Sun",
      "overcast": "CloudDrizzle"
    };
    return icons[condition.toLowerCase()] || "Sun";
  };

  const getWeatherGradient = (condition) => {
    const gradients = {
      "sunny": "from-yellow-400 to-orange-500",
      "cloudy": "from-gray-400 to-gray-600",
      "rainy": "from-blue-400 to-blue-600",
      "snowy": "from-blue-200 to-blue-400",
      "stormy": "from-purple-500 to-blue-600",
      "clear": "from-blue-400 to-blue-600",
      "overcast": "from-gray-500 to-gray-700"
    };
    return gradients[condition.toLowerCase()] || "from-blue-400 to-blue-600";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      weekday: "short",
      month: "short",
      day: "numeric"
    });
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadWeatherData} />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-3xl bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
          Weather Forecast
        </h1>
        <div className="flex items-center space-x-2 text-gray-600">
          <ApperIcon name="MapPin" size={16} />
          <span className="font-medium">Farm Location</span>
        </div>
      </div>

      {/* Current Weather */}
      {currentWeather && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 p-8" gradient>
            <div className="text-center">
              <h2 className="font-display font-semibold text-xl text-gray-900 mb-6">
                Current Weather
              </h2>
              <div className={`bg-gradient-to-br ${getWeatherGradient(currentWeather.condition)} p-6 rounded-2xl inline-block mb-6`}>
                <ApperIcon 
                  name={getWeatherIcon(currentWeather.condition)} 
                  size={64} 
                  className="text-white" 
                />
              </div>
              <h3 className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent mb-2">
                {currentWeather.temperature}°F
              </h3>
              <p className="text-gray-600 font-medium capitalize text-lg mb-6">
                {currentWeather.condition}
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                  <ApperIcon name="Droplets" size={24} className="text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-700">{currentWeather.humidity}%</p>
                  <p className="text-blue-600 font-medium">Humidity</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                  <ApperIcon name="CloudRain" size={24} className="text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-700">{currentWeather.precipitation}"</p>
                  <p className="text-green-600 font-medium">Rain</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Weather Insights */}
          <Card className="lg:col-span-2 p-6" gradient>
            <h2 className="font-display font-semibold text-xl text-gray-900 mb-6">
              Farming Insights
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 p-2 rounded-lg">
                    <ApperIcon name="Sprout" size={20} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-green-800">Growing Conditions</h3>
                </div>
                <p className="text-green-700 mb-2">
                  {currentWeather.temperature > 70 && currentWeather.temperature < 85 
                    ? "Excellent growing conditions for most crops"
                    : currentWeather.temperature > 85 
                      ? "Hot conditions - ensure adequate irrigation"
                      : "Cool conditions - monitor sensitive crops"
                  }
                </p>
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Thermometer" size={16} className="text-green-600" />
                  <span className="text-green-600 text-sm">Optimal range: 70-85°F</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-lg">
                    <ApperIcon name="Droplets" size={20} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-blue-800">Irrigation Needs</h3>
                </div>
                <p className="text-blue-700 mb-2">
                  {currentWeather.precipitation > 0.1 
                    ? "Recent rainfall - reduce irrigation schedule"
                    : currentWeather.humidity < 40 
                      ? "Low humidity - increase irrigation frequency"
                      : "Normal irrigation schedule recommended"
                  }
                </p>
                <div className="flex items-center space-x-2">
                  <ApperIcon name="CloudRain" size={16} className="text-blue-600" />
                  <span className="text-blue-600 text-sm">
                    {currentWeather.precipitation}" precipitation today
                  </span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-2 rounded-lg">
                    <ApperIcon name="AlertTriangle" size={20} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-yellow-800">Field Work</h3>
                </div>
                <p className="text-yellow-700 mb-2">
                  {currentWeather.condition.toLowerCase().includes("rain") || currentWeather.condition.toLowerCase().includes("storm")
                    ? "Avoid field work - muddy conditions"
                    : currentWeather.condition.toLowerCase().includes("sunny") || currentWeather.condition.toLowerCase().includes("clear")
                      ? "Excellent conditions for field operations"
                      : "Check soil conditions before heavy machinery use"
                  }
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-2 rounded-lg">
                    <ApperIcon name="Bug" size={20} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-purple-800">Pest Control</h3>
                </div>
                <p className="text-purple-700 mb-2">
                  {currentWeather.humidity > 70 && currentWeather.temperature > 75
                    ? "High humidity & temperature - monitor for pest activity"
                    : "Normal pest monitoring schedule recommended"
                  }
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* 5-Day Forecast */}
      <Card className="p-6" gradient>
        <h2 className="font-display font-semibold text-xl text-gray-900 mb-6">
          5-Day Forecast
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {forecast.map((day, index) => (
            <div key={index} className="text-center p-4 bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <h3 className="font-semibold text-gray-900 mb-2">
                {formatDate(day.date)}
              </h3>
              
              <div className={`bg-gradient-to-br ${getWeatherGradient(day.condition)} p-3 rounded-full inline-block mb-3`}>
                <ApperIcon 
                  name={getWeatherIcon(day.condition)} 
                  size={32} 
                  className="text-white" 
                />
              </div>
              
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {day.temperature}°F
              </p>
              
              <p className="text-gray-600 capitalize text-sm mb-3">
                {day.condition}
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-1">
                  <ApperIcon name="Droplets" size={12} className="text-blue-500" />
                  <span className="text-xs text-gray-600">{day.humidity}%</span>
                </div>
                
                <div className="flex items-center justify-center space-x-1">
                  <ApperIcon name="CloudRain" size={12} className="text-green-500" />
                  <span className="text-xs text-gray-600">{day.precipitation}"</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Weather;