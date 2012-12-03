/*
TODO:
	test the code
	remove throw statements
*/

var SocketUserMapClass 	= require('./socketUserMap');
var socketUserMapping 	= new SocketUserMapClass();

var MessageListClass 	= require('./chatMessages');
var chatMessageList		= new MessageListClass();

//currently not in use
var WhiteboardObjectsClass 	= require('./whiteboardObjects');
var whiteboardState 		= new whiteboardObjects;

var idCounter = 0;

// Server-side support for chat app:
exports.init = function (socket) {

	socket.on('loginAttempt', function(data){
		console.log('user attempting to connect ' + JSON.stringify(data));
		var username = data.username;
		if(socketUserMapping.goodName(username)){					// if this username is valid
			socketUserMapping.addUser(socket, username);				// add username to list
			socket.emit('loginAlow');									// allow client to login
			socket.emit('messages', {messageList: messageList});		// send client list of chat messages
			socket.emit('whiteboardState', {whiteboardObjects: whiteboardState};
		}
		else{														// otherwise
			socket.emit('loginReject');									// reject the login
		}	
	});

	socket.on('disconnect', function(){
		var disconnectedUser = removeUsernameCorrespondingToSocket(socket);
		if(disconnectedUser === null)
			throw "disconnect failure, no user found to match socket";
		socket.broadcast.emit('userLeft', {username : disconnectedUser});
	});

	socket.on('editUser', function(data){
		var newUsername = data.newUsername;
		console.log('user wants to change name to [' + newUsername + ']');
		if(goodName(newUsername)){
			var useIdx = findUsernameCorrespondingToSocket(socket);
			if(useIdx === null)
				throw "unable to edit user, no user found to match socket";
			var oldUsername = userList[useIdx].user;
			changeUsername(socket, newUsername);
			socket.emit('editAllow');
			socket.broadcast.emit('editUser', {oldUsername : oldUsername, newUsername: newUsername});
		}
		else{
			socket.emit('editReject');
		}
	});

  	socket.on('chatMessage', function (data) {
    	console.log('Received chat message: ' + JSON.stringify(data));
    	chatMessageList.addMessage(data.from, data.message);
	    socket.broadcast.emit('chatMessage', data);
  	});

  	socket.on('newObject', function(data){
  		socket.emit('newObjectID', {id: idCounter});
  		socket.broadcast.emit('newObject', {object: data.object, id: idCounter});
  		whiteboardState.idCounter = data.object;  	
  		idCounter++;
  	});

  	socket.on('objectEdit', function(data){
  		var id = data.id;
  		var attrName = data.attrName;
  		var attrValue = data.attrValue;

		socket.broadcast.emit('objectEdit', {id: id, attrName: attrName, attrValue: attrValue});

  		var object = whiteboardState.id;
  		object.attrName = attrValue;
  	}

};