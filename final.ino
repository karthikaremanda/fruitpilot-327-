#include <Arduino.h>
#include <Wire.h>
#include <RTClib.h>
#include <WiFi.h>
#include <WebServer.h>
#include <Preferences.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

// --- Pin Definitions ---
#define LED_PIN 25

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 32
#define OLED_RESET -1

// --- I2C Buses ---
TwoWire RTCWire = TwoWire(0);   // RTC on GPIO 32 (SDA), 33 (SCL)
TwoWire OLEDWire = TwoWire(1);  // OLED on GPIO 16 (SDA), 17 (SCL)

// --- Objects ---
RTC_DS3231 rtc;
Preferences preferences;
WebServer server(80);
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &OLEDWire, OLED_RESET);

// --- Time Variables ---
int onHour, onMinute, offHour, offMinute;
bool ledState = false;

// --- HTML Page ---
const char index_html[] PROGMEM = R"rawliteral(
<!DOCTYPE html>
<html>
<head>
  <title>LED Timer</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .container { max-width: 600px; margin: 0 auto; }
    .form-group { margin-bottom: 15px; }
    label { display: inline-block; width: 200px; }
    input[type="text"] { padding: 5px; width: 150px; }
    input[type="submit"], button { padding: 8px 15px; background-color: #4CAF50; color: white; border: none; cursor: pointer; }
    .card { background-color: #f9f9f9; border-radius: 5px; padding: 15px; margin-bottom: 20px; }
  </style>
  <script>
    function syncLaptopTime() {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1; // JS months are 0-based
      const day = now.getDate();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      
      // Format data as URL parameters
      const timeParams = `year=${year}&month=${month}&day=${day}&hour=${hours}&minute=${minutes}&second=${seconds}`;
      
      // Send time to ESP32
      fetch('/synclaptoptime?' + timeParams)
      .then(response => {
        if (response.ok) {
          alert('Time synchronized successfully with laptop!');
          location.reload();
        } else {
          alert('Failed to sync time');
        }
      })
      .catch(error => {
        alert('Error: ' + error);
      });
    }
  </script>
</head>
<body>
  <div class="container">
    <h1>LED Timer Control</h1>
    
    <div class="card">
      <h2>Current Status</h2>
      <p>Current Time: <strong>%CURRENT_TIME%</strong></p>
      <p>LED Status: <strong>%LED_STATUS%</strong></p>
    </div>
    
    <div class="card">
      <h2>Set LED ON/OFF Times</h2>
      <form action="/set" method="POST">
        <div class="form-group">
          <label>ON Time (HH:MM):</label>
          <input type="text" name="onTime" value="%ON_TIME%">
        </div>
        <div class="form-group">
          <label>OFF Time (HH:MM):</label>
          <input type="text" name="offTime" value="%OFF_TIME%">
        </div>
        <input type="submit" value="Set Timer">
      </form>
    </div>
    
    <div class="card">
      <h2>Set Current Time</h2>
      <form action="/setclock" method="POST">
        <div class="form-group">
          <label>Date (YYYY-MM-DD):</label>
          <input type="text" name="date" value="%CURRENT_DATE%">
        </div>
        <div class="form-group">
          <label>Time (HH:MM:SS):</label>
          <input type="text" name="time" value="%CURRENT_TIME_ONLY%">
        </div>
        <input type="submit" value="Set Clock">
      </form>
      <p><button onclick="syncLaptopTime()">Sync with Laptop Time</button></p>
      <p>Or <a href="/synctime"><button>Sync clock to compile time</button></a></p>
    </div>
  </div>
</body>
</html>
)rawliteral";

// --- Update LED State Based on Time ---
void updateLEDState() {
  DateTime now = rtc.now();
  int nowTotal = now.hour() * 60 + now.minute();
  int onTotal = onHour * 60 + onMinute;
  int offTotal = offHour * 60 + offMinute;

  bool shouldBeOn;
  if (onTotal < offTotal) {
    shouldBeOn = (nowTotal >= onTotal && nowTotal < offTotal);
  } else {
    shouldBeOn = (nowTotal >= onTotal || nowTotal < offTotal); // Overnight
  }

  if (shouldBeOn != ledState) {
    digitalWrite(LED_PIN, shouldBeOn ? HIGH : LOW);
    ledState = shouldBeOn;
  }
}

// --- Root Page Handler ---
void handleRoot() {
  String html = index_html;
  char buffer[20];

  // Set ON/OFF times
  sprintf(buffer, "%02d:%02d", onHour, onMinute);
  html.replace("%ON_TIME%", buffer);
  sprintf(buffer, "%02d:%02d", offHour, offMinute);
  html.replace("%OFF_TIME%", buffer);
  
  // Set current date/time values
  DateTime now = rtc.now();
  sprintf(buffer, "%04d-%02d-%02d %02d:%02d:%02d", now.year(), now.month(), now.day(), now.hour(), now.minute(), now.second());
  html.replace("%CURRENT_TIME%", buffer);
  
  sprintf(buffer, "%04d-%02d-%02d", now.year(), now.month(), now.day());
  html.replace("%CURRENT_DATE%", buffer);
  
  sprintf(buffer, "%02d:%02d:%02d", now.hour(), now.minute(), now.second());
  html.replace("%CURRENT_TIME_ONLY%", buffer);
  
  // Set LED status
  html.replace("%LED_STATUS%", ledState ? "ON" : "OFF");

  server.send(200, "text/html", html);
}

// --- Set Timer Form Handler ---
void handleSet() {
  String onTime = server.arg("onTime");
  String offTime = server.arg("offTime");

  if (onTime.length() >= 5 && offTime.length() >= 5) {
    onHour = onTime.substring(0, 2).toInt();
    onMinute = onTime.substring(3).toInt();
    offHour = offTime.substring(0, 2).toInt();
    offMinute = offTime.substring(3).toInt();

    preferences.begin("relay_settings", false);
    preferences.putUInt("onHour", onHour);
    preferences.putUInt("onMinute", onMinute);
    preferences.putUInt("offHour", offHour);
    preferences.putUInt("offMinute", offMinute);
    preferences.end();

    updateLEDState();  // Apply changes immediately
  }

  server.sendHeader("Location", "/");
  server.send(302, "text/plain", "");  // Redirect back to the main page
}

// --- Set Clock Form Handler ---
void handleSetClock() {
  String date = server.arg("date");
  String time = server.arg("time");
  
  if (date.length() >= 10 && time.length() >= 8) {
    int year = date.substring(0, 4).toInt();
    int month = date.substring(5, 7).toInt();
    int day = date.substring(8, 10).toInt();
    int hour = time.substring(0, 2).toInt();
    int minute = time.substring(3, 5).toInt();
    int second = time.substring(6, 8).toInt();
    
    rtc.adjust(DateTime(year, month, day, hour, minute, second));
    updateLEDState();  // Check if LED state should change based on new time
  }
  
  server.sendHeader("Location", "/");
  server.send(302, "text/plain", "");  // Redirect back to the main page
}

// --- New Handler for Laptop Time Sync (Using GET parameters) ---
void handleSyncLaptopTime() {
  if (server.hasArg("year") && server.hasArg("month") && server.hasArg("day") && 
      server.hasArg("hour") && server.hasArg("minute") && server.hasArg("second")) {
    
    int year = server.arg("year").toInt();
    int month = server.arg("month").toInt();
    int day = server.arg("day").toInt();
    int hour = server.arg("hour").toInt();
    int minute = server.arg("minute").toInt();
    int second = server.arg("second").toInt();
    
    // Set RTC time
    rtc.adjust(DateTime(year, month, day, hour, minute, second));
    updateLEDState();  // Check if LED state should change
    
    server.send(200, "text/plain", "Time synced successfully");
  } else {
    server.send(400, "text/plain", "Missing time parameters");
  }
}

// --- Sync Clock to Compile Time Handler ---
void handleSyncTime() {
  rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));
  updateLEDState();  // Check if LED state should change based on new time
  
  server.sendHeader("Location", "/");
  server.send(302, "text/plain", "");  // Redirect back to the main page
}

