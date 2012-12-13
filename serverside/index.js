var SocketUserMapClass 	= require('./socketUserMap');
var socketUserMapping 	= new SocketUserMapClass();

var MessageListClass 	= require('./chatMessages');
var chatMessageList		= new MessageListClass();

var WhiteboardObjectsClass 	= require('./whiteboardObjects');
var whiteboardState 		= new WhiteboardObjectsClass;

//var idCounter = 0;

exports.init = function (socket) {

	socket.on('loginAttempt', function(data){
		console.log('user attempting to connect ' + JSON.stringify(data));
		var username = data.username;
		if(socketUserMapping.goodName(username)){									// if this username is valid
			socketUserMapping.addUser(socket, username);								// add username to list
			socket.emit('loginAllow', {yourName: username});							// allow client to login
			socket.emit('messages', {messageList: chatMessageList.messageList});		// send client list of chat messages
			socket.emit('whiteboardState', {whiteboardObjects: whiteboardState});		// send client current state of whiteboard
		}
		else{																		// otherwise
			socket.emit('loginReject');													// reject the login
		}	
	});

	socket.on('disconnect', function(){
		console.log('a user has disconnected');
		var disconnectedUser = socketUserMapping.removeUser(socket);
		if(disconnectedUser === null)
			console.log('disconnect error....');
		socket.broadcast.emit('userLeft', {username : disconnectedUser});
	});

	socket.on('editUser', function(data){
		var newUsername = data.newUsername;
		console.log('user wants to change name to [' + newUsername + ']');
		if(socketUserMapping.goodName(newUsername)){
			var oldUsername = socketUserMapping.findUsernameCorrespondingToSocket(socket);
			if(oldUsername === null)
				console.log("unable to edit user, no user found to match socket");
			socketUserMappingchangeUsername(socket, newUsername);
			socket.emit('editAllow');
			socket.broadcast.emit('editUser', {oldUsername : oldUsername, newUsername: newUsername});
		}
		else{
			socket.emit('editReject');
		}
	});


  	socket.on('chatMessage', function (data) {
    	console.log('Received chat message: ' + JSON.stringify(data));
    	chatMessageList.addMessage(data.from, data.message, data.time);
	    socket.broadcast.emit('chatMessage', data);
  	});

  	socket.on('canvasDiff', function(data){
  		whiteboardState.makeChange(data.diff);
  		socket.emit('canvasDiff', {diff: data.diff});
  	});

/*
  	socket.on('newObject', function(data){
  		console.log('received new object ' + JSON.stringify(data));
  		socket.emit('newObjectID', {id: idCounter});
  		var myObj = JSON.parse(data.object);
  		if(myObj){
  			myObj.id = idCounter;
  			socket.broadcast.emit('newObject', {object: myObj});
  			whiteboardState.addObject(data.object);
  			idCounter++;
  		}
  		else
  			console.log('for some reason this was called when no object was created');
  	});

  	socket.on('editObject', function(data){
  		var id = data.id;
  		var attrName = data.attrName;
  		var attrValue = data.attrValue;

  		whiteboardState.editObject(id, attrName, attrValue);
		socket.broadcast.emit('editObject', {id: id, attrName: attrName, attrValue: attrValue});	  		
  	});

  	socket.on('removeObject', function(data){
  		var id = data.id;
  		whiteboardState.removeObject(id);
  		socket.broadcast.emit('removeObject', {id: id});
  	});
*/


  	

};