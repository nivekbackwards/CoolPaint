module.exports = MessageList;

function MessageList(){
	this.messageList = [];
};

MessageList.prototype.addMessage = function(from, message){
	console.log('adding message [' + message + '] to messageList');
	this.messageList.push(new ChatMessage(from, message));
};

MessageList.prototype.getMessageList = function(){
	return this.messageList;
};




function ChatMessage(from, message){
	this.from = from;
	this.message = message;
	this.time = Date.now();
};

ChatMessage.prototype.toString = function(){
	return "" + this.time + " " + this.from + "  :  " + message;
};

