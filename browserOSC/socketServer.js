var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

var osc = require('node-osc');

// edit here
var client = new osc.Client('192.168.2.8', 57120);

server.listen(8080);	// webserver on port 80

// uncomment this to add status messages about connections

//setInterval(status, 1000);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/ui.html');
});

app.get('/base.css', function (req, res) {
        res.sendfile(__dirname + '/skeleton/base.css');
        });
app.get('/skeleton.css', function (req, res) {
        res.sendfile(__dirname + '/skeleton/skeleton.css');
        });
app.get('/layout.css', function (req, res) {
        res.sendfile(__dirname + '/skeleton/layout.css');
        });

app.get('/jquery-1.9.1.js', function (req, res) {
  res.sendfile(__dirname + '/jquery-1.9.1.js');
});

app.get('/interface.js', function (req, res) {
  res.sendfile(__dirname + '/interface.js');
});

app.get('/setupUI.js', function (req, res) {
  res.sendfile(__dirname + '/setupUI.js');
});

app.get('/buttonDefinitions.js', function (req, res) {
  res.sendfile(__dirname + '/buttonDefinitions.js');
});

app.get('/Farbstreifen.png', function (req, res) {
        res.sendfile(__dirname + '/resources/Farbstreifen.png');
        });
app.get('/Default-568h.png', function (req, res) {
        res.sendfile(__dirname + '/resources/Default-568h.png');

        });
app.get('/ICON.png', function (req, res) {
        res.sendfile(__dirname + '/resources/ICON.png');

        });



// this session managment code is for future features that will be included in RC1
var connectedSessions = [];	// array of every connection
var availableServers = [];	// array of server objects
var availableClients = [];	// array of client objects

io.sockets.on('connection', function (socket) {
  // every new connection
  connectedSessions.push(socket);
  console.log("Adding a new session...");
  console.log("Number of connected Sessions: "+connectedSessions.length);

  // debug output
  for(i = 0; i < connectedSessions.length; i++){ console.log("Session "+i); }

  // find out who this is client/server
  socket.emit("whoAreYou", { test: "nothing" });

  socket.on('disconnect', function() {
    console.log("Disconnected: "+socket.id);

    // find if the socket belongs to a server or client
    var spliceInfo = clientOrServer(socket);
    console.log(spliceInfo);

    if(spliceInfo.type == "server"){
      availableServers.splice(availableServers.indexOf(availableServers[spliceInfo.index]), 1);
    }

    if(spliceInfo.type == "client"){
      availableClients.splice(availableClients.indexOf(availableClients[spliceInfo.index]), 1);
    }

    // remove from master list of all sessions
    connectedSessions.splice(connectedSessions.indexOf(socket), 1);

  });

/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

  socket.on("iAm", function(data){
    console.log("Got a response to whoAreYou");
    console.log(data);

    if(data.type == "server"){
      // make a new rtc server object
      // push it onto the stack of availableServers
	var oscServer = new Object();
	oscServer.id = socket.id;
	oscServer.location = data.location;
	oscServer.socket = socket;

      // check to see if this is a server renaming itself
      var bIsNewServer = true;
      for(i = 0; i < availableServers.length; i++){
	if(oscServer.id === availableServers[i].id){
	  // just rename existing server
	  availableServers[i].location = oscServer.location;
	  bIsNewServer = false;
	  console.log("renaming existing server");
	}
      }

      if(bIsNewServer){
	console.log("adding new server to the list!");
	availableServers.push(oscServer);
      }
    }	// end of if = server

    if(data.type == "client"){

      var oscClient = new Object();
      oscClient.id = socket.id;
      oscClient.location = data.location;
      oscClient.socket = socket;

      var bIsNewClient = true;
      for(i = 0; i < availableClients.length; i++){
	if(oscClient.id === availableClients[i].id){
	  // just rename existing server
	  availableClients[i].location = oscClient.location;
	  bIsNewClient = false;
	  console.log("renaming existing client");
	}
      }

      if(bIsNewClient){
	console.log("Adding new client to the list!");
	availableClients.push(oscClient);
      }

    }
  });

  socket.on("sendOSC", function(data){
    // console.log(data);
    if(data.v != null){

      var msg =  new osc.Message(data.destinationAddress);
      msg.append(data.v);

      for(var i = 0; i < msg.args.length; ++i){
	msg.args[i].type = 'float';
      }

      console.log(msg);

      client.send(msg);
    }
    else {
      console.log("GOT NULL");
    }
  });

  socket.on("debugMessage", function(msg){
    console.log("\t\tDebug Message");
    console.log(msg);
  });

  socket.on("listServers", function(data){
    var responseClient = clientOrServer(socket);

    var serverList = [];
    for(i = 0; i < availableServers.length; i++){
      serverList[i] = availableServers[i].location;
    }
    // availableClients[responseClient.index].socket.emit("listOfServers", serverList);
    availableServers[responseClient.index].socket.emit("listOfServers", serverList);
  });

});  // end of socket.on('connection' ...

