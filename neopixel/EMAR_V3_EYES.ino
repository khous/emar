//
//EMAR V2 Eyes
//Joshua Yao
//April 2017



// Neopixel setup-----------------------------
#include <Adafruit_GFX.h>
#include <Adafruit_NeoMatrix.h>
#include <Adafruit_NeoPixel.h>
#include <Wire.h>
#define PIN 6
Adafruit_NeoMatrix matrix = Adafruit_NeoMatrix(8, 16, PIN,
                            NEO_MATRIX_BOTTOM     + NEO_MATRIX_RIGHT +
                            NEO_MATRIX_ROWS + NEO_MATRIX_PROGRESSIVE,
                            NEO_GRB            + NEO_KHZ800);
                            
unsigned long currentMillis = 0;
unsigned long previousMillis = 0;
int currentEyes[8][8]; // records current eyes for blinking
int eyesCalled[8][8]; // eye array sent in from serial


// End Neopixel setup-----------------------
// Neopixel functions-----------------------

void setRow() {
  for (int i = 0; i < 8; i++) {
    int val = currentEyes[0][i];
    for (int j = 0; j < 8; j++) {
      val = currentEyes[j][i];
      matrix.drawPixel(i, j, val);
      matrix.drawPixel(i, 8+j, val);
    }
  }
}

void blinking() {
   for (int i = 0; i < 8; i++) {
       matrix.drawLine(0, i, 7, i, off);
       matrix.drawLine(0, i + 8, 7, i + 8, off);
       matrix.show();
       delay(25);
   }
   for (int row = 7; row >= 0; row--) {
      for (int col = 0; col < 8; col++) {
        int val = currentEyes[row][col];
        matrix.drawPixel(col, row, val);
        matrix.drawPixel(col, row + 8, val);
      }
      matrix.show();
      delay(25);
   }
}

void receiveEvent() {
  memcpy(currentEyes, eyesCalled, 8*8*sizeof(int));
  setRow();
  matrix.show();
}

void resetStoredEyes() {
   for (int row = 0; row < 8; row++) {
    for (int col = 0; col < 8; col++) {
      eyesCalled[row][col] = 0;
    }
  }
  receiveEvent();
}

void loopBlinking() {
  if ((currentMillis - previousMillis) > 10000) {
      previousMillis = currentMillis;
      blinking();
  }
}

// End Neopixel functions-------------------------

void setup() {
  // Neopixel setup
  matrix.begin();
  matrix.setBrightness(10);

  // Slave setup
  Serial.begin(9600);
  Serial.println("started sketch");
}
void loop() {
  currentMillis = millis();

  // reads in data from serial, expects format 101010101011, 1 being light on, 0 being light off
  if (Serial.available()) {
    delay(1); // allow input buffer to fill
    resetStoredEyes();
    for (int row = 0; row < 8; row++) {
      for (int col = 0; col < 8; col++) {
        if (Serial.available()) {
          int storedByte = (Serial.read() - '0'); // convert ascii to int
          if (storedByte == 1) { // convert on to 255
            storedByte = 255;
          } else if (storedByte == 2) {
            storedByte = -1;
          } else if (storedByte == 3) {
            storedByte = -255;
          } else if (storedByte == 4) {
            storedByte = -1020;
          } else if (storedByte == 5) {
            storedByte = -2040;
          }
          Serial.println(storedByte);
          eyesCalled[row][col] = storedByte;
        }
      }
    }
    while (Serial.available()) { // clear serial buffer
      Serial.read();
    }
    receiveEvent();
  }
  delay(500);
  
  loopBlinking();
}
