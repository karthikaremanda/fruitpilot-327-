from dronekit import connect, VehicleMode, LocationGlobalRelative
import time

# Connect to the drone
print("Connecting to vehicle...")
vehicle = connect("172.31.160.1:14550", wait_ready=True)

if vehicle is None:
    print("Failed to connect to vehicle. Exiting...")
    exit()

def arm_and_takeoff(altitude):
    """ Arms vehicle and takes off to a specified altitude. """
    print("Performing preflight checks...")
    while not vehicle.is_armable:
        print("Waiting for vehicle to initialize...")
        time.sleep(2)

    print("Arming motors...")
    vehicle.mode = VehicleMode("GUIDED")
    vehicle.armed = True

    while not vehicle.armed:
        print("Waiting for arming...")
        time.sleep(2)

    print(f"Taking off to {altitude} meters...")
    vehicle.simple_takeoff(altitude)

    while True:
        print(f"Altitude: {vehicle.location.global_relative_frame.alt:.2f}m")
        if vehicle.location.global_relative_frame.alt >= altitude * 0.95:
            print("Target altitude reached!")
            break
        time.sleep(1)

# Mission waypoints
mission = [
    LocationGlobalRelative(-35.362938, 149.165085, 10),
    LocationGlobalRelative(-35.363838, 149.166085, 10),
    LocationGlobalRelative(-35.364938, 149.167085, 10)
]

# Start mission
arm_and_takeoff(10)

for wp in mission:
    print(f"Going to {wp.lat}, {wp.lon}, Alt: {wp.alt}")
    vehicle.simple_goto(wp)
    time.sleep(10)

print("Mission Complete. Landing...")
vehicle.mode = VehicleMode("LAND")

# Close vehicle connection
vehicle.close()
print("Vehicle disconnected.")




# from flask import Flask, jsonify, send_file
# from dronekit import connect, VehicleMode, LocationGlobalRelative, APIException
# import threading
# import time
# import socket
# import os

# app = Flask(__name__)

# # Store mission state
# mission_state = {
#     "current_waypoint": 0,
#     "mission_running": False,
#     "mission_complete": False,
#     "connection_status": "Disconnected"
# }

# # Vehicle object
# vehicle = None

# def connect_vehicle():
#     global vehicle, mission_state
#     mission_state["connection_status"] = "Connecting..."
    
#     # Connection parameters - UPDATED based on your SITL setup
#     # Using UDP connection directly to MAVProxy's output
#     connection_string = "udp:127.0.0.1:14550"
#     # Alternative: Try TCP connection to SITL directly
#     # connection_string = "tcp:127.0.0.1:5760"
    
#     try:
#         # Set a shorter timeout for the connection
#         print(f"Connecting to vehicle on: {connection_string}")
#         vehicle = connect(connection_string, wait_ready=True, 
#                           heartbeat_timeout=30, timeout=60)
#         mission_state["connection_status"] = "Connected"
#         print("Vehicle connected successfully!")
#         return True
#     except socket.error as e:
#         print(f"Socket error occurred: {e}")
#         mission_state["connection_status"] = f"Connection failed: Socket error - {e}"
#     except APIException as e:
#         print(f"API exception: {e}")
#         mission_state["connection_status"] = f"Connection failed: API error - {e}"
#     except Exception as e:
#         print(f"Connection failed: {e}")
#         mission_state["connection_status"] = f"Connection failed: {e}"
    
#     return False

# # Try to connect in a separate thread to not block the server startup
# def background_connect():
#     connect_vehicle()

# connect_thread = threading.Thread(target=background_connect)
# connect_thread.daemon = True
# connect_thread.start()

# # Define mission waypoints
# mission = [
#     LocationGlobalRelative(-35.362938, 149.165085, 10),
#     LocationGlobalRelative(-35.363838, 149.166085, 10),
#     LocationGlobalRelative(-35.364938, 149.167085, 10)
# ]

# def arm_and_takeoff(altitude):
#     global vehicle, mission_state
    
#     if not vehicle:
#         mission_state["connection_status"] = "Not connected to vehicle"
#         return False
    
#     try:
#         print("Basic pre-arm checks")
#         # Don't arm until autopilot is ready
#         print("Waiting for vehicle to initialize...")
#         while not vehicle.is_armable:
#             print(f"Not armable yet, mode: {vehicle.mode.name}, system status: {vehicle.system_status.state}")
#             time.sleep(1)
            
#         print("Arming motors")
#         # Copter should arm in GUIDED mode
#         vehicle.mode = VehicleMode("GUIDED")
#         time.sleep(1)
#         vehicle.armed = True

#         # Confirm vehicle armed before attempting to take off
#         attempts = 0
#         while not vehicle.armed and attempts < 20:
#             print("Waiting for arming...")
#             time.sleep(1)
#             attempts += 1
#             vehicle.armed = True
            
#         if not vehicle.armed:
#             print("Failed to arm vehicle")
#             mission_state["connection_status"] = "Failed to arm vehicle"
#             return False
            
#         print("Taking off!")
#         vehicle.simple_takeoff(altitude)  # Take off to target altitude

