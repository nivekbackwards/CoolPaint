module.exports = SocketUserMapping;

var SocketUser = function(socket, user){
	this.socket = socket;
	this.user = user;
};

var SocketUserMapping = function(){
	var socketUserMap = [];
}

// returns index in user list
SocketUserMapping.prototype.findUsernameCorrespondingToSocket = function(socket){
	for(var i=0; i<this.socketUserMap.length; i++){
		if(this.socketUserMap[i].socket === socket){
			return i;
		}
	}
	return null;
};

SocketUserMapping.prototype.removeUser = function(socket){
	var userIndex = this.findUsernameCorrespondingToSocket(socket);
	if(userIndex === null){
		console.log('no user found that matches this socket');
		return null;
	}
	var username = this.socketUserMap[userIndex].user;
	this.socketUserMap.splice(i, 1);
	console.log('removed user [' + username + '] from list due to disconnect');
	return username;
};

SocketUserMapping.prototype.changeUsername = function(socket, newUsername){
	var userIndex = this.findUsernameCorrespondingToSocket(socket);
	if(userIndex === null){
		console.log('no user found that matches this socket');
		return null;
	}
	var oldUsername = this.socketUserMap[userIndex].user;
	this.socketUserMap[userIndex].user = newUsername;
	console.log('successfully changed [' + oldUsername + "]'s name to [" + newUsername + ']');
};

SocketUserMapping.prototype.usernameInUse = function(username){
	for(var i=0; i<this.socketUserMap.length; i++){
		if(this.socketUserMap[i].user === username)
			return true;
	}
	return false;
};

SocketUserMapping.prototype.goodName = function(username){
	if(this.usernameInUse(username))	// if another client is using this username...
		return false;						// it is not allowed
	return true;

/*
	if($.inArray(data.username, userList)) 	
		return false;								
	return true;
	*/
};