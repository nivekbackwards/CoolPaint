define(['jquery', 'fabric', 'socketIO'], function($, fabric, socket){
    var myName = null;
    var canvas;

    var pencilButton;
    var handButton;
    var textButton;
    var shapesButton;
    var widthButton;
    var shapeSelectorButton;
    var selected = null;
    var chatTextArea;

    var lineWidthPictures = [];
    var shapePictures = [];

    $.fn.textWidth = function(){
      var html_org = $(this).html();
      var html_calc = '<span>' + html_org + '</span>';
      $(this).html(html_calc);
      var width = $(this).find('span:first').width();
      $(this).html(html_org);
      return width;
    };

    $(function () {
      console.log("hello from coolapint.js ready handler");
      console.log('initializing connection on client');

      $(this).scrollTop(0);

      loadImages();
      bindLoginThings();
      socketThings();
		});

    function loadImages(){
      lineWidthPictures.push('/images/width1.png');
      lineWidthPictures.push('/images/width2.png');
      lineWidthPictures.push('/images/width3.png');
      lineWidthPictures.push('/images/width4.png');

      shapePictures.push('images/ovalUp.png');
      shapePictures.push('images/squareUp.png');
      shapePictures.push('images/triangleUp.png');
      shapePictures.push('images/lineUp.png');
    };

    function bindLoginThings(){
      $('#nameBox').keyup(function(event){
        if(event.keyCode == 13){    // press Enter
          $('#loginButton').click();
        }
      });      

      $('#loginButton').bind('click', function(){
        var username = $('#nameBox').val();
        console.log('user attempts to login with [' + username + '], sending message to server');
        socket.emit('loginAttempt', {username: username});
      });
    };

    function bindDrawThings(){
      pencilButton  = $("#pencilButton");
      chatTextArea  = $('#chat-text-area');
      handButton    = $('#handButton');
      textButton    = $('#textButton');
      shapesButton  = $('#shapesButton');
      widthButton   = $('#widthButton');
      shapeSelectorButton  = $('#shapeSelectorButton');
      canvas = new fabric.Canvas('my-canvas');


/*                     PENCIL BUTTON                     */
      pencilButton.bind('click', function() {
        canvas.isDrawingMode = !canvas.isDrawingMode;
        if (!canvas.isDrawingMode) {
        	var lastObj = canvas.getObjects()[canvas.getObjects().length - 1];
        	console.log(lastObj);
        	var serializedObj = JSON.stringify(lastObj)
        	
        	//to communicate with the server
        	socket.emit('newObject', {object: serializedObj});
        	console.log("emit: " + serializedObj);
        	console.log('canvas: ' + JSON.stringify(canvas));
        	
        	lastObj.remove();
        	//canvas.loadFromJSON('{"objects":[' + serializedObj + ']}');
        	//for (var i=0; i<canvas.getObjects().length; i++) {
        	//	console.log(i + ": " + JSON.stringify(canvas.getObjects()[i]));
        	//}
        	
        	addFromJSON(serializedObj);
        	canvas.renderAll();
        }

        if(selected !== null && selected !== pencilButton)
          selected.toggleOff();
        pencilButton.toggleOn();
      });

      pencilButton.toggleOn = function(){
        var downPic = '/images/pencilDown.png';
        if(pencilButton !== selected){
          selected = pencilButton;
          pencilButton.attr('src', downPic);
        }
      };

      pencilButton.toggleOff = function(){
        var upPic = '/images/pencilUp.png';
        pencilButton.attr('src', upPic);
      };

              
/*                     HAND BUTTON                     */
      handButton.bind('click', function(){
        console.log("clicking the hand doesn't do anything!!!");
        // actually do something with this handbutton click
        if(selected !== null && selected !== handButton)
          selected.toggleOff();
        handButton.toggleOn();
      });

      handButton.toggleOn = function(){
        var downPic = '/images/handDown.png';
        if(handButton !== selected){
          selected = handButton;
          handButton.attr('src', downPic);
        }
      };

      handButton.toggleOff = function(){
        var upPic = '/images/handUp.png';
        handButton.attr('src', upPic);
      };


/*                     SHAPES BUTTON                     */
      shapesButton.bind('click', function(){
          console.log("clicking shapes doesn't do anything!!!");
          // actually do something with this shapes click
          if(selected !== null && selected !== shapesButton)
          selected.toggleOff();
        shapesButton.toggleOn();
      });

      shapesButton.toggleOn = function(){
        var downPic = '/images/shapesDown.png';
        if(shapesButton !== selected){
          selected = shapesButton;
          shapesButton.attr('src', downPic);
        }
      };

      shapesButton.toggleOff = function(){
        var upPic = '/images/shapesUp.png';
        shapesButton.attr('src', upPic);
      };


/*                     TEXT BUTTON                     */
      textButton.bind('click', function(){
        // actually do something when text is clicked
        console.log("clicking text doesn't do anything!");
        if(selected !== null && selected !== textButton)
          selected.toggleOff();
        textButton.toggleOn();
      });

      textButton.toggleOn = function(){
        var downPic = '/images/textDown.png';
        if(textButton !== selected){
          selected = textButton;
          textButton.attr('src', downPic);
        }
      };

      textButton.toggleOff = function(){
        var upPic = '/images/textUp.png';
        textButton.attr('src', upPic);
      }


/*                     WIDTH BUTTON                     */      
      var currWidthImageIdx = 1;
      widthButton.bind('click', function(){
        // actually do something when width button is clicked
        console.log("clicking width doesn't do anything");
        widthButton.cycle();
      });

      widthButton.cycle = function(){
        currWidthImageIdx = (currWidthImageIdx + 1) % lineWidthPictures.length;
        widthButton.attr('src', lineWidthPictures[currWidthImageIdx]);
      };


/*                     SHAPE SELECTOR BUTTON                     */      
      var currShapeIdx = 0;
      shapeSelectorButton.bind('click', function(){
        // actually do something when shape selector is clicked!
        console.log("changing shapes doesn't actually do anything!!!");
        shapeSelectorButton.cycle();
      });

      shapeSelectorButton.cycle = function(){
        currShapeIdx = (currShapeIdx + 1) % shapePictures.length;
        shapeSelectorButton.attr('src', shapePictures[currShapeIdx]);
      };

      chatTextArea.keyup(function(event){
          if(event.keyCode == 13){   // press Enter
            var theMessage = $('#chat-text-area').val();
            var messageTime = new Date();
            displayChatMessage('Me', theMessage, messageTime);
            $('#chat-text-area').val('');
            socket.emit('chatMessage', {from: myName, message: theMessage, time:messageTime});
          }
      });




    };

    function socketThings() {
      socket.on('loginAllow', function(data){
        console.log('login successful!');
        $('#view-login').css('visibility', 'hidden');
        $('#view-canvas').css('visibility', 'visible');
        
        bindDrawThings();

        myName = data.yourName; 
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

      socket.on('newObject', function(data){
        console.log('new object received! ' + JSON.stringify(data));
      });
    };


/*
    function togglePencilPicture(){
      /*
      var pencilPicture = pencilButton.attr('src');
      var upPic = '/images/pencilUp.png';
      var downPic = '/images/pencilDown.png';
      if(pencilPicture === upPic)
        pencilButton.attr('src', downPic);
      else
        pencilButton.attr('src', upPic);
      */
    //}


    function displayChatMessage(from, theMessage, time){
      var numHours;
      var numMinutes;
      if(time){
        numHours = time.getHours();
        numMinutes = time.getMinutes();
      }
      var messageObject = $('<li>');
      messageObject.text('[' + numHours + ':' + numMinutes + '] ' + from + ': ' + theMessage);

      messageObject.css('visibility', 'hidden');
      $('#message-list').append(messageObject);
      makeElementMultiline(messageObject);
    }

    function makeElementMultiline(element){
      element.text(addNewlines(element.text()));
      element.css('visibility', 'visible');
    }

    function addNewlines(str){
      var result = '';
      while (str.length > 0){
        result += str.substring(0, 50) + '\n';
        str = str.substring(50);
      }
      return result;
    }
    
    function addFromJSON(json) {
    	var newCanvas = '{"objects":[';
    	for (var i=0; i<canvas.getObjects().length; i++) {
        	newCanvas += JSON.stringify(canvas.getObjects()[i]) + ',';
        }
        newCanvas += json + ']}';
        canvas.loadFromJSON(newCanvas);
    	
    }
    

    

    
		
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