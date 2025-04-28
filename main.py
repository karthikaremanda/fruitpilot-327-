from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import asyncio
from dronekit import connect, VehicleMode
vehicle = connect('127.0.0.1:14550', wait_ready=True)

app = FastAPI()

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Telemetry(BaseModel):
    latitude: float
    longitude: float
    altitude: float
    yaw: float
    pitch: float
    roll: float
    speed: float

# Use real DroneKit data
async def get_telemetry():
    while True:
        yield Telemetry(
            latitude=vehicle.location.global_relative_frame.lat,
            longitude=vehicle.location.global_relative_frame.lon,
            altitude=vehicle.location.global_relative_frame.alt,
            yaw=vehicle.attitude.yaw,
            pitch=vehicle.attitude.pitch,
            roll=vehicle.attitude.roll,
            speed=vehicle.groundspeed
        )
        await asyncio.sleep(1)

@app.websocket("/ws/telemetry")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    async for telemetry in get_telemetry():
        await websocket.send_json(telemetry.dict())

@app.get("/api/telemetry", response_model=Telemetry)
async def get_telemetry_once():
    return Telemetry(
        latitude=vehicle.location.global_relative_frame.lat,
        longitude=vehicle.location.global_relative_frame.lon,
        altitude=vehicle.location.global_relative_frame.alt,
        yaw=vehicle.attitude.yaw,
        pitch=vehicle.attitude.pitch,
        roll=vehicle.attitude.roll,
        speed=vehicle.groundspeed
    )
