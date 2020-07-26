~ipAddress = "192.168.0.128";
~ipAddress = "169.254.212.204";
b = NetAddr.new("192.168.0.255", 3001); // create the NetAddr
b = NetAddr.new("10.41.101.200", 3001); // create the NetAddr

b.sendMsg("/loadayout", "http://192.168.0.128/~jfalkenstein/layout_full.json");


(
b = NetAddr.new("192.168.2.255", 3001); // create the NetAddr
NetAddr.broadcastFlag_(true);
~osc = OSCresponderNode(nil, '/readyToSend', {|time, resp, msg|
	b.sendMsg("/loadLayout", "http://10.41.101.206
	/~jfalkenstein/layout_full.json");
}).add;

~osc2= OSCresponderNode(nil, '/didBecomeActive', {|time, resp, msg|
	b.sendMsg("/loadLayout", "http://10.41.101.206/~jfalkenstein/layout_full.json", "123");
}).add;
OSCFunc.trace(true); // Turn posting on
)


//test and docu
b = NetAddr.new("127.0.0.1", 3001); // create the NetAddr
b = NetAddr.new("192.168.2.1", 3001); // create the NetAddr

//broadcast!
b = NetAddr.new("fe80::23:7e24:d767:0d4", 3001); // create the NetAddr


(
b = NetAddr.new("10.41.101.30", 3001); // create the NetAddr
NetAddr.broadcastFlag_(true);

f = File.open("/Users/jfalkenstein/Projects_2014/loos_app/sc_code/test_setup.json", "r");
c = f.readAllString;
f.close;

b.sendMsg("/newLayout", c);
b.sendMsg("/sendHostAddress", ~ipAddress);
)

(
f = File.open("/Users/jfalkenstein/Projects_2014/loos_app/sc_code/prototypes.json", "r");
c = f.readAllString;
f.close;

b.sendMsg("/prototypes", c);
)

(
f = File.open("/Users/jfalkenstein/Projects_2014/loos_app/sc_code/layout_1.json", "r");
c = f.readAllString;
f.close;

b.sendMsg("/newLayout", c);
)

//load layout from url
b.sendMsg("/loadLayout", "http://192.168.2.9/~jfalkenstein/layout_1.json");

b.sendMsg("/urlToLoadOnBegin", "http://192.168.2.9/~jfalkenstein/layout_1.json");

//remove everything from the layout
b.sendMsg("/clearLayout");

//add a message id as 2nd argument so that message are only received once (in case it needs to be sent twice)

b.sendMsg("/uiObjects/default/label", "{\"text\": \"hallo echt super\"}", "xy2z");
b.sendMsg("/uiObjects/layout1/label", "{\"backgroundColor\": \"blackColor\"}");
b.sendMsg("/uiObjects/layout1/label", "{\"textColor\": \"blueColor\"}");
b.sendMsg("/uiObjects/default/label", "{\"fontSize\": \"42\"}");


b.sendMsg("/uiObjects/default/slider1", "{\"value\": \"0.5\"}", "xy2z");

b.sendMsg("/uiObjects/default/slider3/setValue:", 0.9);

b.sendMsg("/uiObjects/default/slider2/removeFromSuperview");



//remove a ui object by adding a 'remove' to the path
b.sendMsg("/uiObjects/default/slider1/remove");

//set host to send message to (me)

b.sendMsg("/sendHostAddress", "127.0.0.1");

//reset all message ids in the clients
b.sendMsg("/resetMessageIDs");

b.sendMsg("/sendHostAddress", "127.0.0.1");


OSCFunc.trace(true); // Turn posting on
OSCFunc.trace(false); // Turn posting off


~osc = OSCresponderNode(nil, '/readyToSend', {|time, resp, msg|
	b.sendMsg("/loadLayout", "http://192.168.2.9/~jfalkenstein/layout_full.json");
}).add;

~osc2= OSCresponderNode(nil, '/didBecomeActive', {|time, resp, msg|
	b.sendMsg("/loadLayout", "http://192.168.2.9/~jfalkenstein/layout_full.json");
}).add;


b.sendMsg("/sendHostAddress", "192.168.2.9");
