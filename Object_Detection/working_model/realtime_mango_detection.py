import cv2
from ultralytics import YOLO

# Load YOLO model (update the path as needed)
model = YOLO('mango_yolov8.pt')

# Start webcam
cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # Run detection
    results = model(frame)

    # Plot results
    annotated = results[0].plot()

    # Show the output
    cv2.imshow('YOLO Mango Detection', annotated)

    # Press 'q' to quit the program
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