void setup() {
  Serial.begin(115200);

  // --- I2C Setup ---
  RTCWire.begin(32, 33);   // RTC on I2C0
  OLEDWire.begin(16, 17);  // OLED on I2C1

  // --- RTC Init ---
  if (!rtc.begin(&RTCWire)) {
    Serial.println("RTC not found!");
    while (true);
  }

  // Check if RTC lost power and set the time if needed
  if (rtc.lostPower()) {
    Serial.println("RTC lost power, setting time!");
    // Set RTC to the date & time this sketch was compiled
    rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));
  }

  // --- OLED Init ---
  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println("OLED not found!");
    while (true);
  }
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);

  // --- Load Preferences ---
  preferences.begin("relay_settings", true);
  onHour = preferences.getUInt("onHour", 0);
  onMinute = preferences.getUInt("onMinute", 30);
  offHour = preferences.getUInt("offHour", 18);
  offMinute = preferences.getUInt("offMinute", 0);
  preferences.end();

  // --- LED Setup ---
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);

  // --- Wi-Fi Access Point Setup ---
  WiFi.mode(WIFI_AP);
  IPAddress local_ip(192, 168, 4, 1);
  IPAddress gateway(192, 168, 4, 1);
  IPAddress subnet(255, 255, 255, 0);
  WiFi.softAPConfig(local_ip, gateway, subnet);
  WiFi.softAP("CL-26", "netkmit@456#");

  delay(1000); // Give time to init

  Serial.print("AP IP Address: ");
  Serial.println(WiFi.softAPIP());

  // --- Web Server Setup ---
  server.on("/", handleRoot);
  server.on("/set", HTTP_POST, handleSet);
  server.on("/setclock", HTTP_POST, handleSetClock);
  server.on("/synctime", handleSyncTime);
  server.on("/synclaptoptime", handleSyncLaptopTime); // New endpoint for laptop time sync
  server.begin();
  Serial.println("Web server started");
  
  // Initial LED state update
  updateLEDState();
}

void loop() {
  server.handleClient();
  updateLEDState();

  DateTime now = rtc.now();
  display.clearDisplay();
  display.setCursor(0, 0);
  display.printf("Time: %02d:%02d:%02d\n", now.hour(), now.minute(), now.second());
  display.printf("ON:   %02d:%02d\n", onHour, onMinute);
  display.printf("OFF:  %02d:%02d\n", offHour, offMinute);
  display.printf("LED:  %s\n", ledState ? "ON" : "OFF");
  display.display();

  delay(1000);
}
