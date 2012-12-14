module.exports = WhiteboardState;

/*
var jsondiffpatch = require('./jdp/jsondiffpatch.js');
jsondiffpatch.config.diff_match_patch = require('./jdp/diff_match_patch_uncompressed.js');
jsondiffpatch.config.textDiffMinLength = 5;
*/

var patchLibrary = require('./jdp/diff_match_patch_uncompressed.js');
var patcher = new patchLibrary.diff_match_patch();

function WhiteboardState(){
	this.currCanvasJSON = {};
};

WhiteboardState.prototype.makeChange = function(diff){
	var myPatches = diff;
	console.log('type of patches is [' + typeof(myPatches) + '] ... it should be an array');

	patcher.patch_apply(myPatches, this.currCanvasJSON);

	console.log('\n\n\nafter the change, the canvas is ' + JSON.stringify(this.currCanvasJSON) + '\n\n\n');
};

WhiteboardState.prototype.getCanvas = function(){
	console.log('\n\n\nsending over the whole canvas! ' + this.currCanvasJSON + '\n\n\n');
	return this.currCanvasJSON;
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