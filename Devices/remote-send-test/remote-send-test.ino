/*
  Example for different sending methods
  
  https://github.com/sui77/rc-switch/
  
*/

#include <RCSwitch.h>

#define PLUGA_ON "000010111101000101111100"
#define PLUGA_OFF "000010111101000101110100"

#define PLUGB_ON "000010111101000101111010"
#define PLUGB_OFF "000010111101000101110010"

RCSwitch mySwitch = RCSwitch();

void setup()
{

    Serial.begin(9600);

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
    // digitalWrite(8, HIGH);
    // delay(500);
    // digitalWrite(8, LOW);
    // delay(2000);
    //   /* See Example: TypeA_WithDIPSwitches */
    //   mySwitch.switchOn("11111", "00010");
    //   delay(1000);
    //   mySwitch.switchOff("11111", "00010");
    //   delay(1000);

    //   /* Same switch as above, but using decimal code */
    //   mySwitch.send(5393, 24);
    //   delay(1000);
    //   mySwitch.send(5396, 24);
    //   delay(1000);

    /* Same switch as above, but using binary code */
    mySwitch.send("000010111101000101111100");
    Serial.println("A on");
    delay(1000);

    mySwitch.send(PLUGA_OFF);
    delay(2000);

    mySwitch.send(PLUGB_ON);
    Serial.println("B on");
    delay(1000);
    mySwitch.send(PLUGB_OFF);
    delay(2000);

    //   /* Same switch as above, but tri-state code */
    //   mySwitch.sendTriState("00000FFF0F0F");
    //   delay(1000);
    //   mySwitch.sendTriState("00000FFF0FF0");
    //   delay(1000);
}