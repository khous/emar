//
//EMAR V2 Eyes and Mp3
//Kristine Kohlhepp
//June 2016
//Code written with reference to Arduino Master Writer Tutorial



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
                            
int on = 255;
int off = 0;
unsigned long currentMillis = 0;
unsigned long previousMillis = 0;
int currentEyes[8][8]; // records current eyes for blinking
// End Neopixel setup-----------------------
// Neopixel functions-----------------------
//happy
void happy() {
  int eyes[8][8] = {
                    {off, off, on, on, on, on, off, off},
                    {off, on, on, on, on, on, on, off},
                    {on, on, on, off, off, off, on, on},
                    {on, on, on, off, off, off, on, on},
                    {on, on, on, on, on, on, on, on},
                    {on, on, on, on, on, on, on, on},
                    {off, on, on, on, on, on, on, off},
                    {off, off, off, off, off, off, off, off}
  };
  memcpy(currentEyes, eyes, 8*8*sizeof(int));
  setRow();
  matrix.show();
}
//happy
void happy2() {
  int eyes[8][8] = {
                    {off, off, on, on, on, on, off, off},
                    {off, on, on, on, on, on, on, off},
                    {on, on, on, off, off, on, on, on},
                    {on, on, on, off, off, on, on, on},
                    {on, on, on, off, off, on, on, on},
                    {on, on, on, on, on, on, on, on},
                    {off, on, on, on, on, on, on, off},
                    {off, off, off, off, off, off, off, off}
  };
  memcpy(currentEyes, eyes, 8*8*sizeof(int));
  setRow();
  matrix.show();
}
//happy v2 11/20/2016
void happy3() {
  int eyes[8][8] = {
                   {off, off, off, on, on, off, off, off},
                   {off, off, on, on, on, on, off, off},
                   {off, on, on, on, on, on, on, off},
                   {on, on, on, off, off, on, on, on},
                   {on, on, off, off, off, off, on, on},
                   {on, off, off, off, off, off, off, on},
                   {off, off, off, off, off, off, off, off},
                   {off, off, off, off, off, off, off, off}
  };
  memcpy(currentEyes, eyes, 8*8*sizeof(int));
  setRow();
  matrix.show();
}
//happy v2 11/20/2016
void happy4() {
    int eyes[8][8] = {
                      {off, off, off, off, off, off, off, off},
                      {off, off, off, on, on, off, off, off},
                      {off, off, on, on, on, on, off, off},
                      {off, on, on, on, on, on, on, off},
                      {on, on, on, off, off, on, on, on},
                      {on, on, off, off, off, off, on, on},
                      {on, off, off, off, off, off, off, on},
                      {off, off, off, off, off, off, off, off}
    };
  memcpy(currentEyes, eyes, 8*8*sizeof(int));
  setRow();
  matrix.show();
}
//sad
void sad() {
  int eyes[8][8] = {
                     {off, off, off, off, off, off, off, off},
                    {off, off, off, off, off, off, off, off},
                    {on, off, off, off, off, off, off, on},
                    {on, on, off, off, off, off, on, on},
                    {on, on, on, off, off, on, on, on},
                    {off, on, on, on, on, on, on, off},
                    {off, off, on, on, on, on, off, off},
                    {off, off, off, on, on, off, off, off}
  };
  memcpy(currentEyes, eyes, 8*8*sizeof(int));
  setRow();
  matrix.show();
}
//down
void down() {
  int eyes[8][8] = {
                    {off, off, on, on, on, on, off, off},
                    {off, on, on, on, on, on, on, off},
                    {on, on, on, on, on, on, on, on},
                    {on, on, on, on, on, on, on, on},
                    {on, on, on, on, on, on, on, on},
                    {on, on, on, off, off, on, on, on},
                    {off, on, on, off, off, on, on, off},
                    {off, off, on, on, on, on, off, off}
  };
  memcpy(currentEyes, eyes, 8*8*sizeof(int));
  setRow();
  matrix.show();
}
//blink
void blink() {
  int eyes[8][8] = {
                    {off, off, off, off, off, off, off, off},
                    {off, off, off, off, off, off, off, off},
                    {off, on, on, on, on, on, on, off},
                    {on, on, on, on, on, on, on, on},
                    {off, on, on, on, on, on, on, off},
                    {off, off, off, off, off, off, off, off},
                    {off, off, off, off, off, off, off, off},
                    {off, off, off, off, off, off, off, off}
  };
  memcpy(currentEyes, eyes, 8*8*sizeof(int));
  setRow();
  matrix.show();
}
//small eyes
void small() {
  int eyes[8][8] = {
                    {off, off, off, off, off, off, off, off},
                    {off, off, on, on, on, on, off, off},
                    {off, on, on, on, on, on, on, off},
                    {off, on, on, off, off, on, on, off},
                    {off, on, on, off, off, on, on, off},
                    {off, on, on, on, on, on, on, off},
                    {off, off, on, on, on, on, off, off},
                    {off, off, off, off, off, off, off, off}
  };
  memcpy(currentEyes, eyes, 8*8*sizeof(int));
  setRow();
  matrix.show();
}
//big eyes
void neutral() {
  int eyes[8][8] = {
                    {off, off, on, on, on, on, off, off},
                    {off, on, on, on, on, on, on, off},
                    {on, on, on, on, on, on, on, on},
                    {on, on, on, off, off, on, on, on},
                    {on, on, on, off, off, on, on, on},
                    {on, on, on, on, on, on, on, on},
                    {off, on, on, on, on, on, on, off},
                    {off, off, on, on, on, on, off, off}
  };
  memcpy(currentEyes, eyes, 8*8*sizeof(int));
  setRow();
  matrix.show();
}
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

//eye combos
void intro(){
    neutral();
    delay(500);
    blink();
    delay(200);
    neutral();
    delay(200);
    blink();
    delay(200);
    neutral();
}
void happiness(){
    happy4(); 
    delay(200);
    happy3();
    delay(200);
    happy4();
    delay(200);
    happy3();
    delay(200);
    happy4();
    delay(200);
    happy3();
}
void questioning() {
    small();
    delay(400);
    neutral();
    delay(400);
    small();  
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
// End Neopixel functions-------------------------
void setup() {
  // Neopixel setup
  matrix.begin();
  matrix.setBrightness(10);

  // Slave setup
  Serial.begin(9600);
}
void loop() {
  currentMillis = millis();
  
  if (Serial.available()) {
    receiveEvent(Serial.read() - '0');
  }
  delay(500);
  
  loopBlinking();
}
void receiveEvent(int x) {

  // happy eye combo
  if (x == 1) {
    happiness();
  }
  // blink then question
  else if (x == 2) {
    blinking();
    delay(800);
    questioning();
  }
  // No
  else if (x == 3) {
    blinking();
    delay(800);
    sad();
    delay(200);
    small();
    delay(3000);
    neutral();
  }
  // Stress Question
  else if (x == 4) {
    neutral();
  }
  // Super Stressed
  else if (x == 5) {
    blinking();
    delay(800);
    sad();
  }
  // Pretty Stressed
  else if (x == 6) {
    blinking();
    delay(200);
    sad();
  }
  // Not too Stressed
  else if (x == 7) {
    blinking();
    questioning();
  }
  // Almost no Stress
  else if (x == 8) {
    blinking();
    happiness();
  }
  // Close 1
  else if (x == 9) {
    delay(2500);
    
    blinking();
    happiness();
  }
  // default eyes
  else if (x == 10) {
    neutral();
  }
}

void loopBlinking() {
  if ((currentMillis - previousMillis) > 10000) {
      previousMillis = currentMillis;
      blinking();
  }
}