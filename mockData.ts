import { Fruit, DroneStatus, ProjectInfo, PluckingStat, DroneCamera } from '../types';

export const fruits: Fruit[] = [
  {
    id: '1',
    name: 'Apple',
    quantity: 243,
    date: '2025-03-15',
    quality: 'excellent',
    location: 'Orchard A, Section 3',
    imageUrl: 'https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg'
  },
  {
    id: '2',
    name: 'Orange',
    quantity: 189,
    date: '2025-03-14',
    quality: 'good',
    location: 'Orchard B, Section 1',
    imageUrl: 'https://images.pexels.com/photos/5731224/pexels-photo-5731224.jpeg'
  },
  {
    id: '3',
    name: 'Peach',
    quantity: 127,
    date: '2025-03-12',
    quality: 'good',
    location: 'Orchard C, Section 2',
    imageUrl: 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg'
  },
  {
    id: '4',
    name: 'Apple',
    quantity: 156,
    date: '2025-03-10',
    quality: 'average',
    location: 'Orchard A, Section 5',
    imageUrl: 'https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg'
  },
  {
    id: '5',
    name: 'Orange',
    quantity: 201,
    date: '2025-03-09',
    quality: 'excellent',
    location: 'Orchard B, Section 4',
    imageUrl: 'https://images.pexels.com/photos/5731224/pexels-photo-5731224.jpeg'
  }
];

export const droneStatus: DroneStatus = {
  id: 'drone-001',
  batteryLevel: 78,
  signalStrength: 92,
  altitude: 4.5,
  speed: 3.2,
  location: {
    latitude: 37.7749,
    longitude: -122.4194
  },
  status: 'active',
  lastMaintenance: '2025-02-28'
};

export const projectInfo: ProjectInfo[] = [
  {
    id: 1,
    title: 'Precision Harvesting',
    description: 'Our drones use computer vision to identify ripe fruits with 99.2% accuracy, ensuring only the best quality produce is harvested.',
    imageUrl: 'https://images.pexels.com/photos/2050718/pexels-photo-2050718.jpeg'
  },
  {
    id: 2,
    title: 'Gentle Handling',
    description: 'Custom-designed grippers handle fruits with the same care as human pickers, preventing bruising and damage during collection.',
    imageUrl: 'https://images.pexels.com/photos/2284170/pexels-photo-2284170.jpeg'
  },
  {
    id: 3,
    title: 'Autonomous Navigation',
    description: 'Advanced GPS and LIDAR systems allow our drones to navigate complex orchard environments and adapt to changing conditions.',
    imageUrl: 'https://images.pexels.com/photos/358220/pexels-photo-358220.jpeg'
  },
  {
    id: 4,
    title: 'Data Analytics',
    description: 'Our platform provides real-time analytics on harvest yields, fruit quality, and orchard health to optimize farming operations.',
    imageUrl: 'https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg'
  }
];

export const pluckingStats: PluckingStat[] = [
  { date: 'Jan', apples: 450, oranges: 230, peaches: 180 },
  { date: 'Feb', apples: 520, oranges: 310, peaches: 220 },
  { date: 'Mar', apples: 600, oranges: 350, peaches: 280 },
  { date: 'Apr', apples: 580, oranges: 380, peaches: 310 },
  { date: 'May', apples: 550, oranges: 400, peaches: 350 },
  { date: 'Jun', apples: 690, oranges: 450, peaches: 390 },
  { date: 'Jul', apples: 750, oranges: 480, peaches: 420 }
];

export const droneCameras: DroneCamera[] = [
  {
    id: 'cam-1',
    name: 'Main Camera',
    isActive: true,
    resolution: '4K',
    frameRate: 30,
    zoomLevel: 1
  },
  {
    id: 'cam-2',
    name: 'Thermal Camera',
    isActive: false,
    resolution: '1080p',
    frameRate: 24,
    zoomLevel: 1
  },
  {
    id: 'cam-3',
    name: 'Rear Camera',
    isActive: false,
    resolution: '2K',
    frameRate: 60,
    zoomLevel: 1
  }
];