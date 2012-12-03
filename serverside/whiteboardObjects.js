module.exports = WhiteboardState;

function WhiteboardState(){
	this.whiteboardObjects = [];	
};

WhiteboardState.prototype.addObject = function(newObject){
	//maybe make some check if object is valid here

	this.whiteboardObjects.push(newObject);
};

WhiteboardState.prototype.removeObject = function(objectToBeRemoved){
	for(var i=0; i<this.whiteboardObjects.length; i++){
		if(this.whiteboardObjects[i] === objectToBeRemoved){
			this.whiteboardObjects.splice(i, 1);
			console.log('successfully removed object ' + JSON.stringify(objectToBeRemoved));
			return;
		}
	}
	console.log('unable to find object ' + JSON.stringify(objectToBeRemoved));
	return;
};

WhiteboardState.prototype.editObject = function(){
	//todo
};