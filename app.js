var express = require('express'),
    http    = require('http'),
    routes = require('./routes');

var app = module.exports = express();

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'your secret here' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
app.get('/', routes.index);
app.get('/favicon.ico', routes.favicon);

var server = http.createServer(app);

// WebSockets/Socket.IO
var io      = require('socket.io', {'log level': 0}).listen(server);
var chatApp = require('./serverside');

io.sockets.on('connection', function (socket) {
  chatApp.init(socket);
});

var port = process.env.PORT || 9001;
server.listen(port, function(){
  console.log("Express server listening on port %d in %s mode",
              server.address().port, app.settings.env);
});
