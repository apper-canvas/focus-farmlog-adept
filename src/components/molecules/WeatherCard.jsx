import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const WeatherCard = ({ weather }) => {
  if (!weather) return null;

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

  return (
    <Card className="p-6" gradient>
      <div className="text-center">
        <div className={`bg-gradient-to-br ${getWeatherGradient(weather.condition)} p-4 rounded-full inline-block mb-4`}>
          <ApperIcon 
            name={getWeatherIcon(weather.condition)} 
            size={48} 
            className="text-white" 
          />
        </div>
        <h3 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent mb-1">
          {weather.temperature}°F
        </h3>
        <p className="text-gray-600 font-medium capitalize mb-4">{weather.condition}</p>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <ApperIcon name="Droplets" size={20} className="text-blue-500 mx-auto mb-1" />
            <p className="text-blue-700 font-semibold">{weather.humidity}%</p>
            <p className="text-gray-600">Humidity</p>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
            <ApperIcon name="CloudRain" size={20} className="text-green-500 mx-auto mb-1" />
            <p className="text-green-700 font-semibold">{weather.precipitation}"</p>
            <p className="text-gray-600">Rain</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WeatherCard;