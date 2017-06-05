# emar

##Build Instructions

1. `git clone https://github.com/khous/emar.git`
2. install nodejs (nodejs.org)
3. navigate to project root (where you cloned to)
4. run `npm install` from a command line
5. run `gulp build`
6. run `node server.js`
7. Open a browser and navigate to `localhost:1337
8. Comment out raspberry pi specific code. Currently there are three lines, one to require the serial port, one to record video and one to send data to the serial port

This runs the survey bot

##Build, Run CMS server

1. Install mongodb
2. Create a database called `emar`
3. Ensure this instance is running
4. Run `node cms-server.js`
5. Navigate to  localhost:1337/home
`
