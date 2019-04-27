// server.js
var express = require('express');  
var app = express();  
var server = require('http').createServer(app); 
var io = require('socket.io')(server); 

//keep track of how times clients have clicked the button
var clickCount = 0;
var msgfromServer1="";
var msgfromServer1="";
var currSate = "P A S S I V E";
var clientState = "P A S S I V E";
var startup =0;
var firstStartUp=0;
var outbox =0;
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
		outbox = outbox -1;
    });
    client.on('addConnection', function(data) {
    	  clickCount++;
		  //send a message to ALL connected clients
		  io.emit('buttonUpdate', clickCount+"##S E R V E R - 2/3001##"+msgfromServer1);
    });
	setInterval(function () {
		var rndNum =Math.random();
		startup = startup +1;
		if(startup==1){
		  rndNum= rndNum +" # Marking myself A C T I V E # ";
		  currSate = "A C T I V E";
		  clientState = "P A S S I V E";
		}  
	    else{
		  rndNum= rndNum +" # I am "+currSate+" # "; 
		}	
        client.emit('serverEvent-3001', rndNum);
        console.log('[serverEvent-3001] [Sent ] :'+rndNum+"[ Outbox: "+outbox+"]");
		console.log("[server-3001-["+currSate+"] server-3000-["+clientState+"]");
		
		if(clientState!="O F F L I N E" && outbox > 1){
		  currSate = "A C T I V E";
		  clientState = "O F F L I N E";
		  outbox=0;
		}else{
		  outbox = outbox + 1;	
		  clientState = "P A S S I V E";
		}	  	
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
		if(data.indexOf("A C T I V E")>-1){
			currSate = "P A S S I V E";
			startup = startup +1;
			if(startup==1){
			  clientState = "A C T I V E";
			}
		}		
        msgfromServer1 = "thanks server(3000)! for '" + data + "'";	
        socket.emit('clientEvent-3001',msgfromServer1.split("#")[0]);
		console.log('[clientEvent-3001] [Sent ] :'+msgfromServer1.split("#")[0]);
    });
});
