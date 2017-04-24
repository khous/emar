#Neopixel Add On

This directory will hold the files necessary to make the neopixel add on. We are looking for a really simple API that
accepts a 2d array of values and pipes those values to the raspi neopixel library.

For prototyping purposes, the NeoPixel can be controlled by the Pi through the Python console when connected through the serial port.

First, with the console find the proper connected serial port with "ls /dev/tty*"
*Likely named /dev/ttyACM0 or with that naming convention

In the Python shell,
  1. import serial
  2. ser = serial.Serial('/dev/ttyACM0', 9600)

Because of serial writing limitations, the Arduino will only accept information in the format of a string of 64 numbers, each number representing a single eye pixel.
(e.g. '1234505120410520402502040135021040502104010520340214021034102435')
The number codes are:
0 = Off (no light)
1 = Blue
2 = White
3 = Yellow
4 = Orange
5 = Red

Write the string to the Arduino like so to control respective eyes,
  ser.write('1234505120410520402502040135021040502104010520340214021034102435')
