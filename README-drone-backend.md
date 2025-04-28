# Drone Backend (FastAPI)

## Setup

1. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # or venv\Scripts\activate on Windows
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the backend server:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

## API Endpoints
- **WebSocket:** `/ws/telemetry` (live drone data)
- **REST:** `/api/telemetry` (single snapshot)

## Real DroneKit
- Edit the connection string in `main.py` if your drone is not at `127.0.0.1:14550`.
