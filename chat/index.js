


function ChatMessage(from, message){
	this.from = from;
	this.message = message;
	this.time = Date.now();
};

ChatMessage.prototype.toString = function(){
	return "" + this.time + " " + this.from + "  :  " + message;
};

var messageList = [];

/*
var userList = [];

var goodName = function(username){
	if($.inArray(data.username, userList)){ 	// if another client is using this username...
		return false;								// it is not allowed
	}
	return true;
};
*/

var SocketUserMapping = require('./socketUserMap');

// Server-side support for chat app:
exports.init = function (socket) {
	socket.on('loginAttempt', function(data){
		console.log('user attempting to connect ' + JSON.stringify(data));
		if(goodName(username)){										// if this username is valid
			userList.push(data.username);								// add username to list
			socket.emit('loginAlow', {username : data.username});		// allow client to login
			socket.emit('messages', {messageList: messageList});		// send client list of chat messages
			//TODO														// send client current state of whiteboard								
		}
		else{														// otherwise
			socket.emit('loginReject');									// reject the login
		}	
	});

	socket.on('disconnect', function(){
		var disconnectedUser = removeUsernameCorrespondingToSocket(socket);
		if(disconnectedUser === null)
			throw "disconnect failure";
		socket.broadcast.emit('userLeft', {username : disconnectedUser});
	});

	socket.on('editUser', function(data){
		var newUsername = data.newUsername;
		console.log('user wants to change name');
		if(goodName(newUsername)){
			var oldUsername = userList[findUsernameCorrespondingToSocket(socket)].user;
			changeUsername(socket, newUsername);
			socket.emit('editAllow');
			socket.broadcast.emit('editUser', {oldUsername : oldUsername, newUsername: newUsername});
		}
		else{
			socket.emit('editReject');
		}
	});

  	socket.on('chatMessage', function (data) {
    	console.log('Received post: ' + JSON.stringify(data));
	    messageList.push(new ChatMessage(data.from, data.message));
	    socket.broadcast.emit('chatMessage', data);
  	});
};