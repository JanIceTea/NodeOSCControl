browserOSC beta1
================
Installation:

1. Install node:
https://nodejs.org/en/download/

2. Go to the terminal and change to the directory: browserOSC

3. In the terminal run: npm install

4. Adjust the settings in socketServer.js. Change the following line to match your ip address.
var client = new osc.Client('192.168.2.8', 57120);

5. run node with:
node socketServer.js

6. Open SuperCollider and open the test code file.

7. On your mobile go to the browser and open the ip you put in the osc.Client

8. Try running some of the commands in SuperCollider and see if you get anything in/out from the phone browser.
