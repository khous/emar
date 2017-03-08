#Neopixel Add On

This directory will hold the files necessary to make the neopixel add on. We are looking for a really simple API that
accepts a 2d array of values and pipes those values to the raspi neopixel library.

For prototyping purposes, the NeoPixel can be controlled by the Pi through the Python console when connected through the serial port.

First, with the console find the proper connected serial port with "ls /dev/tty*"
*Likely named /dev/ttyACM0 or with that naming convention

In the Python shell,
  1. import serial
  2. ser = serial.Serial('/dev/ttyACM0', 9600)

And then write a bit to the Arduino like so to control respective eyes,
  ser.write('1')
