
OSCFunc.trace(true); // Turn posting on

~osc2 = OSCresponderNode(nil, '/touchSlider0', {|time, resp, msg|
	msg.postln;
}).add;
