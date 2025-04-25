from dronekit import connect, VehicleMode
import time

# Connect to the simulated drone
vehicle = connect("udp:127.0.0.1:14550", wait_ready=True)
print("connected to vehicle")
# Function to arm and take off
def arm_and_takeoff(altitude):
    print("Arming motors")
    vehicle.mode = VehicleMode("GUIDED")
    vehicle.armed = True

    while not vehicle.armed:
        print("Waiting for arming...")
        time.sleep(1)

    print("Taking off")
    vehicle.simple_takeoff(altitude)

    while vehicle.location.global_relative_frame.alt < altitude * 0.95:
        print(f"Altitude: {vehicle.location.global_relative_frame.alt}")
        time.sleep(1)

    print("Reached target altitude")

arm_and_takeoff(10)

vehicle.close()
