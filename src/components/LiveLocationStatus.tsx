"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, TrendingUp, Users, Clock, Wifi, WifiOff } from "lucide-react";

interface LocationData {
  area_name: string;
  foot_traffic_score: number;
  overall_score: number;
  updated_at: string;
  is_live: boolean;
  status: string;
}

export default function LiveLocationStatus() {
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchLiveData = async () => {
    try {
      const response = await fetch("/api/collect-data");
      if (!response.ok) throw new Error("Failed to fetch");
      
      const data = await response.json();
      if (data.success) {
        setLocations(data.data);
        setLastUpdated(new Date(data.timestamp));
      }
    } catch (err) {
      setError("Unable to fetch live data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveData();
    // Refresh every 5 minutes
    const interval = setInterval(fetchLiveData, 300000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "busy": return "text-red-500 bg-red-50";
      case "moderate": return "text-yellow-500 bg-yellow-50";
      case "quiet": return "text-green-500 bg-green-50";
      default: return "text-gray-500 bg-gray-50";
    }
  };

  const getTrafficIcon = (score: number) => {
    if (score >= 70) return <Users className="w-4 h-4" />;
    if (score >= 40) return <Users className="w-4 h-4" />;
    return <Users className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-gray-600">Loading live data...</span>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center gap-2 text-red-500">
          <WifiOff className="w-5 h-5" />
          <span className="text-sm font-medium">Live data unavailable</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Live Location Intelligence</h3>
            <p className="text-xs text-gray-500">
              Updated {Math.floor((Date.now() - lastUpdated.getTime()) / 60000)} mins ago
            </p>
          </div>
        </div>
        <Wifi className="w-5 h-5 text-green-500" />
      </div>

      {/* Location Cards */}
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {locations.slice(0, 5).map((location, index) => (
          <motion.div
            key={location.area_name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${getStatusColor(location.status)}`}>
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{location.area_name}</h4>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    {getTrafficIcon(location.foot_traffic_score)}
                    {location.foot_traffic_score}% traffic
                  </span>
                  <span>•</span>
                  <span className={`capitalize ${location.is_live ? 'text-green-600' : 'text-gray-400'}`}>
                    {location.is_live ? 'Live' : 'Cached'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center gap-1 text-sm font-semibold text-gray-900">
                <TrendingUp className="w-4 h-4" />
                {location.overall_score}/100
              </div>
              <div className="text-xs text-gray-500">Match Score</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Auto-refreshes every 5 mins
          </span>
          <span>Data: OpenStreetMap + Live Analytics</span>
        </div>
      </div>
    </motion.div>
  );
}
