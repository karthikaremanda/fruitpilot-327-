# # from dronekit import connect

# # # Connect to SITL via UDP (port 14550)
# # vehicle = connect("udp:127.0.0.1:14550", wait_ready=True)

# # print("✅ Connected to vehicle!")
# # print("Mode:", vehicle.mode.name)
# # print("Altitude:", vehicle.location.global_relative_frame.alt)
# #172.31.160.1:14550
# # # Close the connection
# # vehicle.close()


from dronekit import connect, VehicleMode, LocationGlobalRelative
import time
import math
import threading
import keyboard  


CONNECTION_STRING = "172.31.160.1:14550"
DEFAULT_ALTITUDE = 10  # meters
MOVEMENT_STEP = 5      # meters
SPEED = 5              #
YAW_CHANGE = 10        

# Global variables
running = True
is_armed = False
drone_location = None

def clear_screen():
    """Clear the terminal screen"""
    print("\033[H\033[J", end="")  # ANSI escape sequence to clear screen

def print_status(vehicle):
    """Print the current status of the drone"""
    clear_screen()
    print("==== DRONE KEYBOARD CONTROL ====")
    print(f"MODE: {vehicle.mode.name}")
    print(f"STATUS: {'ARMED' if vehicle.armed else 'DISARMED'}")
    print(f"ALTITUDE: {vehicle.location.global_relative_frame.alt:.2f} m")
    print(f"HEADING: {vehicle.heading}°")
    if hasattr(vehicle, 'battery') and hasattr(vehicle.battery, 'level'):
        print(f"BATTERY: {vehicle.battery.level}%")
    print("\n== CONTROLS ==")
    print("T: Takeoff")
    print("L: Land")
    print("R: Return to Launch")
    print("Arrow Up/Down/Left/Right: Move forward/backward/left/right")
    print("W/S: Increase/decrease altitude")
    print("A/D: Rotate left/right")
    print("Q: Quit")
    print("\n== STATUS LOG ==")

def connect_to_drone():
    """Connect to the drone simulator and return vehicle object"""
    print("Connecting to vehicle on: %s" % CONNECTION_STRING)
    vehicle = connect(CONNECTION_STRING, wait_ready=True)
    print("✅ Connected to vehicle!")
    return vehicle

def arm_and_takeoff(vehicle, target_altitude):
    """Arm the motors and takeoff to target altitude"""
    global is_armed
    
    print("Basic pre-arm checks...")
    while not vehicle.is_armable:
        print("Waiting for vehicle to initialize...")
        time.sleep(1)
    
    print("Arming motors")
    vehicle.mode = VehicleMode("GUIDED")
    vehicle.armed = True
    
    while not vehicle.armed:
        print("Waiting for arming...")
        time.sleep(1)
    
    print("Taking off!")
    vehicle.simple_takeoff(target_altitude)
    
    # Wait until the vehicle reaches a safe height
    while vehicle.location.global_relative_frame.alt < target_altitude * 0.95:
        print(f"Altitude: {vehicle.location.global_relative_frame.alt}")
        time.sleep(1)
    
    print("Reached target altitude")
    is_armed = True

def land_drone(vehicle):
    """Command the drone to land"""
    global is_armed
    
    print("Landing...")
    vehicle.mode = VehicleMode("LAND")
    
    # Wait for landing to complete
    start_time = time.time()
    while vehicle.location.global_relative_frame.alt > 0.5 and time.time() - start_time < 30:
        print(f"Altitude: {vehicle.location.global_relative_frame.alt}")
        time.sleep(1)
    
    print("Landed")
    is_armed = False

def return_to_launch(vehicle):
    """Command the drone to return to launch"""
    print("Returning to Launch")
    vehicle.mode = VehicleMode("RTL")

def get_location_metres(original_location, dNorth, dEast):
    """Calculate new location given distance in meters North/East"""
    earth_radius = 6378137.0  # Radius of "spherical" earth
    
    # Coordinate offsets in radians
    dLat = dNorth / earth_radius
    dLon = dEast / (earth_radius * math.cos(math.pi * original_location.lat / 180))
    
    # New position in decimal degrees
    newlat = original_location.lat + (dLat * 180 / math.pi)
    newlon = original_location.lon + (dLon * 180 / math.pi)
    
    return LocationGlobalRelative(newlat, newlon, original_location.alt)

