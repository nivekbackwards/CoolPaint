var patchLibrary = require('../public/javascripts/rawLibraries/diff_match_patch_uncompressed.js');
var patcher = new patchLibrary.diff_match_patch();

module.exports = WhiteboardState;

function WhiteboardState(){
	this.currCanvasJSON = "";
};

WhiteboardState.prototype.makeChange = function(diff){
	this.currCanvasJSON = patcher.patch_apply(diff, this.currCanvasJSON)[0];
};

WhiteboardState.prototype.getCanvas = function(){
	return this.currCanvasJSON;
};