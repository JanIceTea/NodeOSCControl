browserOSC beta1
================
Installation:

1. Install node:
https://nodejs.org/en/download/

2. Go to the terminal and change to the directory: browserOSC

3. In the terminal run: npm install

4. Adjust the settings in socketServer.js. Change the following line to match your osc client's ip address. If you're running it on the same machine you don't need to change it. It will be the local host
var client = new osc.Client('127.0.0.1', 57120);

5. Set the ip address of your machine in ui.html:
var hostName = "http://192.168.2.34:8080";

5. run node with:
node socketServer.js

6. Open SuperCollider and open the test code file (osc_tests.scd).

7. Open a browser (on your mobile) and open the ip you put in ui.html. Note that currently the server runs on port 8080. You should now see the a black screen. Due to a bug all elements are initially hidden. Tap around to find them. On top is a button and then 2 sliders.
In the terminal you should see that a client has connected.

8. Check setupUI.js - there you can design your interface. Note that it currently uses skeleton as a css library and there are some issues with the sizing of the canvas.

Known issues:
Initially all elements in the browser are hidden! Touch them and they will appear.
The layout on the phone needs some work.
On the mobile phone the sliders don't always react.

Todo:
Code clean up. Split code into separate files.
Receive osc and set sliders etc. - this has been prepared but it's probably not working yet.
