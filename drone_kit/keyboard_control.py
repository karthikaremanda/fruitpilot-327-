from dronekit import connect, VehicleMode
import keyboard
import time

vehicle = connect("172.31.160.1:14550", wait_ready=True)

def arm_and_takeoff(altitude):
    print("Arming motors")
    vehicle.mode = VehicleMode("GUIDED")
    vehicle.armed = True
    while not vehicle.armed:
        time.sleep(1)
    
    print("Taking off")
    vehicle.simple_takeoff(altitude)
    while vehicle.location.global_relative_frame.alt < altitude * 0.95:
        time.sleep(1)
    
    print("Reached target altitude")

arm_and_takeoff(10)

while True:
    if keyboard.is_pressed("w"):
        print("Moving Forward")
    elif keyboard.is_pressed("s"):
        print("Moving Backward")
    elif keyboard.is_pressed("a"):
        print("Moving Left")
    elif keyboard.is_pressed("d"):
        print("Moving Right")
    elif keyboard.is_pressed("q"):
        print("Landing")
        vehicle.mode = VehicleMode("LAND")
        break

vehicle.close()
