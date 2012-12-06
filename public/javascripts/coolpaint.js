define(['jquery', 'fabric', 'socketIO'], function($, fabric, io){
    var myName = null;


    $(function () {
      console.log("hello from coolapint.js ready handler");
      console.log('initializing connection on client');
      var socket = io.connect();
      chatApp(socket);

      bindNonNetworkFunctionality();
		});

    function bindNonNetworkFunctionality(){
      $('#nameBox').keyup(function(event){
        if(event.keyCode == 13){    // press Enter
          $('#loginButton').click();
        }
      });

      
    };

    function displayChatMessage(from, theMessage, time){
      var numHours;
      var numMinutes;
      console.log('type of our time [' + typeof(time) + ']');
      if(time){
        numHours = time.getHours();
        numMinutes = time.getMinutes();
      }
      var messageObject = $('<li>');
      messageObject.text('[' + numHours + ':' + numMinutes + '] ' + from + ': ' + theMessage);
      $('#message-list').append(messageObject);
    }


    function chatApp(socket) {
      $('#loginButton').bind('click', function(){
        var username = $('#nameBox').val();
        console.log('user attempts to login with [' + username + '], sending message to server');
        socket.emit('loginAttempt', {username: username});
      });

      $('#drawing-mode').bind('click', function() {
        console.log('dat draw mode click');
        canvas.isDrawingMode = !canvas.isDrawingMode;
        });

      $('#chat-text-area').keyup(function(event){
          if(event.keyCode == 13){   // press Enter
            var theMessage = $('#chat-text-area').val();
            var messageTime = new Date();
            displayChatMessage('Me', theMessage, messageTime);
            $('#chat-text-area').val('');
            socket.emit('chatMessage', {from: myName, message: theMessage, time:messageTime});
          }
      });

      socket.on('loginAllow', function(data){
        console.log('login successful!');
        $('#view-login').css('visibility', 'hidden');
        $('#view-canvas').css('visibility', 'visible');
        
        var canvas = new fabric.Canvas('my-canvas');
        myName = data.yourName;

        $('#drawing-mode').bind('click', function() {
        console.log('dat draw mode click');
        canvas.isDrawingMode = !canvas.isDrawingMode;
        });
      });

      socket.on('chatMessage', function(data){
        console.log('received message ' + JSON.stringify(data));
        displayChatMessage(data.from, data.message, new Date());
      });

      socket.on('messages', function(data){
        var messages = data.messageList;
        console.log('received lots of messages ' + JSON.stringify(messages));
        for(var i=0; i<messages.length; i++)
          displayChatMessage(messages[i].from, messages[i].message, new Date());
      })

      socket.on('loginReject', function(){
        console.log('username rejected');
      });
    };
		
		function pad(str, length) {
			while (str.length < length) {
				str = '0' + str;
			}
			return str;
	   };
		
		function getRandomColor() {
			return (
				pad(getRandomInt(0, 255).toString(16), 2) +
				pad(getRandomInt(0, 255).toString(16), 2) +
				pad(getRandomInt(0, 255).toString(16), 2)
			);
		}
		
	  var getRandomInt = fabric.util.getRandomInt;
    	

    	
    	

  		
  		var clearCanvasEl = document.getElementById('clear-canvas');
  		
  		clearCanvasEl.onclick = function() {
  			if (confirm('Are you sure?')) {
          		canvas.clear();
        	}
        };
        
        //var mode = selectMode;
		
		var addRectEl = document.getElementById('rect');
		
		
		addRectEl.onclick = function() {
			//mode = rectMode;
			canvas.add(new fabric.Rect({
          		left: getRandomInt(50, 550),
      			top: getRandomInt(50, 350),
          		fill: '#' + getRandomColor(),
          		width: 50,
          		height: 50,
          		opacity: 0.8
        	}));
        };
        
        var addCircleEl = document.getElementById('circle');
        
        addCircleEl.onclick = function() {
        	  canvas.add(new fabric.Circle({
          		left: getRandomInt(50, 550),
      			top: getRandomInt(50, 350),
          		fill: '#' + getRandomColor(),
          		radius: 50,
          		opacity: 0.8
        	}));
        };
        
        var addTriangleEl = document.getElementById('triangle');
        
        addTriangleEl.onclick = function() {
        	canvas.add(new fabric.Triangle({
          		left: getRandomInt(50, 550),
      			top: getRandomInt(50, 350),
          		fill: '#' + getRandomColor(),
          		width: 50,
          		height: 50,
          		opacity: 0.8
        	}));
        };
        
        var addTextEl = document.getElementById('text');
        
        var text = 'Lorem ipsum dolor sit amet,\nconsectetur adipisicing elit,\nsed do eiusmod tempor incididunt\nut labore et dolore magna aliqua.\n' +
    'Ut enim ad minim veniam,\nquis nostrud exercitation ullamco\nlaboris nisi ut aliquip ex ea commodo consequat.';
        
        addTextEl.onclick = function() {
        	var textSample = new fabric.Text(text.slice(0, getRandomInt(0, text.length)), {
      			left: getRandomInt(50, 550),
      			top: getRandomInt(50, 450),
      			fontFamily: 'helvetica',
      			angle: getRandomInt(-10, 10),
      			fill: '#' + getRandomColor(),
      			scaleX: 0.5,
      			scaleY: 0.5,
      			fontWeight: ''
    		});
    	canvas.add(textSample);
    	updateComplexity();
   	 	};

/*
      var testObj = {
        test:"hello from coolpaint module!"
      };

      return testObj;
      */

});