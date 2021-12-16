//Wifi
#include "esp_wpa2.h"
#include <WiFi.h>
#include <HTTPClient.h>
#include <Arduino_JSON.h>
#include "credentials.h"

const char *ssid = SSID;
String api_host = "https://acex-iot.web.app/api/";
// String api_host = "http://f123-92-40-177-162.ngrok.io/api/";
String scanner_name = "scanner1";

//String tapin_endpoint = "tapin";
String tapin_endpoint = "tapinnoauth";
String turnoff_endpoint = "turnoff";
String devicestatus_endpoint = "devicestatus";

int device_id = 0;

//RFID_scanner
#include <SPI.h>
#include <MFRC522.h>

#define RST_PIN 27
#define SS_PIN 5

MFRC522 mfrc522(SS_PIN, RST_PIN); // Create MFRC522 instance

//Buttons, button LEDs, names and transistors for both devices
#define BUTTON0_PIN 26
#define BUTTON0_LED_PIN 32
#define BUTTON0_LED_CHANNEL 1
String DEVICE0_NAME = "VLS3.50";

#define BUTTON1_PIN 25
#define BUTTON1_LED_PIN 33
#define BUTTON1_LED_CHANNEL 2
String DEVICE1_NAME = "VLS4.60";

//433MHz transmitter setup
#include <RCSwitch.h>

#define TRANSMITTER_PIN 2

String plug0OnMsg = "000010111101000101111100";
String plug0OffMsg = "000010111101000101110100";

String plug1OnMsg = "000010111101000101111010";
String plug1OffMsg = "000010111101000101110010";

RCSwitch mySwitch = RCSwitch();

//Buzzer
#define BUZZER_PIN 14
#define BUZZER_CHANNEL 0

//LCD
#include <U8g2lib.h>

U8G2_SSD1306_128X64_NONAME_F_HW_I2C u8g2(U8G2_R0, 16, 15, 4);

//Misc variables
bool cardScanned = false;
bool device0State = 0;
bool device1State = 0;

int deviceID = 0;
int deviceState = 0;
int deviceLEDChannel = 0;
String deviceOnMsg = "";
String deviceOffMsg = "";
String deviceName = "";

unsigned long startMillis = 0;
unsigned long currentMillis = 0;
unsigned long timeout = 30000;
unsigned long wifiTimeout = 10000;

