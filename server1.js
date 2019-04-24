// server.js
var express = require('express');  
var app = express();  
var server = require('http').createServer(app); 
var io = require('socket.io')(server); 

//keep track of how times clients have clicked the button
var clickCount = 0;
var msgfromServer1="";
var msgfromServer1="";
app.use(express.static(__dirname + '/public')); 
//redirect / to our index.html file
app.get('/', function(req, res,next) {  
    res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(client) {  
	//when the server receives clicked message, do this
	console.log('connected to 3001:', client.client.id);
	client.on('clientEvent-3000', function (data) {   
		msgfromServer2 ='[clientEvent-3000] [Inbox] :'+ data;
		console.log(msgfromServer2);
    });
    client.on('addConnection', function(data) {
    	  clickCount++;
		  //send a message to ALL connected clients
		  io.emit('buttonUpdate', clickCount+"##S E R V E R - 2/3001##"+msgfromServer1);
    });
	setInterval(function () {
		var rndNum =Math.random();
        client.emit('serverEvent-3001', rndNum);
        console.log('[serverEvent-3001] [Sent ] :'+rndNum);
    }, 6000);
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
    //console.log('connected to localhost:3000');
    socket.on('serverEvent-3000', function (data) { 
        console.log("[serverEvent-3000] [Inbox] :"+data);	
        msgfromServer1 = "thanks server(3000)! for '" + data + "'";	
        socket.emit('clientEvent-3001',msgfromServer1);
		console.log('[clientEvent-3001] [Sent ] :'+msgfromServer1);
    });
});

var io2 = require('socket.io-client');
var socket2 = io2.connect("http://localhost:3002/", {
    reconnection: true
});

socket2.on('connect', function () {
    //console.log('connected to localhost:3000');
    socket2.on('serverEvent-3002', function (data) { 
        console.log("[serverEvent-3002] [Inbox] :"+data);	
        msgfromServer2 = "thanks server(3002)! for '" + data + "'";	
        socket2.emit('clientEvent-3001/3002',msgfromServer2);
		console.log('[clientEvent-3001/3002] [Sent ] :'+msgfromServer2);
    });
});