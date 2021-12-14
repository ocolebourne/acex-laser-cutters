
#include <U8g2lib.h>

U8G2_SSD1306_128X64_NONAME_F_HW_I2C u8g2(U8G2_R0, 16, 15, 4);

//RFID_scanner
#include <SPI.h>
#include <MFRC522.h>

#define RST_PIN 27
#define SS_PIN 5

MFRC522 mfrc522(SS_PIN, RST_PIN); // Create MFRC522 instance

void setup()
{
    Serial.begin(115200);

    u8g2.begin();
    u8g2.setFontRefHeightExtendedText();
    u8g2.setDrawColor(1);
    u8g2.setFontPosTop();
    u8g2.setFontDirection(0);


    //RFID Setup
    SPI.begin();                       // Init SPI bus
    mfrc522.PCD_Init();                // Init MFRC522
    mfrc522.PCD_DumpVersionToSerial(); // Show details of PCD - MFRC522 Card Reader details
}

void loop()
{

    // u8g2.clearBuffer();
    // u8g2.setFont(u8g2_font_helvB14_te);
    // u8g2.drawStr(5, 25, "Connecting...");
    // u8g2.drawStr(22, 18, "your card");
    // u8g2.setFont(u8g2_font_open_iconic_all_4x_t);
    // u8g2.drawStr(49, 34, "T"); //h is check T is audio sign W is forbidden
    // u8g2.sendBuffer();

    // delay(2000);
    // u8g2.clearBuffer();
    // u8g2.setFont(u8g2_font_helvB14_te);
    // u8g2.drawStr(10, 0, "Please scan");
    // u8g2.drawStr(22, 18, "your card");
    // u8g2.setFont(u8g2_font_open_iconic_all_4x_t);
    // u8g2.drawStr(49, 34, "T"); //h is check T is audio sign W is forbidden
    // u8g2.sendBuffer();

    // delay(2000);
    // u8g2.clearBuffer();

    // u8g2.setFont(u8g2_font_helvB14_te);
    // u8g2.drawStr(18, 5, "Failed to");
    // u8g2.drawStr(5, 37, "connect");
    // u8g2.setFont(u8g2_font_open_iconic_all_4x_t);
    // u8g2.drawStr(88, 28, "W"); //h is check T is audio sign W is forbidden
    // u8g2.sendBuffer();

    // u8g2.setFont(u8g2_font_helvB14_te);
    // u8g2.drawStr(12, 5, "Invalid card");
    // u8g2.setFont(u8g2_font_open_iconic_all_4x_t);
    // u8g2.drawStr(49, 28, "W"); //h is check T is audio sign W is forbidden

    // u8g2.setFont(u8g2_font_helvB14_te);
    // u8g2.drawStr(5, 5, "Unauthorised");
    // u8g2.setFont(u8g2_font_open_iconic_all_4x_t);
    // u8g2.drawStr(49, 28, "W"); //h is check T is audio sign W is forbidden

    // u8g2.setFont(u8g2_font_helvB14_te);
    // const char *stringg = "Error:" + 404;
    // u8g2.drawStr(15, 5, "Error:");
    // u8g2.setCursor(80, 5);
    // u8g2.print(404);
    // u8g2.setFont(u8g2_font_open_iconic_all_4x_t);
    // u8g2.drawStr(49, 28, "W"); //h is check T is audio sign W is forbidden

    // u8g2.setFont(u8g2_font_helvB14_te);
    // u8g2.drawStr(16, 5, "Connected");
    // u8g2.setFont(u8g2_font_open_iconic_all_4x_t);
    // u8g2.drawStr(49, 28, "s"); //s is check T is audio sign W is forbidden

    // u8g2.setFont(u8g2_font_helvB14_te);
    // u8g2.drawStr(12, 0, "Turning off");
    // u8g2.setCursor(30, 19);
    // u8g2.print("VLS3.50");
    // u8g2.setCursor(0, 0);
    // u8g2.setFont(u8g2_font_open_iconic_all_4x_t);
    // u8g2.drawStr(49, 34, "s"); //s is check T is audio sign W is forbidden
    // u8g2.setFont(u8g2_font_helvB14_te);
    // u8g2.drawStr(15, 0, "AceX Laser");
    // u8g2.drawStr(35, 19, "Cutters");
    // u8g2.setCursor(30, 48);
    // u8g2.print(1 + 1);
    // u8g2.setCursor(0, 0);
    // u8g2.drawStr(47, 48, "in use");
    // //s is check T is audio sign W is forbidden

    // // Delay.

    // u8g2.sendBuffer();

    if (mfrc522.PICC_IsNewCardPresent()) //add a timeout
    {
        // nothing
        u8g2.clearBuffer();
        u8g2.setFont(u8g2_font_helvB14_te);
        u8g2.drawStr(0, 0, "Scanned");
        u8g2.sendBuffer();
        Serial.println(F("Scanned"));
        unsigned long uid = getID();

        if (uid != -1)
        {
            String uid_string = String(uid);
            if (uid_string.length() == 9)
            {
                uid_string = '0' + uid_string;
            }
            Serial.print("Card detected, UID: ");
            Serial.println(uid_string);
            // u8g2.drawStr(0, 20, "got id");
            // u8g2.sendBuffer();
            delay(2000);
        }
        else
        {

            Serial.println("Error");
            // u8g2.drawStr(0, 20, "Error");
            // u8g2.sendBuffer();
            delay(2000);
        }
    }
}

unsigned long getID()
{
    if (!mfrc522.PICC_ReadCardSerial())
    { //Since a PICC placed get Serial and continue
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