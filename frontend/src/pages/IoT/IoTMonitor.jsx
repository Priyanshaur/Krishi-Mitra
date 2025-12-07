import React, { useState, useEffect } from 'react';
import {
    Thermometer,
    Droplets,
    Sun,
    Activity,
    RefreshCw,
    AlertTriangle,
    CheckCircle
} from 'lucide-react';
import Button from '../../components/ui/Button';

const IoTMonitor = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5001/data');
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const jsonData = await response.json();
            setData(jsonData);
            setLastUpdated(new Date());
            setError(null);
        } catch (err) {
            console.error("Error fetching IoT data:", err);
            setError("Could not connect to IoT Sensor. Ensure the device is active.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000); // Poll every 5 seconds
        return () => clearInterval(interval);
    }, []);

    // Helper to interpret soil moisture
    const getSoilStatus = (value) => {
        // 4095 -> Dry (0%), 0 -> Wet (100%)
        const percentage = Math.round(((4095 - value) / 4095) * 100);

        if (percentage < 30) return { status: 'Dry', percentage, color: 'text-red-600', bg: 'bg-red-100' };
        if (percentage < 70) return { status: 'Moist', percentage, color: 'text-green-600', bg: 'bg-green-100' };
        return { status: 'Wet', percentage, color: 'text-blue-600', bg: 'bg-blue-100' };
    };

    // Helper to interpret light intensity
    const getLightStatus = (value) => {
        // 0 -> Dark (0%), 4095 -> Bright (100%)
        const percentage = Math.round((value / 4095) * 100);
        return { percentage };
    };

    if (loading && !data && !error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <RefreshCw className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
                    <p className="text-gray-600">Connecting to IoT Sensors...</p>
                </div>
            </div>
        );
    }

    const soilInfo = data ? getSoilStatus(data.soil) : { status: 'Unknown', percentage: 0, color: 'text-gray-600', bg: 'bg-gray-100' };
    const lightInfo = data ? getLightStatus(data.light) : { percentage: 0 };

    return (
        <div className="space-y-6 fade-in">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-400/20 rounded-full -ml-10 -mb-10 blur-2xl"></div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 flex items-center">
                            <Activity className="mr-3 h-8 w-8" />
                            IoT Sensor Monitor
                        </h1>
                        <p className="text-blue-100 text-lg max-w-xl">
                            Real-time environmental data from your field sensors.
                        </p>
                        {lastUpdated && (
                            <p className="text-xs text-blue-200 mt-2">
                                Last updated: {lastUpdated.toLocaleTimeString()}
                            </p>
                        )}
                    </div>
                    <Button
                        variant="outline"
                        size="small"
                        onClick={fetchData}
                        className="mt-4 md:mt-0 bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transition-all duration-300"
                    >
                        <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh Now
                    </Button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm">
                    <div className="flex items-center">
                        <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
                        <p className="text-red-700 font-medium">{error}</p>
                    </div>
                </div>
            )}

            {/* Sensor Cards */}
            {data && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Temperature */}
                    <div className="glass p-6 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg">
                                <Thermometer className="h-6 w-6" />
                            </div>
                            <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-full border border-orange-100">
                                {data.temperature}°C
                            </span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Temperature</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{data.temperature}°C</p>
                            <p className="text-xs text-gray-400 mt-2">Optimal: 20-30°C</p>
                        </div>
                    </div>

                    {/* Humidity */}
                    <div className="glass p-6 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" style={{ animationDelay: '0.1s' }}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-lg">
                                <Droplets className="h-6 w-6" />
                            </div>
                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full border border-blue-100">
                                {data.humidity}%
                            </span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Humidity</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{data.humidity}%</p>
                            <p className="text-xs text-gray-400 mt-2">Optimal: 50-70%</p>
                        </div>
                    </div>

                    {/* Soil Moisture */}
                    <div className="glass p-6 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" style={{ animationDelay: '0.2s' }}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg">
                                <Activity className="h-6 w-6" />
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full border ${soilInfo.color} ${soilInfo.bg} border-current opacity-80`}>
                                {soilInfo.status}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Soil Moisture</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{soilInfo.percentage}%</p>
                            <p className="text-xs text-gray-400 mt-2">Status: {soilInfo.status}</p>
                        </div>
                    </div>

                    {/* Light */}
                    <div className="glass p-6 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" style={{ animationDelay: '0.3s' }}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-400 text-white shadow-lg">
                                <Sun className="h-6 w-6" />
                            </div>
                            <span className="text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full border border-yellow-100">
                                {lightInfo.percentage}%
                            </span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Light Intensity</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{lightInfo.percentage}%</p>
                            <p className="text-xs text-gray-400 mt-2">Status: {lightInfo.percentage > 50 ? 'Bright' : 'Dim'}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IoTMonitor;