function status(){
  console.log(Date.now());
  console.log("Total Socket.IO Connections: "+connectedSessions.length);
  console.log("Total Available Servers: "+availableServers.length);
  console.log("Total Available Clients: "+availableClients.length);

  for(i = 0; i < availableServers.length; i++){
    console.log("Server - ID: "+availableServers[i].id+" location: "+availableServers[i].location);
  }

  for(i = 0; i < availableClients.length; i++){
    console.log("Client - ID: "+availableClients[i].id+" location: "+availableClients[i].location);
  }

}

app.get('/ask', function (req, res) {
    for(i = 0; i < connectedSessions.length; i++){
        console.log("availableClients" + availableClients[i]);
        connectedSessions[i].emit('whoAreYou');
    }
});

app.get('/intro', function (req, res) {

    for(i = 0; i < connectedSessions.length; i++){
        connectedSessions[i].emit('setText', 'During the performance of this piece you will receive instructions. Please follow them up in order to contribute  to the piece. Soon you will receive the first instruction ...');
    }
    res.sendfile(__dirname + '/done.html');

});

app.get('/screen_1', function (req, res) {
        var items = ['Stand Up Now', 'Wave your phone in the air', 'Stand up and bow to your neighbour'];
    for(i = 0; i < connectedSessions.length; i++){
        var item = items[Math.floor(Math.random()*items.length)];

        connectedSessions[i].emit('setText', item);
        
    }
    res.sendfile(__dirname + '/done.html');
        
});

app.get('/screen_2', function (req, res) {
        console.log(req);
        for(i = 0; i < connectedSessions.length; i++){
        connectedSessions[i].emit('setTextWithButton', 'Choose the right moment to inject the sound of a Breeze / the sound of foot steps');
        
        }
        res.sendfile(__dirname + '/done.html');
        
        });

app.get('/screen_3', function (req, res) {
        console.log(req);
        for(i = 0; i < connectedSessions.length; i++){
        connectedSessions[i].emit('setTextWithButton', 'Please push the button to welcome poet Hans Vaders');
        
        }
        res.sendfile(__dirname + '/done.html');
        
        });

app.get('/showSplash', function (req, res) {
        for(i = 0; i < connectedSessions.length; i++){
        connectedSessions[i].emit('showSplash');        
        }
        res.sendfile(__dirname + '/done.html');

        });

app.get('/status', function (req, res) {
        status();
        });

/////////////////// helpers

// accepts an IOSocket and checks to see if it is currently
// in the list of clients or servers
function clientOrServer(testSocket){

  var returnObject = Object();

  for(i = 0; i < availableServers.length; i++){
      if(testSocket.id === availableServers[i].id){
	returnObject.type = "server";
	returnObject.index = i;
      }
  }

  for(i = 0; i < availableClients.length; i++){
      if(testSocket.id === availableClients[i].id){
	returnObject.type = "client";
	returnObject.index = i;
      }
  }
  return returnObject;
}

function serverLookupByLocation(location){
  var returnIndex = -1;
  for(i = 0; i < availableServers.length; i++){
    if(availableServers[i].location == location){
      returnIndex = i;
    }
  }
  return returnIndex;
}

function clientLookupByLocation(location){
  var returnIndex = -1;
  for(i = 0; i < availableClients.length; i++){
    if(availableClients[i].location == location){
      returnIndex = i;
    }
  }
  return returnIndex;
}