void displayMessage(String option, String detail = "", int number = 0)
{
    u8g2.clearBuffer();
    if (option == "scan_card")
    {
        u8g2.setFont(u8g2_font_helvB14_te);
        u8g2.drawStr(10, 0, "Please scan");
        u8g2.drawStr(22, 18, "your card");
        u8g2.setFont(u8g2_font_open_iconic_all_4x_t);
        u8g2.drawStr(49, 34, "T"); //T is a scan symbol
    }
    else if (option == "connect_failed")
    {
        u8g2.setFont(u8g2_font_helvB14_te);
        u8g2.drawStr(18, 5, "Failed to");
        u8g2.drawStr(5, 37, "connect");
        u8g2.setFont(u8g2_font_open_iconic_all_4x_t);
        u8g2.drawStr(88, 28, "W"); //W is a forbidden symbol
    }
    else if (option == "unauthorised")
    {
        u8g2.setFont(u8g2_font_helvB14_te);
        u8g2.drawStr(5, 5, "Unauthorised");
        u8g2.setFont(u8g2_font_open_iconic_all_4x_t);
        u8g2.drawStr(49, 28, "W"); //W is a forbidden symbol
    }
    else if (option == "update_error")
    {
        u8g2.setFont(u8g2_font_helvB14_te);
        u8g2.drawStr(4, 5, "Update Error");
        u8g2.setCursor(10, 37);
        u8g2.print(number);
        u8g2.setCursor(0, 0);
        u8g2.setFont(u8g2_font_open_iconic_all_4x_t);
        u8g2.drawStr(88, 28, "W"); // W is the forbidden symbol
    }
    else if (option == "error")
    {
        u8g2.setFont(u8g2_font_helvB14_te);
        u8g2.drawStr(15, 5, "Error");
        u8g2.setCursor(80, 5);
        u8g2.print(number);
        u8g2.setCursor(0, 0);
        u8g2.setFont(u8g2_font_open_iconic_all_4x_t);
        u8g2.drawStr(49, 28, "W"); // W is the forbidden symbol
    }
    else if (option == "status")
    {
        u8g2.setFont(u8g2_font_helvB14_te);
        u8g2.drawStr(15, 0, "AceX Laser");
        u8g2.drawStr(35, 19, "Cutters");
        u8g2.setCursor(30, 48);
        u8g2.print(number);
        u8g2.setCursor(0, 0);
        u8g2.drawStr(47, 48, "in use");
    }
    else if (option == "invalid_card")
    {
        u8g2.setFont(u8g2_font_helvB14_te);
        u8g2.drawStr(12, 5, "Invalid card");
        u8g2.setFont(u8g2_font_open_iconic_all_4x_t);
        u8g2.drawStr(49, 28, "W"); // W is the forbidden symbol
    }
    else if (option == "connected")
    {
        u8g2.setFont(u8g2_font_helvB14_te);
        u8g2.drawStr(16, 5, "Connected");
        u8g2.setFont(u8g2_font_open_iconic_all_4x_t);
        u8g2.drawStr(49, 28, "s"); //s is a check
    }
    else if (option == "connecting")
    {
        u8g2.setFont(u8g2_font_helvB14_te);
        u8g2.drawStr(5, 25, "Connecting...");
    }
    else if (option == "turning_on")
    {
        u8g2.setFont(u8g2_font_helvB14_te);
        u8g2.drawStr(15, 0, "Turning on");
        u8g2.drawStr(30, 19, detail.c_str());
        u8g2.setFont(u8g2_font_open_iconic_all_4x_t);
        u8g2.drawStr(49, 34, "s"); //s is check
    }
    else if (option == "turning_off")
    {
        u8g2.setFont(u8g2_font_helvB14_te);
        u8g2.drawStr(12, 0, "Turning off");
        u8g2.drawStr(30, 19, detail.c_str());
        u8g2.setFont(u8g2_font_open_iconic_all_4x_t);
        u8g2.drawStr(49, 34, "s"); //s is check
    }
    else if (option == "time_out")
    {
        u8g2.setFont(u8g2_font_helvB14_te);
        u8g2.drawStr(15, 5, "Timed out");
        u8g2.setFont(u8g2_font_open_iconic_all_4x_t);
        u8g2.drawStr(49, 28, "W"); // W is the forbidden symbol
    }
    else if (option == "restarting")
    {
        u8g2.setFont(u8g2_font_helvB14_te);
        u8g2.drawStr(10, 5, "Restarting...");
        u8g2.setFont(u8g2_font_open_iconic_all_4x_t);
        u8g2.drawStr(49, 28, "W"); // W is the forbidden symbol
    }
    u8g2.sendBuffer();
    return;
}

void setup()
{
    Serial.begin(115200);

    //Screen setup
    u8g2.begin();
    u8g2.setFont(u8g2_font_6x10_tf);
    u8g2.setFontRefHeightExtendedText();
    u8g2.setDrawColor(1);
    u8g2.setFontPosTop();
    u8g2.setFontDirection(0);

    //Buzzer setup
    ledcSetup(BUZZER_CHANNEL, 2000, 8);
    ledcAttachPin(BUZZER_PIN, BUZZER_CHANNEL);

    //Startup buzzer tone
    ledcWriteTone(BUZZER_CHANNEL, 1000);
    ledcWrite(BUZZER_CHANNEL, 50);
    delay(500);
    ledcWrite(BUZZER_CHANNEL, 0);

    //WPA Enterprise Wifi Setup
    delay(10);

    Serial.println();
    Serial.print("Connecting to "); //display on screen
    Serial.println(ssid);

    WiFi.disconnect(true);
    WiFi.mode(WIFI_STA);
    esp_wifi_sta_wpa2_ent_set_identity((uint8_t *)EAP_ID, strlen(EAP_ID));
    esp_wifi_sta_wpa2_ent_set_username((uint8_t *)EAP_USERNAME, strlen(EAP_USERNAME));
    esp_wifi_sta_wpa2_ent_set_password((uint8_t *)EAP_PASSWORD, strlen(EAP_PASSWORD));
    esp_wpa2_config_t config = WPA2_CONFIG_INIT_DEFAULT();
    esp_wifi_sta_wpa2_ent_enable(&config);

    WiFi.begin(ssid);
    displayMessage("connecting");

    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        // do something on the screen
        Serial.print(".");
    }
    Serial.println("");
    Serial.println("WiFi connected");

    displayMessage("connected"); //display connected message on LCD

    //Sound buzzer to show its connected to wifi
    ledcWriteTone(BUZZER_CHANNEL, 300);
    ledcWrite(BUZZER_CHANNEL, 50);
    delay(100);
    ledcWrite(BUZZER_CHANNEL, 0);
    delay(100);
    ledcWriteTone(BUZZER_CHANNEL, 1000);
    ledcWrite(BUZZER_CHANNEL, 50);
    delay(100);
    ledcWrite(BUZZER_CHANNEL, 0);

    //RFID Setup
    SPI.begin();                       // Init SPI bus
    mfrc522.PCD_Init();                // Init MFRC522
    mfrc522.PCD_DumpVersionToSerial(); // Show details of PCD - MFRC522 Card Reader details

    //Button & Button LED setup
    pinMode(BUTTON0_PIN, INPUT_PULLUP);
    pinMode(BUTTON1_PIN, INPUT_PULLUP);

    ledcSetup(BUTTON0_LED_CHANNEL, 0.25, 4);
    ledcAttachPin(BUTTON0_LED_PIN, BUTTON0_LED_CHANNEL);
    ledcSetup(BUTTON1_LED_CHANNEL, 0.25, 4);
    ledcAttachPin(BUTTON1_LED_PIN, BUTTON1_LED_CHANNEL);

    mySwitch.enableTransmit(TRANSMITTER_PIN);
    mySwitch.setProtocol(1);
    mySwitch.setPulseLength(200);   //pulse length
    mySwitch.setRepeatTransmit(15); //transmission repetitions.

    delay(2000);
}

