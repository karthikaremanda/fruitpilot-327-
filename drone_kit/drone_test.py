from dronekit import connect

# Connect to the drone simulator
vehicle = connect("127.0.0.1:14550", wait_ready=True)

# Print drone info
print(f"Drone Mode: {vehicle.mode.name}")
print(f"Altitude: {vehicle.location.global_relative_frame.alt}")

# Close connection
vehicle.close()
