import React, { useEffect, useState } from 'react';
import { iotAPI } from '../../services/api';
import { Thermometer, Droplets, Sun, Activity, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';

const SensorCard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const result = await iotAPI.getSensorData();
      setData(result);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching sensor data", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Poll every 5 seconds for live updates
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="text-center p-4">Loading Sensor Data...</div>;
  if (!data) return <div className="text-center p-4">No Sensor Data Available</div>;

  return (
    <Card className="mb-6 border-green-200 bg-gradient-to-br from-white to-green-50">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg text-green-900 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-green-600" /> 
            Live Field Conditions
          </h3>
          <span className="text-xs text-gray-500 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
            Live
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Temperature */}
          <div className="text-center p-3 bg-white rounded-xl shadow-sm border border-gray-100">
            <Thermometer className="mx-auto text-red-500 mb-2 h-6 w-6" />
            <p className="text-gray-500 text-xs uppercase font-semibold">Temp</p>
            <p className="text-xl font-bold text-gray-800">{data.temperature}°C</p>
          </div>

          {/* Humidity */}
          <div className="text-center p-3 bg-white rounded-xl shadow-sm border border-gray-100">
            <Droplets className="mx-auto text-blue-500 mb-2 h-6 w-6" />
            <p className="text-gray-500 text-xs uppercase font-semibold">Humidity</p>
            <p className="text-xl font-bold text-gray-800">{data.humidity}%</p>
          </div>

          {/* Soil Moisture */}
          <div className="text-center p-3 bg-white rounded-xl shadow-sm border border-gray-100">
            <Activity className="mx-auto text-green-600 mb-2 h-6 w-6" />
            <p className="text-gray-500 text-xs uppercase font-semibold">Soil Moisture</p>
            <p className="text-xl font-bold text-gray-800">{data.soilPercentage}%</p>
            <p className="text-[10px] text-gray-400">
              {data.soilPercentage < 30 ? 'Low (Water Now)' : data.soilPercentage > 80 ? 'High' : 'Optimal'}
            </p>
          </div>

          {/* Light */}
          <div className="text-center p-3 bg-white rounded-xl shadow-sm border border-gray-100">
            <Sun className="mx-auto text-yellow-500 mb-2 h-6 w-6" />
            <p className="text-gray-500 text-xs uppercase font-semibold">Light</p>
            <p className="text-xl font-bold text-gray-800">{data.light}</p>
          </div>
        </div>
        
        <div className="mt-4 text-center">
           <p className="text-xs text-gray-400">Last updated: {data.timestamp ? new Date(data.timestamp).toLocaleTimeString() : 'Never'}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SensorCard;