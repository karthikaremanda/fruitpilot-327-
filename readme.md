# 🍈 FRUITPILOT: Autonomous Drone for Fruit Harvesting

**FRUITPILOT** is an innovative AI-powered autonomous drone system designed for fruit harvesting, focused primarily on detecting and navigating towards mangoes on trees using computer vision. The project integrates object detection (YOLO), drone control (DroneKit), and a web interface for real-time monitoring and target selection.

---

## 🚀 Features

- 🎯 **Mango Detection with YOLO**: Detects ripe mangoes on trees using YOLOv8.
- 🛰️ **Autonomous Navigation**: Drone automatically navigates to the detected fruits or user-clicked GPS targets.
- 🧭 **Interactive Map Interface**: Click on the map to send coordinates to the drone.
- 📍 **Live GPS Tracking**: Displays the real-time location of the drone on the map.
- 🧠 **AI Integration**: Deep learning-based object detection for precise and efficient fruit recognition.
- 📡 **Web-based Dashboard**: Built with HTML, CSS, and JS for intuitive user control and monitoring.

---

## 🧩 Project Structure

```
fruitpilot-327-
├── backend/                  # Python server and drone control logic
│   ├── yolov8_detection.py   # YOLOv8 object detection
│   ├── dronekit_control.py   # DroneKit commands and flight logic
│   └── api/                  # REST API endpoints
├── frontend/                 # Web interface
│   ├── index.html            # Main dashboard UI
│   ├── js/
│   │   ├── map.js            # Map interaction and drone position updates
│   │   └── controls.js       # UI controls for takeoff, land, etc.
│   └── css/
│       └── styles.css        # Styling for the UI
├── models/                   # Pre-trained YOLO models
│   └── mango_detector.pt
└── README.md
```

---

## 🛠️ How to Run the Project

### 1. Clone the Repository

```bash
git clone https://github.com/karthikaremanda/fruitpilot-327-.git
cd fruitpilot-327-
```

### 2. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 3. Start Backend Server

```bash
python app.py
```

This runs the Python server that handles YOLO detection and drone control.

### 4. Launch the Frontend

Just open `frontend/index.html` in your browser.

---

## 🧪 Tech Stack

- **Frontend**: HTML, CSS, JavaScript, Leaflet.js
- **Backend**: Python (Flask), DroneKit, OpenCV
- **AI/ML**: YOLOv8 for fruit detection
- **Hardware**: PX4 / ArduPilot-compatible drone

---

## 🌍 How It Works

1. **Detects Mangoes**: Camera feed is processed using YOLOv8 model.
2. **Gets GPS or Click Coordinates**: User can select a point on the map.
3. **Sends Coordinates to Drone**: Coordinates are passed via backend to DroneKit.
4. **Drone Navigates**: The drone autonomously flies to the given location or the mango.
5. **Live Location Update**: Position is updated live on the map.

---

## 📸 Sample Output

> Add sample YOLO detection screenshots or drone-in-flight photos here.

---

## 🤖 Future Scope

- Integration with robotic arm for automated picking
- Multi-fruit detection and classification
- Solar-powered drone enhancements
- Real-time yield estimation using AI

---

## 🤝 Contributing

Pull requests are welcome! Please open an issue first to discuss changes.

---

## 📝 License

MIT License

---

## 📬 Contact

Project maintained by [@karthikaremanda](https://github.com/karthikaremanda)
