browserOSC beta1
================

Desktop and Mobile Browser based OSC controller using socket.IO, and NodeJS.

Uses HTML5 Canvas and the Device Orientation API.

Requires node packages: node-osc, express, and socket.io

![example](http://i.imgur.com/ksZlWRG.png)

###socketServer.js
This is the nodeJS application that hosts the webserver and acts as the Socket.IO -> OSC bridge.

Edit the following line in socketServer.js to change the port the server listens on:
```javascript
server.listen(80);	
```
Edit the following line in socketServer.js to change the host and port of the OSC application
```javascript
var client = new osc.Client('127.0.0.1', 3333); 
```
###setupUI.js
This is where you create UI elements and set values for the overall interface.

Edit the first line in setupUI.js and change it to the hostName of your webserver, or socket.io will not make a connection to your nodeJS server.
```javascript
var hostName = "http://ip.address.or.DNS.host/";
```
To add controls to the page edit setupUI.js and use the `gui.AddElement()` function to add buttons.

The `gui.backgroundColor` and `gui.pageButtonSize` members are user facing and meant to be changed to your liking.  `gui.backgroundColor` sets the default background color of the canvas and accepts CSS text colors.  `gui.pageButtonSize` sets the size in pixels of the page buttons.  The page buttons are automatically generated and appear in the bottom left of the UI window.

####Creating UI Elements
```javascript
gui.addElement(new ToggleButton()
		.position(170,250).size(200,200)
		.color("rgb(128,128,255)")
		.oscAddress("/switch0")
		.label("toggle").page(0));
```
There are 5 UI Elements:
* **TouchSlider** Defaults to horizontal type, but it can be changed to vertical by calling the `isVertical()` method during construction of the element.
* **TiltSlider** This element acts like a mix between TouchSlider and ToggleButton. Once toggled on it uses the Device Orientation API to set the value of the element.  Horizontal mode uses the left and right tilt, while the Vertical mode responds to the forward and back tilt.
* **PushButton** When the button is pressed it sends a 1.0, and when it is released it sends a 0.0 to the specified OSC address related to the UI Element.
* **ToggleButton** When the button state is off and the button is pressed it sends a 1.0 to the specified OSC address and when it is on and the button is pressed it sends a 0.0
* **XYPad** Sends two values that correspond to the X and Y coordinates within the span of the element.  "/x" and "/y" are appended to the OSC address specified.

####Common methods
Each element shares common methods, and they are meant to be chained.

`position(x,y)` The x and y coordinates are the top-left corner coordinates of the UI element.

`size(x,y)`Set the width and height of the UI element.

`color(cssColor)`Accepts CSS color strings. ex. "white" or "rgb(32,64,255)"

`textColor(cssColor)`Accepts CSS color strings. ex. "white" or "rgb(32,64,255)"

`label(string)`Each UI element has a text label rendered within the element.

`textSize(px)`(optional method) The constructor of the element uses the dimensions to determine a default text size in pixels, but sometimes you will want them bigger or smaller.  Use this method to override the size in pixels.

`oscAddress(string)`When the UI Element is activated either through touch or tilt a message is sent from the browser using socket.io to the nodeJS application.  The nodeJS application then sends a message over OSC to the specified host using the address specified by calling this method.

`page(index)`Page 0 (zero) is the first page.  If you add additional pages to the UI it will add buttons to the bottom left of the browser window.  Empty pages are still given buttons.

####Unique Methods
Some UI elements have specific methods for setting the appearance.

`backgroundColor(cssColor)` Applies to the TouchSlider, TiltSlider, XYPad, and ToggleButton UI elements.  Instead of defaulting to the background color set by the `gui.backgroundColor` variable, you can set your own background color.  This is independent of the value indicator color of the element. 

`strokeColor(cssColor)` Applies to the TouchSlider and TiltSlider UI elements.  This sets an independent color for the outline of the element that is different from the value indicator color of the element.  

`isVertical()` Applies to the TouchSlider and TiltSlider UI elements.  A vertical Touchslider responds to the Y coordinate instead of the X to set the value of the slider.  The vertical TiltSlider uses the Forward/Backward tilt of the device when in vertical mode.

