~ipAddress = "192.168.0.128";
(
b = NetAddr.new("192.168.2.255", 3001); // create the NetAddr
NetAddr.broadcastFlag_(true);
~osc = OSCresponderNode(nil, '/readyToSend', {|time, resp, msg|
	b.sendMsg("/loadLayout", "http://192.168.2.9/~jfalkenstein/layout_2.json");
}).add;

~osc2= OSCresponderNode(nil, '/didBecomeActive', {|time, resp, msg|
	b.sendMsg("/loadLayout", "http://192.168.2.9/~jfalkenstein/layout_full.json");
}).add;
OSCFunc.trace(true); // Turn posting on
)

NetAddr.langPort;