void loop()
{
    //update device statuses - protecting against power cycles
    bool update = updateDeviceStatus();
    if (!update)
    { //if device update was unsuccessful then restart loop and try again
        return;
    }

    deviceID = buttonWait();

    if (deviceID == 0) //VLS3.50
    {
        deviceState = device0State;
        deviceLEDChannel = BUTTON0_LED_CHANNEL;
        deviceOnMsg = plug0OnMsg;
        deviceOffMsg = plug0OffMsg;
        deviceName = DEVICE0_NAME;
    }
    else if (deviceID == 1) //VLS4.60
    {
        deviceState = device1State;
        deviceLEDChannel = BUTTON1_LED_CHANNEL;
        deviceOnMsg = plug1OnMsg;
        deviceOffMsg = plug1OffMsg;
        deviceName = DEVICE1_NAME;
    }

    if (!deviceState) // device is off
    {
        turnOn();
        return;
    }
    else //device is on2
    {
        turnOff();
        return;
    }
}

//function for rearranging and translating hexidecimel bytes to
//match the 10 decimel output of the USB card reader
unsigned long getID()
{
    if (!mfrc522.PICC_ReadCardSerial())
    {
        //Since a PICC placed get Serial and continue
        return -1;
    }
    unsigned long hex_num;
    hex_num = mfrc522.uid.uidByte[3] << 24;
    hex_num += mfrc522.uid.uidByte[2] << 16;
    hex_num += mfrc522.uid.uidByte[1] << 8;
    hex_num += mfrc522.uid.uidByte[0];
    mfrc522.PICC_HaltA();
    // Stop reading
    return hex_num;
}

int buttonWait()
{
    int button0State = 0;
    int button1State = 0;
    while (1)
    {
        button0State = digitalRead(BUTTON0_PIN);
        button1State = digitalRead(BUTTON1_PIN);
        if (button0State == LOW)
        {
            return 0;
        }
        else if (button1State == LOW)
        {
            return 1;
        }
    }
}

