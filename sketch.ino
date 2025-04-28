#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <RTClib.h>

// Initializing LCD
LiquidCrystal_I2C lcd(0x27, 16, 2);
RTC_DS3231 rtc;

// Pin Definitions
#define LED_PIN 6         
#define RELAY_PIN 7       
#define PROG_BTN 2
#define WEEK_BTN 3
#define HOUR_BTN 4
#define MODE_BTN 5
#define RESET_BTN 8

#define MAX_SCHEDULES 10  

// Schedule storage
int scheduledHourOn[MAX_SCHEDULES] = {6, 8, 10, 12, 14, 16, 18, 20, 22, 23};
int scheduledMinuteOn[MAX_SCHEDULES] = {0, 15, 30, 45, 0, 15, 30, 45, 0, 15};
int scheduledHourOff[MAX_SCHEDULES] = {6, 8, 10, 12, 14, 16, 18, 20, 22, 23};
int scheduledMinuteOff[MAX_SCHEDULES] = {5, 20, 35, 50, 5, 20, 35, 50, 5, 20};

int mode = 0;
bool relayState = false;
int weekMode = 0;
int selectedSchedule = 0;
bool editMode = false;
int editField = -1;
bool blinkState = false;
unsigned long lastBlinkTime = 0;

void updateDisplay() {
    lcd.clear();
    DateTime now = rtc.now();
    
    lcd.setCursor(0, 0);
    lcd.print("T:");
    lcd.print(now.hour());
    lcd.print(":");
    lcd.print(now.minute());
    
    lcd.setCursor(8, 0);
    lcd.print("S:");
    lcd.print(selectedSchedule + 1);
    if (editField == 3 && blinkState) lcd.print("<");
    
    lcd.setCursor(13, 0);
    lcd.print("M:");
    lcd.print((mode == 0) ? "A" : (mode == 1) ? "N" : "F");
    if (editField == 4 && blinkState) lcd.print("<");
    
    lcd.setCursor(0, 1);
    lcd.print("ON:");
    lcd.print(scheduledHourOn[selectedSchedule]);
    lcd.print(":");
    lcd.print(scheduledMinuteOn[selectedSchedule]);
    
    lcd.setCursor(9, 1);
    lcd.print("OFF:");
    lcd.print(scheduledHourOff[selectedSchedule]);
    lcd.print(":");
    lcd.print(scheduledMinuteOff[selectedSchedule]);
    
    lcd.setCursor(0, 2);
    lcd.print("Week Mode: ");
    lcd.print(weekMode == 0 ? "All" : "Alt");
    if (editField == 5 && blinkState) lcd.print("<");
}

bool buttonPressed(int pin) {
    static unsigned long lastPressTime[6] = {0};
    unsigned long currentTime = millis();
    if (digitalRead(pin) == LOW) {
        if (currentTime - lastPressTime[pin] > 200) {
            lastPressTime[pin] = currentTime;
            return true;
        }
    }
    return false;
}

void setup() {
    pinMode(LED_PIN, OUTPUT);
    pinMode(RELAY_PIN, OUTPUT);
    pinMode(PROG_BTN, INPUT_PULLUP);
    pinMode(WEEK_BTN, INPUT_PULLUP);
    pinMode(HOUR_BTN, INPUT_PULLUP);
    pinMode(MODE_BTN, INPUT_PULLUP);
    pinMode(RESET_BTN, INPUT_PULLUP);

    lcd.init();
    lcd.backlight();
    if (!rtc.begin()) {
        lcd.setCursor(0, 0);
        lcd.print("RTC Error!");
        while (1);
    }
    lcd.setCursor(0, 0);
    lcd.print("System Ready");
    delay(2000);
    lcd.clear();
}

void loop() {
    DateTime now = rtc.now();
    unsigned long currentTime = millis();
    
    if (currentTime - lastBlinkTime >= 500) {
        blinkState = !blinkState;
        lastBlinkTime = currentTime;
    }

    if (buttonPressed(HOUR_BTN)) {
        editMode = !editMode;
        editField = 0;
    }

    if (editMode) {
        if (buttonPressed(PROG_BTN)) {
            editField = (editField + 1) % 6;
        }
        if (buttonPressed(MODE_BTN)) {
            if (editField == 0) scheduledHourOn[selectedSchedule] = (scheduledHourOn[selectedSchedule] + 1) % 24;
            if (editField == 1) scheduledMinuteOn[selectedSchedule] = (scheduledMinuteOn[selectedSchedule] + 1) % 60;
            if (editField == 2) scheduledHourOff[selectedSchedule] = (scheduledHourOff[selectedSchedule] + 1) % 24;
            if (editField == 3) scheduledMinuteOff[selectedSchedule] = (scheduledMinuteOff[selectedSchedule] + 1) % 60;
            if (editField == 4) mode = (mode + 1) % 3;
            if (editField == 5) weekMode = (weekMode + 1) % 2;
        }
    } else {
        if (buttonPressed(MODE_BTN)) {
            mode = (mode + 1) % 3;
            editField = 4;
        }
        if (buttonPressed(PROG_BTN)) {
            selectedSchedule = (selectedSchedule + 1) % MAX_SCHEDULES;
            editField = 3;
        }
        if (buttonPressed(WEEK_BTN)) {
            weekMode = (weekMode + 1) % 2;
            editField = 5;
        }
    }

    bool active = false;
    for (int i = 0; i < MAX_SCHEDULES; i++) {
        bool validDay = (weekMode == 0) || (now.dayOfTheWeek() % 2 == 0);
        if (validDay) {
            int onTime = scheduledHourOn[i] * 60 + scheduledMinuteOn[i];
            int offTime = scheduledHourOff[i] * 60 + scheduledMinuteOff[i];
            int currentTime = now.hour() * 60 + now.minute();
            if (currentTime >= onTime && currentTime < offTime) {
                active = true;
            }
        }
    }

    relayState = (mode == 1) ? true : (mode == 2) ? false : active;
    digitalWrite(RELAY_PIN, relayState);
    digitalWrite(LED_PIN, relayState);
    
    updateDisplay();
    delay(100);
}
