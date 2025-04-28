export interface Fruit {
  id: string;
  name: string;
  quantity: number;
  date: string;
  quality: 'excellent' | 'good' | 'average' | 'poor';
  location: string;
  imageUrl: string;
}

export interface DroneStatus {
  id: string;
  batteryLevel: number;
  signalStrength: number;
  altitude: number;
  speed: number;
  location: {
    latitude: number;
    longitude: number;
  };
  status: 'active' | 'idle' | 'charging' | 'maintenance';
  lastMaintenance: string;
}

export interface ProjectInfo {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

export interface PluckingStat {
  date: string;
  apples: number;
  oranges: number;
  peaches: number;
}

export interface DroneCamera {
  id: string;
  name: string;
  isActive: boolean;
  resolution: string;
  frameRate: number;
  zoomLevel: number;
}