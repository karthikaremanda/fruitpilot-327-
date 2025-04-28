# DroneKit + Geo Map Integration Guide

## 1. Backend (Python + FastAPI)
- Folder: `drone-backend/`
- Provides WebSocket `/ws/telemetry` and REST `/api/telemetry` endpoints for drone telemetry.
- Simulates telemetry by default; uncomment DroneKit lines for real drone integration.
- See `drone-backend/README.md` for setup instructions.

## 2. Frontend (React)
- Uses React Router for navigation.
- New page: `GeoMapPage` (at `/map`), uses [react-leaflet](https://react-leaflet.js.org/) for interactive map.
- Click on the map to select a location; live drone telemetry is displayed in a panel.
- Navbar updated to include a "Map" button.

## 3. Required Frontend Packages
- Install with:
  ```bash
  npm install react-leaflet leaflet react-router-dom
  npm install --save-dev @types/leaflet @types/react-router-dom
  ```
- If using Yarn:
  ```bash
  yarn add react-leaflet leaflet react-router-dom
  yarn add --dev @types/leaflet @types/react-router-dom
  ```

## 4. Run Everything
- Start backend: see `drone-backend/README.md`.
- Start frontend as usual (`npm run dev`).
- Visit `/map` to access the geo map and live telemetry.
