#define BUZZER_PIN 14
#define BUZZER_CHANNEL 0

#define BUTTON_LED_CHANNEL 1
#define BUTTON_LED_PIN 32

#define BUTTON_PIN 26
#define BUTTON2_LED_CHANNEL 2
#define BUTTON2_LED_PIN 33

#define BUTTON2_PIN 25

#define TRANS_1 2  //B on
#define TRANS_2 21 //B off
#define TRANS_3 22 //C on
#define TRANS_4 17 //C off

#include <RCSwitch.h>

String PLUGA_ON = "000010111101000101111100";
String PLUGA_OFF = "000010111101000101110100";

String PLUGB_ON = "000010111101000101111010";
String PLUGB_OFF = "000010111101000101110010";

RCSwitch mySwitch = RCSwitch();

void setup()
{
    Serial.begin(115200);
    ledcSetup(BUZZER_CHANNEL, 2000, 8);
    ledcAttachPin(BUZZER_PIN, BUZZER_CHANNEL);

    ledcSetup(BUTTON_LED_CHANNEL, 0, 4);
    ledcAttachPin(BUTTON_LED_PIN, BUTTON_LED_CHANNEL);
    ledcWriteTone(BUTTON_LED_CHANNEL, 0);
    ledcSetup(BUTTON2_LED_CHANNEL, 0, 4);
    ledcAttachPin(BUTTON2_LED_PIN, BUTTON2_LED_CHANNEL);
    ledcWriteTone(BUTTON2_LED_CHANNEL, 0);

    pinMode(BUTTON_PIN, INPUT_PULLUP);
    pinMode(BUTTON2_PIN, INPUT_PULLUP);
    // digitalWrite(BUTTON_PIN, HIGH);

    // pinMode(1, FUNCTION_3);
    pinMode(TRANS_1, OUTPUT);
    pinMode(TRANS_2, OUTPUT);
    pinMode(TRANS_3, OUTPUT);
    pinMode(TRANS_4, OUTPUT);

    // Transmitter is connected to Arduino Pin #10
    mySwitch.enableTransmit(2);

    // Optional set protocol (default is 1, will work for most outlets)
    mySwitch.setProtocol(1);

    // Optional set pulse length.
    mySwitch.setPulseLength(200);

    // Optional set number of transmission repetitions.
    mySwitch.setRepeatTransmit(15);
}

void loop()
{

    /* Same switch as above, but using binary code */
    mySwitch.send(PLUGA_ON.c_str());
    Serial.println("A on");
    delay(1000);

    mySwitch.send(PLUGA_OFF.c_str());
    delay(2000);

    mySwitch.send(PLUGB_ON.c_str());
    Serial.println("B on");
    delay(1000);
    mySwitch.send(PLUGB_OFF.c_str());
    delay(2000);
    // digitalWrite(TRANS_1, HIGH);
    // delay(50);
    // digitalWrite(TRANS_1, LOW);

    // Serial.print("B");
    // delay(3000);
    // digitalWrite(TRANS_2, HIGH);
    // delay(50);
    // digitalWrite(TRANS_2, LOW);

    // delay(3000);

    // digitalWrite(TRANS_3, HIGH);
    // delay(50);
    // digitalWrite(TRANS_3, LOW);
    // Serial.print("C");

    // delay(3000);
    // digitalWrite(TRANS_4, HIGH);
    // delay(50);
    // digitalWrite(TRANS_4, LOW);

    // delay(3000);
    // delay(2500);
    // buttonWait();
    // ledcWriteTone(BUZZER_CHANNEL, 300);
    // ledcWrite(BUZZER_CHANNEL, 50);
    // delay(100);
    // ledcWrite(BUZZER_CHANNEL, 0);

    // delay(100);

    // ledcWriteTone(BUZZER_CHANNEL, 1000);
    // ledcWrite(BUZZER_CHANNEL, 50);
    // delay(100);
    // ledcWrite(BUZZER_CHANNEL, 0);

    // delay(1000);

    // ledcWriteTone(BUZZER_CHANNEL, 2000);
    // ledcWrite(BUZZER_CHANNEL, 50);
    // delay(100);
    // ledcWrite(BUZZER_CHANNEL, 0);

    // delay(100);

    // ledcWriteTone(BUZZER_CHANNEL, 150);
    // ledcWrite(BUZZER_CHANNEL, 50);
    // delay(100);
    // ledcWrite(BUZZER_CHANNEL, 0);

    // delay(2000);

    // ledcWriteTone(BUTTON_LED_CHANNEL, 1);
    // delay(2000);
    // ledcWriteTone(BUTTON_LED_CHANNEL, 0);

    // delay(3000);

    // ledcWriteTone(BUTTON2_LED_CHANNEL, 1);
    // delay(2000);
    // ledcWriteTone(BUTTON2_LED_CHANNEL, 0);

    // delay(3000);

    // ledcWriteTone(BUTTON_LED_CHANNEL, 5000);

    // delay(3000);
}

int buttonWait()
{
    int button1State = 0;
    int button2State = 0;
    while (1)
    {
        button1State = digitalRead(BUTTON_PIN);
        if (button1State == LOW)
        {
            Serial.println("pressed");
            return 1;
        }
        button2State = digitalRead(BUTTON2_PIN);
        if (button2State == LOW)
        {
            Serial.println("pressed");
            return 1;
        }
    }
}