def move_drone(vehicle, direction):
    """Move the drone in the specified direction"""
    global drone_location
    
    if not vehicle.armed:
        print("Cannot move: Drone is not armed")
        return
    
    # Get current location
    drone_location = vehicle.location.global_relative_frame
    
    # Calculate new location based on direction
    if direction == "FORWARD":
        new_location = get_location_metres(drone_location, MOVEMENT_STEP, 0)
        print("Moving FORWARD")
    elif direction == "BACKWARD":
        new_location = get_location_metres(drone_location, -MOVEMENT_STEP, 0)
        print("Moving BACKWARD")
    elif direction == "RIGHT":
        new_location = get_location_metres(drone_location, 0, MOVEMENT_STEP)
        print("Moving RIGHT")
    elif direction == "LEFT":
        new_location = get_location_metres(drone_location, 0, -MOVEMENT_STEP)
        print("Moving LEFT")
    elif direction == "UP":
        new_location = LocationGlobalRelative(
            drone_location.lat, 
            drone_location.lon, 
            drone_location.alt + MOVEMENT_STEP
        )
        print(f"Moving UP to altitude {new_location.alt}")
    elif direction == "DOWN":
        new_location = LocationGlobalRelative(
            drone_location.lat, 
            drone_location.lon, 
            max(2, drone_location.alt - MOVEMENT_STEP)
        )
        print(f"Moving DOWN to altitude {new_location.alt}")
    else:
        return
    
    # Command the drone to move to new location
    vehicle.simple_goto(new_location, groundspeed=SPEED)

def rotate_drone(vehicle, direction):
    """Rotate the drone clockwise or counterclockwise"""
    if not vehicle.armed:
        print("Cannot rotate: Drone is not armed")
        return
        
    # Get current heading
    current_heading = vehicle.heading
    
    # Calculate new heading
    if direction == "CLOCKWISE":
        new_heading = (current_heading + YAW_CHANGE) % 360
        print(f"Rotating CLOCKWISE to heading {new_heading}")
    else:  # COUNTERCLOCKWISE
        new_heading = (current_heading - YAW_CHANGE) % 360
        print(f"Rotating COUNTERCLOCKWISE to heading {new_heading}")
    
    # Command the drone to change heading
    vehicle.condition_yaw(new_heading, relative=False)

def status_update_thread(vehicle):
    """Thread to periodically update the drone status"""
    global running
    
    while running:
        print_status(vehicle)
        time.sleep(2)  # Update every 2 seconds

def main():
    global running, is_armed
    
    # Connect to the drone
    vehicle = connect_to_drone()
    
    # Start the status update thread
    status_thread = threading.Thread(target=status_update_thread, args=(vehicle,))
    status_thread.daemon = True
    status_thread.start()
    
    # Setup keyboard handlers
    keyboard.on_press_key('t', lambda _: arm_and_takeoff(vehicle, DEFAULT_ALTITUDE) if not is_armed else None)
    keyboard.on_press_key('l', lambda _: land_drone(vehicle) if is_armed else None)
    keyboard.on_press_key('r', lambda _: return_to_launch(vehicle) if is_armed else None)
    keyboard.on_press_key('up', lambda _: move_drone(vehicle, "FORWARD") if is_armed else None)
    keyboard.on_press_key('down', lambda _: move_drone(vehicle, "BACKWARD") if is_armed else None)
    keyboard.on_press_key('left', lambda _: move_drone(vehicle, "LEFT") if is_armed else None)
    keyboard.on_press_key('right', lambda _: move_drone(vehicle, "RIGHT") if is_armed else None)
    keyboard.on_press_key('w', lambda _: move_drone(vehicle, "UP") if is_armed else None)
    keyboard.on_press_key('s', lambda _: move_drone(vehicle, "DOWN") if is_armed else None)
    keyboard.on_press_key('a', lambda _: rotate_drone(vehicle, "COUNTERCLOCKWISE") if is_armed else None)
    keyboard.on_press_key('d', lambda _: rotate_drone(vehicle, "CLOCKWISE") if is_armed else None)
    
    # Main loop
    try:
        print("Drone control ready. Press 'q' to quit.")
        keyboard.wait('q')  # Wait until 'q' is pressed
    except KeyboardInterrupt:
        pass
    finally:
        # Clean up
        running = False
        print("\nClosing vehicle connection...")
        vehicle.close()
        print("Done!")

if __name__ == "__main__":
    main()
