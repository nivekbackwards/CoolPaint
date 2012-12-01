exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};

// I don't think this works...
exports.favicon = function(req, res){
	console.log('favicon requested');
	res.send("/images/favicon.ico");
};