void turnOn()
{
    //display please scan card
    displayMessage("scan_card");

    ledcWriteTone(deviceLEDChannel, 1); //Flash button LED (1Hz 50% duty cycle)
    startMillis = millis();
    bool cardDetected = false;
    while (!cardDetected) //wait for card scan
    {
        currentMillis = millis();
        if (mfrc522.PICC_IsNewCardPresent()) //if new card present end loop
        {
            cardDetected = true;
        }
        else if (currentMillis - startMillis > timeout) //timeout if no card is scanned
        {
            displayMessage("time_out");
            ledcWriteTone(deviceLEDChannel, 0);
            Serial.println("Card scan timed out");
            delay(2000);
            return;
        }
        delay(100);
    }
    ledcWriteTone(BUZZER_CHANNEL, 1000);
    ledcWrite(BUZZER_CHANNEL, 50);
    delay(100);
    ledcWrite(BUZZER_CHANNEL, 0);
    unsigned long uid = getID();
    if (uid != -1)
    {
        //Dispay connecting...
        displayMessage("connecting");

        String uid_string = String(uid);
        if (uid_string.length() == 9)
        {
            uid_string = '0' + uid_string;
        }
        Serial.print("Card detected, UID: ");
        Serial.println(uid_string);
        if (WiFi.status() == WL_CONNECTED)
        {
            Serial.println("Wifi still connected");
            HTTPClient http;
            http.begin(api_host + tapin_endpoint);
            http.addHeader("Content-Type", "application/json");
            int httpResponseCode = http.POST("{\"card_id\":\"" + uid_string + "\",\"scanner_name\":\"" + scanner_name + "\",\"auth\":\"" + String(API_SECRET) + "\",\"device_id\":\"" + deviceID + "\"}");

            Serial.print("HTTP Response code: ");
            Serial.println(httpResponseCode);

            if (httpResponseCode == 200)
            //Allowed Turn on laser cutter
            {
                //Sending on message via 433MHz transmitter
                mySwitch.send(deviceOnMsg.c_str());

                //Show something on the screen "Welcome..."
                displayMessage("turning_on", deviceName);

                //Turn button LED on solid
                ledcWriteTone(deviceLEDChannel, 5000);

                //Make low high turn on noise
                ledcWriteTone(BUZZER_CHANNEL, 300);
                ledcWrite(BUZZER_CHANNEL, 50);
                delay(100);
                ledcWrite(BUZZER_CHANNEL, 0);
                delay(100);
                ledcWriteTone(BUZZER_CHANNEL, 1000);
                ledcWrite(BUZZER_CHANNEL, 50);
                delay(100);
                ledcWrite(BUZZER_CHANNEL, 0);

                //Update global device state
                if (deviceID == 0)
                {
                    device0State = 1;
                }
                else if (deviceID == 1)
                {
                    device1State = 1;
                }

                delay(2000);
            }
            else if (httpResponseCode == 401)
            //Card ID not authorised to use the laser cutters
            {
                //Show un-authorised on screen
                displayMessage("unauthorised");

                //Play low low buzzer sound
                ledcWriteTone(BUZZER_CHANNEL, 150);
                ledcWrite(BUZZER_CHANNEL, 50);
                delay(100);
                ledcWrite(BUZZER_CHANNEL, 0);
                delay(100);
                ledcWriteTone(BUZZER_CHANNEL, 150);
                ledcWrite(BUZZER_CHANNEL, 50);
                delay(100);
                ledcWrite(BUZZER_CHANNEL, 0);

                //Turn off button LED
                ledcWriteTone(deviceLEDChannel, 0);

                delay(2000);
            }
            else
            //Catch any error and reset
            //404 scanner_id not found
            //403 ESP_AUTH incorrect
            //406 Equipment was already on
            {
                //Show error on screen
                displayMessage("error", "", httpResponseCode);

                //Play low low buzzer sound
                ledcWriteTone(BUZZER_CHANNEL, 150);
                ledcWrite(BUZZER_CHANNEL, 50);
                delay(1000);
                ledcWrite(BUZZER_CHANNEL, 0);

                //Turn off button LED
                ledcWriteTone(deviceLEDChannel, 0);

                delay(2000);
            }

            // Free resources
            http.end();
            return;
        }
        else
        {
            displayMessage("connect_failed");
            Serial.println("WiFi Disconnected");
            reconnectWifi();
            return;
        }
    }
    else
    {
        //Turn button LED off
        ledcWriteTone(deviceLEDChannel, 0);
        //display invalid card
        displayMessage("invalid_card");
        delay(2000);
        return;
    }
}