#         # Wait until the vehicle reaches a safe height before processing the next command
#         # (otherwise the command after Vehicle.simple_takeoff will execute immediately)
#         while True:
#             current_altitude = vehicle.location.global_relative_frame.alt
#             print(f"Altitude: {current_altitude}")
#             if current_altitude >= altitude * 0.95:  # Trigger just below target alt
#                 print("Reached target altitude")
#                 break
#             time.sleep(1)
        
#         return True
#     except Exception as e:
#         print(f"Error during takeoff: {e}")
#         mission_state["connection_status"] = f"Takeoff error: {e}"
#         return False

# def run_mission():
#     global mission_state, vehicle
    
#     if not vehicle:
#         mission_state["mission_running"] = False
#         mission_state["connection_status"] = "Vehicle not connected"
#         return
    
#     try:
#         # Arm and take off to 10 meters
#         if not arm_and_takeoff(10):
#             mission_state["mission_running"] = False
#             return
        
#         # Execute mission
#         for i, wp in enumerate(mission):
#             if not vehicle or not vehicle.armed:
#                 mission_state["connection_status"] = "Lost connection during mission"
#                 mission_state["mission_running"] = False
#                 return
                
#             mission_state["current_waypoint"] = i + 1
#             print(f"Going to waypoint {i+1}: {wp}")
#             vehicle.simple_goto(wp)
            
#             # Wait until we reach the waypoint
#             start_time = time.time()
#             while time.time() - start_time < 30:  # Maximum 30 seconds timeout
#                 # Break if we're close enough to the waypoint
#                 if not vehicle:
#                     break
                    
#                 current_location = vehicle.location.global_relative_frame
#                 distance = get_distance_metres(current_location, wp)
#                 print(f"Distance to waypoint: {distance} meters")
#                 if distance < 3.0:  # Within 3 meters
#                     print(f"Reached waypoint {i+1}")
#                     time.sleep(2)  # Hover briefly
#                     break
#                 time.sleep(1)
        
#         # Land after mission completion
#         print("Mission Complete. Landing...")
#         if vehicle:
#             vehicle.mode = VehicleMode("LAND")
            
#         mission_state["mission_complete"] = True
#         mission_state["mission_running"] = False
#         mission_state["connection_status"] = "Mission completed"
    
#     except Exception as e:
#         print(f"Error during mission: {e}")
#         mission_state["connection_status"] = f"Mission error: {e}"
#         mission_state["mission_running"] = False

# def get_distance_metres(location1, location2):
#     """
#     Simple function to calculate distance between two waypoints
#     """
#     import math
    
#     # Approximation for small distances
#     dlat = location2.lat - location1.lat
#     dlong = location2.lon - location1.lon
    
#     # Simple pythagorean approximation for small distances
#     return math.sqrt((dlat*dlat) + (dlong*dlong)) * 1.113195e5

# @app.route('/')
# def index():
#     return send_file('index.html')

# @app.route('/drone_data')
# def drone_data():
#     if not vehicle:
#         # Return dummy data if vehicle not connected
#         return jsonify({
#             "yaw": 0.0,
#             "altitude": 0.0,
#             "flight_mode": "NOT CONNECTED",
#             "connection_status": mission_state["connection_status"]
#         })
    
#     try:
#         # Return actual vehicle data
#         return jsonify({
#             "yaw": vehicle.attitude.yaw if hasattr(vehicle, 'attitude') and vehicle.attitude is not None else 0.0,
#             "altitude": vehicle.location.global_relative_frame.alt if hasattr(vehicle.location, 'global_relative_frame') else 0.0,
#             "flight_mode": vehicle.mode.name if hasattr(vehicle, 'mode') else "UNKNOWN",
#             "connection_status": mission_state["connection_status"]
#         })
#     except Exception as e:
#         print(f"Error getting drone data: {e}")
#         return jsonify({
#             "yaw": 0.0,
#             "altitude": 0.0,
#             "flight_mode": "ERROR",
#             "connection_status": f"Error: {e}"
#         })

# @app.route('/mission_status')
# def mission_status():
#     return jsonify({
#         "current_waypoint": f"{mission_state['current_waypoint']}/{len(mission)}" if mission_state["mission_running"] else "Not started" if not mission_state["mission_complete"] else "Complete",
#         "connection_status": mission_state["connection_status"]
#     })

# @app.route('/start_mission')
# def start_mission():
#     global vehicle, mission_state
    
#     if mission_state["mission_running"]:
#         return jsonify({"message": "Mission already in progress!"})
    
#     if not vehicle:
#         # Try to reconnect
#         if not connect_vehicle():
#             return jsonify({"message": f"Failed to connect to vehicle: {mission_state['connection_status']}"})
    
#     mission_state["mission_running"] = True
#     mission_state["mission_complete"] = False
#     mission_state["current_waypoint"] = 0
#     mission_state["connection_status"] = "Mission starting"
    
#     # Start mission in a separate thread to avoid blocking
#     mission_thread = threading.Thread(target=run_mission)
#     mission_thread.daemon = True
#     mission_thread.start()
    
#     return jsonify({"message": "Mission started!"})

# @app.route('/reconnect')
# def reconnect():
#     if connect_vehicle():
#         return jsonify({"message": "Reconnected successfully!"})
#     else:
#         return jsonify({"message": f"Reconnection failed: {mission_state['connection_status']}"})

# if __name__ == '__main__':
#     # Run the Flask app
#     app.run(host='0.0.0.0', port=5000, debug=True)