import React, { useState } from 'react';
import { DroneCamera as DroneCameraType } from '../types';
import { 
  Play, Pause, ZoomIn, ZoomOut, RotateCw, CameraOff, 
  Maximize, Camera, RefreshCcw, Download 
} from 'lucide-react';

interface DroneCameraProps {
  cameras: DroneCameraType[];
}

const DroneCamera: React.FC<DroneCameraProps> = ({ cameras }) => {
  const [activeCamera, setActiveCamera] = useState<DroneCameraType>(
    cameras.find(camera => camera.isActive) || cameras[0]
  );
  const [isPlaying, setIsPlaying] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(activeCamera.zoomLevel);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleCameraChange = (camera: DroneCameraType) => {
    setActiveCamera(camera);
    setZoomLevel(camera.zoomLevel);
  };

  const handleZoomIn = () => {
    if (zoomLevel < 3) {
      setZoomLevel(prevZoom => prevZoom + 0.5);
    }
  };

  const handleZoomOut = () => {
    if (zoomLevel > 0.5) {
      setZoomLevel(prevZoom => prevZoom - 0.5);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="relative">
        {/* Camera Feed (Using placeholder) */}
        <div 
          className="relative bg-gray-900 w-full h-0 pb-[56.25%] overflow-hidden"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {isPlaying ? (
            <img 
              src="https://images.pexels.com/photos/2286265/pexels-photo-2286265.jpeg" 
              alt="Drone camera feed" 
              className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <CameraOff className="h-16 w-16 text-gray-400" />
              <p className="absolute mt-24 text-gray-400">Camera feed paused</p>
            </div>
          )}

          {/* Camera Info Overlay */}
          <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-lg text-sm backdrop-blur-sm">
            <div className="flex items-center">
              <Camera className="h-4 w-4 mr-2" />
              <span>{activeCamera.name}</span>
            </div>
          </div>

          {/* Recording Indicator */}
          <div className="absolute top-4 right-4 flex items-center bg-black/50 px-3 py-1 rounded-lg backdrop-blur-sm">
            <span className="h-2 w-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
            <span className="text-white text-sm">LIVE</span>
          </div>

          {/* Resolution Info */}
          <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-lg text-xs backdrop-blur-sm">
            {activeCamera.resolution} • {activeCamera.frameRate}fps • {zoomLevel.toFixed(1)}x
          </div>
        </div>

        {/* Camera Controls */}
        <div className="absolute bottom-4 right-4 flex items-center space-x-2">
          <button 
            className="p-2 bg-black/50 text-white rounded-full backdrop-blur-sm hover:bg-black/70 transition-colors"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </button>
          <button 
            className="p-2 bg-black/50 text-white rounded-full backdrop-blur-sm hover:bg-black/70 transition-colors"
            onClick={handleZoomIn}
          >
            <ZoomIn className="h-5 w-5" />
          </button>
          <button 
            className="p-2 bg-black/50 text-white rounded-full backdrop-blur-sm hover:bg-black/70 transition-colors"
            onClick={handleZoomOut}
          >
            <ZoomOut className="h-5 w-5" />
          </button>
          <button 
            className="p-2 bg-black/50 text-white rounded-full backdrop-blur-sm hover:bg-black/70 transition-colors"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            <Maximize className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="p-4 border-t border-gray-100">
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex space-x-3 mb-2 sm:mb-0">
            {cameras.map(camera => (
              <button
                key={camera.id}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  activeCamera.id === camera.id
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => handleCameraChange(camera)}
              >
                {camera.name}
              </button>
            ))}
          </div>
          
          <div className="flex space-x-2">
            <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
              <RefreshCcw className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
              <RotateCw className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
              <Download className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DroneCamera;