void turnOff()
{
    displayMessage("connecting");
    if (WiFi.status() == WL_CONNECTED)
    {
        Serial.println("Wifi still connected");
        HTTPClient http;
        http.begin(api_host + turnoff_endpoint);
        http.addHeader("Content-Type", "application/json");
        int httpResponseCode = http.POST("{\"scanner_name\":\"" + scanner_name + "\",\"auth\":\"" + String(API_SECRET) + "\",\"device_id\":\"" + deviceID + "\"}");

        Serial.print("HTTP Response code: ");
        Serial.println(httpResponseCode);

        if (httpResponseCode == 200)
        //Successfully updated, db turn off laser cutter
        {
            //Sending off message via 433MHz transmitter
            mySwitch.send(deviceOffMsg.c_str());

            //Show turnign off message
            displayMessage("turning_off", deviceName);

            //Turn button LED off solid
            ledcWriteTone(deviceLEDChannel, 0);

            //Make high low turn off noise
            ledcWriteTone(BUZZER_CHANNEL, 1000);
            ledcWrite(BUZZER_CHANNEL, 50);
            delay(100);
            ledcWrite(BUZZER_CHANNEL, 0);
            delay(100);
            ledcWriteTone(BUZZER_CHANNEL, 300);
            ledcWrite(BUZZER_CHANNEL, 50);
            delay(100);
            ledcWrite(BUZZER_CHANNEL, 0);

            //Update global device state
            if (deviceID == 0)
            {
                device0State = 0;
            }
            else if (deviceID == 1)
            {
                device1State = 0;
            }

            delay(2000);
        }
        else
        //Catch any error and reset
        //404 scanner_id not found
        //403 ESP_AUTH incorrect
        {
            //Show error on screen
            displayMessage("error", "", httpResponseCode);

            //Play low low buzzer sound
            ledcWriteTone(BUZZER_CHANNEL, 150);
            ledcWrite(BUZZER_CHANNEL, 50);
            delay(1000);
            ledcWrite(BUZZER_CHANNEL, 0);

            //Turn off button LED
            ledcWriteTone(deviceLEDChannel, 0);

            delay(2000);
        }

        // Free resources
        http.end();
        return;
    }
    else
    {
        //show failed to connect
        displayMessage("connect_failed");
        Serial.println("WiFi Disconnected");
        reconnectWifi();
        return;
    }
}

bool updateDeviceStatus() //Sync function
{
    if (WiFi.status() == WL_CONNECTED)
    {
        HTTPClient http;
        http.begin(api_host + devicestatus_endpoint);
        http.addHeader("Content-Type", "application/json");
        int httpResponseCode = http.POST("{\"scanner_name\":\"" + scanner_name + "\"}");

        Serial.print("HTTP Response code: ");
        Serial.println(httpResponseCode);

        if (httpResponseCode == 200)
        //Successfully got data, read and update status if necessary
        {
            String payload = http.getString();
            JSONVar devices = JSON.parse(payload);
            Serial.println(payload);
            if (double(devices[0]["status"]) != device0State)
            {
                Serial.println(DEVICE0_NAME + " was out of sync and has been updated");
                device0State = double(devices[0]["status"]);
            }
            if (double(devices[1]["status"]) != device1State)
            {
                Serial.println(DEVICE1_NAME + " was out of sync and has been updated");
                device1State = double(devices[1]["status"]);
            }

            if (device0State == 1) //refresh plug and LED state for device 0
            {
                mySwitch.send(plug0OnMsg.c_str());
                ledcWriteTone(BUTTON0_LED_CHANNEL, 5000);
            }
            else
            {
                mySwitch.send(plug0OffMsg.c_str());
                ledcWriteTone(BUTTON0_LED_CHANNEL, 0);
            }

            if (device1State == 1) //refresh plug and LED state for device 1
            {
                mySwitch.send(plug1OnMsg.c_str());
                ledcWriteTone(BUTTON1_LED_CHANNEL, 5000);
            }
            else
            {
                mySwitch.send(plug1OffMsg.c_str());
                ledcWriteTone(BUTTON1_LED_CHANNEL, 0);
            }

            int inUse = device0State + device1State; //update main status display
            displayMessage("status", "", inUse);

            http.end();
            return true;
        }
        else
        {
            //Show error on screen
            displayMessage("update_error", "", httpResponseCode);

            //Play low low buzzer sound
            ledcWriteTone(BUZZER_CHANNEL, 150);
            ledcWrite(BUZZER_CHANNEL, 50);
            delay(1000);
            ledcWrite(BUZZER_CHANNEL, 0);

            delay(1500);
            http.end();
            return false;
        }
    }
    else
    {
        displayMessage("connect_failed");
        Serial.println("WiFi Disconnected");
        reconnectWifi();
        return false;
    }
}

void reconnectWifi()
{
    WiFi.disconnect();
    WiFi.begin(ssid);
    displayMessage("connecting");
    startMillis = millis();
    while (WiFi.status() != WL_CONNECTED)
    {
        currentMillis = millis();
        if (currentMillis - startMillis > wifiTimeout)
        {
            displayMessage("restarting");
            delay(500);
            ESP.restart();
        }
        delay(500);
        // do something on the screen
        Serial.print(".");
    }
    Serial.println("");
    Serial.println("WiFi connected");
    displayMessage("connected"); //display connected message on LCD
}
