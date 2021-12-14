//Wifi
#include "esp_wpa2.h"
#include <WiFi.h>
#include <HTTPClient.h>
#include <Arduino_JSON.h>
#include "credentials.h"

const char *ssid = SSID;
String api_host = "https://acex-iot.web.app/api/";
String sensor_id = "sensor1";

String gas_endpoint = "gasreport";

//LEDs
#define GREEN_LED 27
#define RED_LED 4

//Gas Sensor
#define GAS_ANALOG 35
#define GAS_DIGITAL 33

//Live time and stored time
#include <ESP32Time.h>
#include "time.h"

ESP32Time rtc;

const char *ntpServer = "pool.ntp.org";
const long gmtOffset_sec = 0;
const int daylightOffset_sec = 3600;
struct tm timeinfo;

//Memory for if Wifi drops
#define STACK_LENGTH 500

int storedValuesStack[STACK_LENGTH];
String storedDTStack[STACK_LENGTH];
int stackCounter = 0;

//Misc variables
int sampleNo = 10;
int samplePeriod = 10000;
int sampleInterval = 30;
int startSecond;
unsigned long currentEpoch;

int sampleTotal;
int currNoSamples;
int sampleAverage;
int gasReading;
String sampleDateTime;

void setup()
{
    Serial.begin(115200);

    //IO Setup
    pinMode(GREEN_LED, OUTPUT);
    pinMode(RED_LED, OUTPUT);

    pinMode(GAS_DIGITAL, INPUT);

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

    bool connectLED = true;
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        digitalWrite(RED_LED, connectLED); //blink red LED while connecting to wifi
        connectLED = !connectLED;
        Serial.print(".");
    }

    Serial.println("");
    Serial.println("WiFi connected");

    //Time setup
    configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
    setLocalTime();

    digitalWrite(GREEN_LED, HIGH); //Show green LED for 2 seconds once connected
    digitalWrite(RED_LED, LOW);
    delay(2000);
    digitalWrite(GREEN_LED, LOW);
}

void loop()
{
    startSecond = rtc.getSecond();
    while (startSecond % sampleInterval != 0) //Wait until interval (30seconds) has passed
    {
        delay(100);
        startSecond = rtc.getSecond();
    }
    sampleDateTime = rtc.getTime("%Y-%m-%dT%H:%M:%SZ");

    digitalWrite(RED_LED, HIGH); //Shine red and green of RGB LED while sampling
    digitalWrite(GREEN_LED, HIGH);
    gasReading = take10SecondSample();

    sendReading(gasReading, sampleDateTime);
}

void sendReading(int gasAnalogReading, String currentDT)
{

    String gas_values = "[";
    gas_values = gas_values + "{\"value\":" + gasAnalogReading + ",\"dt\":\"" + currentDT + "\"}";

    if (stackCounter > 0)
    {
        for (int i = 0; i < stackCounter; i++)
        {
            gas_values = gas_values + ", {\"value\":" + storedValuesStack[i] + ",\"dt\":\"" + storedDTStack[i] + "\"}";
        }
    }

    gas_values = gas_values + "]";

    Serial.println(gas_values);

    if (WiFi.status() == WL_CONNECTED)
    {
        HTTPClient http;
        http.begin(api_host + gas_endpoint);
        http.addHeader("Content-Type", "application/json");
        int httpResponseCode = http.POST("{\"auth\":\"" + String(API_SECRET) + "\", \"values\":" + gas_values + ", \"sensor_id\":\"" + sensor_id + "\"}");

        Serial.print("HTTP Response code: ");
        Serial.println(httpResponseCode);

        if (httpResponseCode == 200)
        {
            digitalWrite(RED_LED, LOW); //Turn off red LED - Green LED showing success
            clearStorage();
            delay(2000);
            digitalWrite(GREEN_LED, LOW); //Turn off green LED
        }
        else
        {
            digitalWrite(GREEN_LED, LOW); //Turn off green LED - Red LED showing failure
            storeValue(gasAnalogReading, currentDT);
        }
    }
    else
    {
        //not connected
        digitalWrite(GREEN_LED, LOW); //Turn off green LED - Red LED showing failure
        storeValue(gasAnalogReading, currentDT);
        WiFi.reconnect();
    }
}

void storeValue(int newValue, String newDt)
{
    if (stackCounter > STACK_LENGTH)
    {
        Serial.println("STACK EXCEEDED");
        digitalWrite(RED_LED, HIGH);
    }
    else
    {
        storedValuesStack[stackCounter] = newValue;
        storedDTStack[stackCounter] = newDt;
        Serial.println("Error uploading, added to stack");

        digitalWrite(RED_LED, LOW);
        digitalWrite(GREEN_LED, HIGH);
        delay(500);
        digitalWrite(RED_LED, HIGH);
        digitalWrite(GREEN_LED, LOW);
        delay(500);
        digitalWrite(RED_LED, LOW);
        digitalWrite(GREEN_LED, HIGH);
        delay(500);
        digitalWrite(RED_LED, HIGH);
        digitalWrite(GREEN_LED, LOW);
        delay(500);
        digitalWrite(RED_LED, LOW);
    }
    stackCounter++;
}
void clearStorage()
{
    for (int i = 0; i <= stackCounter; i++)
    {
        storedValuesStack[i] = 0;
        storedDTStack[i] = "";
    }
    stackCounter = 0;
}

void setLocalTime()
{
    struct tm timeinfo;
    if (!getLocalTime(&timeinfo))
    {
        Serial.println("Failed to obtain time");
        return;
    };
    rtc.setTimeStruct(timeinfo);
}

int take10SecondSample()
{
    Serial.println("taking sample...");
    currNoSamples = 0;
    sampleTotal = 0;
    while (currNoSamples < sampleNo)
    {
        currNoSamples += 1;
        sampleTotal += analogRead(GAS_ANALOG);
        delay(samplePeriod / sampleNo);
    }
    Serial.println(sampleTotal);
    sampleAverage = sampleTotal / sampleNo;
    Serial.println("Gas reading: " + sampleAverage);
    return sampleAverage;
}
