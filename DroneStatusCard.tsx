import React from 'react';
import { DroneStatus } from '../types';
import { Battery, Signal, Navigation, Gauge } from 'lucide-react';

interface DroneStatusCardProps {
  droneStatus: DroneStatus;
}

const DroneStatusCard: React.FC<DroneStatusCardProps> = ({ droneStatus }) => {
  // Helper function to determine the battery color based on level
  const getBatteryColor = (level: number) => {
    if (level > 70) return 'text-green-500';
    if (level > 30) return 'text-amber-500';
    return 'text-white-500';
  };

  // Helper function to determine status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'idle': return 'bg-blue-500';
      case 'charging': return 'bg-amber-500';
      case 'maintenance': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Drone Status</h3>
          <div className="flex items-center">
            <span className={`h-2.5 w-2.5 rounded-full ${getStatusColor(droneStatus.status)} mr-2`}></span>
            <span className="text-sm capitalize">{droneStatus.status}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <Battery className={`h-5 w-5 mr-2 ${getBatteryColor(droneStatus.batteryLevel)}`} />
            <div>
              <p className="text-xs text-gray-500">Battery</p>
              <p className="font-medium">{droneStatus.batteryLevel}%</p>
            </div>
          </div>

          <div className="flex items-center">
            <Signal className="h-5 w-5 mr-2 text-blue-500" />
            <div>
              <p className="text-xs text-gray-500">Signal</p>
              <p className="font-medium">{droneStatus.signalStrength}%</p>
            </div>
          </div>

          <div className="flex items-center">
            <Navigation className="h-5 w-5 mr-2 text-indigo-500" />
            <div>
              <p className="text-xs text-gray-500">Altitude</p>
              <p className="font-medium">{droneStatus.altitude}m</p>
            </div>
          </div>

          <div className="flex items-center">
            <Gauge className="h-5 w-5 mr-2 text-purple-500" />
            <div>
              <p className="text-xs text-gray-500">Speed</p>
              <p className="font-medium">{droneStatus.speed} m/s</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-3 bg-gray-50">
        <div className="text-sm">
          <span className="text-gray-500">Last Maintenance:</span>
          <span className="ml-2 text-gray-700">{droneStatus.lastMaintenance}</span>
        </div>
      </div>
    </div>
  );
};

export default DroneStatusCard;