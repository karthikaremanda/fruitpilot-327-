import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface Telemetry {
  latitude: number;
  longitude: number;
  altitude: number;
  yaw: number;
  pitch: number;
  roll: number;
  speed: number;
}

const TelemetryPanel: React.FC<{ telemetry: Telemetry | null }> = ({ telemetry }) => (
  <div className="fixed top-20 right-4 bg-white/90 rounded-lg shadow-lg p-4 w-72 z-[1000]">
    <h2 className="text-lg font-semibold mb-2">Drone Telemetry</h2>
    {telemetry ? (
      <ul className="text-sm space-y-1">
        <li><b>Latitude:</b> {telemetry.latitude.toFixed(6)}</li>
        <li><b>Longitude:</b> {telemetry.longitude.toFixed(6)}</li>
        <li><b>Altitude:</b> {telemetry.altitude.toFixed(2)} m</li>
        <li><b>Yaw:</b> {telemetry.yaw.toFixed(2)}°</li>
        <li><b>Pitch:</b> {telemetry.pitch.toFixed(2)}°</li>
        <li><b>Roll:</b> {telemetry.roll.toFixed(2)}°</li>
        <li><b>Speed:</b> {telemetry.speed.toFixed(2)} m/s</li>
      </ul>
    ) : (
      <div>Waiting for telemetry...</div>
    )}
  </div>
);

const LocationMarker: React.FC<{ onSelect: (lat: number, lng: number) => void }> = ({ onSelect }) => {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const GeoMapPage: React.FC = () => {
  const [selectedPosition, setSelectedPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [telemetry, setTelemetry] = useState<Telemetry | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws/telemetry");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setTelemetry(data);
    };
    wsRef.current = ws;
    return () => ws.close();
  }, []);

  return (
    <div className="h-[calc(100vh-64px)] w-full relative">
      <MapContainer
        center={[28.7041, 77.1025]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker onSelect={(lat, lng) => setSelectedPosition({ lat, lng })} />
        {selectedPosition && (
          <Marker position={[selectedPosition.lat, selectedPosition.lng]} />
        )}
        {telemetry && (
          <Marker position={[telemetry.latitude, telemetry.longitude]} />
        )}
      </MapContainer>
      <TelemetryPanel telemetry={telemetry} />
      <div className="absolute bottom-4 left-4 bg-white/90 rounded shadow px-4 py-2">
        {selectedPosition ? (
          <span>
            <b>Selected:</b> {selectedPosition.lat.toFixed(6)}, {selectedPosition.lng.toFixed(6)}
          </span>
        ) : (
          <span>Click on the map to select a location.</span>
        )}
      </div>
    </div>
  );
};

export default GeoMapPage;
