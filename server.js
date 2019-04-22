// server.js
var express = require('express');  
var app = express();  
var server = require('http').createServer(app); 
var io = require('socket.io')(server); 

//keep track of how times clients have clicked the button
var clickCount = 0;
var msgfromServer2="";
app.use(express.static(__dirname + '/public')); 
//redirect / to our index.html file
app.get('/', function(req, res,next) {  
    res.sendFile(__dirname + '/public/index.html');
});

/* io.on('connection', function(client) {  
	//when the server receives clicked message, do this
    client.on('clicked', function(data) {
    	  clickCount++;
		  //send a message to ALL connected clients
		  io.emit('buttonUpdate', clickCount);
    });
}); */


//var io = require('socket.io').listen(3000);
io.on('connection', function (socket) {
    console.log('connected:', socket.client.id);
    socket.on('serverEvent', function (data) {
        console.log('new message from client:', data);
		msgfromServer2 = 'new message from client:'+ data;
    });
	socket.on('clicked', function(data) {
    	  clickCount++;
		  //send a message to ALL connected clients
		  io.emit('buttonUpdate', clickCount+"##S E R V E R - 1/3000##"+msgfromServer2);
    });
    setInterval(function () {
        socket.emit('clientEvent', Math.random());
        console.log('message sent to the clients');
    }, 60000);
});

//start our web server and socket.io server listening
server.listen(3000, function(){
  console.log('listening on *:3000');
}); 