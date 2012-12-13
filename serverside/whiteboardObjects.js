module.exports = WhiteboardState;

var jsondiffpatch = require('./jdp/jsondiffpatch.min.js');
jsondiffpatch.config.diff_match_patch = require('./jdp/diff_match_patch_uncompressed.js');
jsondiffpatch.config.textDiffMinLength = 5;

function WhiteboardState(){
	this.currCanvasJSON = '{"objects":[], "background":"rgba(0,0,0,0)"}';
};

WhiteboardState.prototype.makeChange = function(diff){
	console.log('type of diff is [' + typeof(diff) + ']');
	jsondiffpatch.patch(this.currCanvasJSON, diff);
};



/*

WhiteboardState.prototype.addObject = function(newObject){
	//maybe make some check if object is valid here?
	this.whiteboardObjects.push(newObject);
};

WhiteboardState.prototype.findObjectByID = function(id){
	for(var i=0; i<this.whiteboardObjects.length; i++){
		if(this.whiteboardObjects[i].id == id)
			return this.whiteboardObjects[i];
	}
	console.log('could not find object with id [' + id + ']');
	return null;
};

WhiteboardState.prototype.removeObject = function(id){
	for(var i=0; i<this.whiteboardObjects.length; i++){
		if(this.whiteboardObjects[i].id === id){
			this.whiteboardObjects.splice(i, 1);
			console.log('successfully removed object with id [' + id + ']');
			return;
		}
	}
	console.log('unable to find object ' + JSON.stringify(objectToBeRemoved));
	return;
};

WhiteboardState.prototype.editObject = function(id, attrName, attrValue){
	var object = this.findObjectByID(id);
	if(object){
  		object.attrName = attrValue;
  		console.log('successfully updated object [' + id + "]'s attribute [" + attrName + '] to have value [' + attrValue + ']');
  	}
  	else
  		console.log('unable to edit object with id [' + id + ']');
};
*/