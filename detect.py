from ultralytics import YOLO

# Load the trained model
model = YOLO("best.pt")

# Detect fruits in an image
results = model("fruit_image.jpg")

# Show results
results[0].show()
