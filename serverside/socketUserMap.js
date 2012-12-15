module.exports = SocketUserMapping;

function SocketUserMapping(){
	this.socketUserMap = [];
};


// returns index in user list
SocketUserMapping.prototype.findUsernameIdxCorrespondingToSocket = function(socket){
	for(var i=0; i<this.socketUserMap.length; i++){
		if(this.socketUserMap[i].socket === socket){
			return i;
		}
	}
	return null;
};

SocketUserMapping.prototype.removeUser = function(socket){
	var userIndex = this.findUsernameIdxCorrespondingToSocket(socket);
	if(userIndex === null){
		console.log('no user found that matches this socket');
		return null;
	}
	var username = this.socketUserMap[userIndex].user;
	this.socketUserMap.splice(userIndex, 1);
	console.log('removed user [' + username + '] from list due to disconnect');
	return username;
};

SocketUserMapping.prototype.addUser = function(username, socket){
	console.log('adding username:' + username + ', and some socket to the map');
	this.socketUserMap.push(new SocketUser(socket, username));
};

SocketUserMapping.prototype.getUserList = function(){
	var userlist = [];
	for(var i=0; i<this.socketUserMap.length; i++){
		var user = this.socketUserMap[i].getUsername();
		console.log('adding user [' + user + ']');
		userlist.push(user);
		//userlist.push(this.socketUserMap[i].user);
	}
	return userlist;
};

SocketUserMapping.prototype.changeUsername = function(socket, newUsername){
	var userIndex = this.findUsernameIdxCorrespondingToSocket(socket);
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

var acceptableName = /^[A-Za-z_][A-Za-z_0-9]*$/;
SocketUserMapping.prototype.goodName = function(username){
	console.log('checking if [' + username + '] is valid');

	if(username == undefined){
		console.log('BAD name -- usernamename undefined');
		return false;
	}

	if(username === 'Me'){
		console.log('user trying to login with name "Me", name rejected');
		return false;
	}

	if(this.usernameInUse(username)){
		console.log('BAD name -- username in use');
		return false;
	}

	if(acceptableName.test(username)){
		console.log('GOOD name :)');
		return true;
	}
	else{
		console.log('BAD name -- invalid characters');
		return false;
	}
};


var SocketUser = function(socket, user){
	this.socket = socket;
	this.user = user;
};

SocketUser.prototype.getUsername = function(){
	return this.user;
};