// server.js
var express = require('express');  
var app = express();  
var server = require('http').createServer(app); 
var io = require('socket.io')(server); 

//keep track of how times clients have clicked the button
var clickCount = 0;
var msgfromServer1="";
app.use(express.static(__dirname + '/public')); 
//redirect / to our index.html file
app.get('/', function(req, res,next) {  
    res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(client) {  
	//when the server receives clicked message, do this
    client.on('clicked', function(data) {
    	  clickCount++;
		  //send a message to ALL connected clients
		  io.emit('buttonUpdate', clickCount+"##S E R V E R - 2/3001##"+msgfromServer1);
    });
});

//start our web server and socket.io server listening
server.listen(3001, function(){
  console.log('listening on *:3001');
}); 

var io1 = require('socket.io-client');
var socket = io1.connect("http://localhost:3000/", {
    reconnection: true
});

socket.on('connect', function () {
    console.log('connected to localhost:3000');
    socket.on('clientEvent', function (data) {
        console.log('message from the server:', data);
        socket.emit('serverEvent', "thanks server! for sending '" + data + "'");
		msgfromServer1 = "thanks server! for sending '" + data + "'";
    });
});