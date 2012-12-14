var SocketUserMapClass 	= require('./socketUserMap');
var socketUserMapping 	= new SocketUserMapClass();

var MessageListClass 	= require('./chatMessages');
var chatMessageList		= new MessageListClass();

var WhiteboardObjectsClass 	= require('./whiteboardObjects');
var whiteboardState 		= new WhiteboardObjectsClass;

exports.init = function (socket) {
	socket.on('loginAttempt', function(data){
		console.log('user attempting to connect ' + JSON.stringify(data));
		var username = data.username;
		if(socketUserMapping.goodName(username)){									// if this username is valid
			socketUserMapping.addUser(username, socket);								// add username to list
			socket.emit('loginAllow', {yourName: username});							// allow client to login
			socket.emit('messages', {messageList: chatMessageList.messageList});		// send client list of chat messages
			socket.emit('canvasJSON', {canvas: whiteboardState.getCanvas()});		// send client current state of whiteboard
			var datuserlist = socketUserMapping.getUserList();
			console.log('sending list of users ' + JSON.stringify(datuserlist));
			//socket.emit('users', {userList: socketUserMapping.getUserList()});
			socket.emit('users', {userList: datuserlist});
			socket.broadcast.emit('userJoined', {username: username});
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
  		socket.broadcast.emit('canvasDiff', {patches: data.patches});
  		whiteboardState.makeChange(data.patches);
  	});	

};