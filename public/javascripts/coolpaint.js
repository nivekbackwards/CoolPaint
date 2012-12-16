define(['jquery', 'fabric', 'socketIO', 'diff_match_patch'], function($, fabric, socket, diff_match_patch){

    var myName = null;
    var myColor = getRandomColor();

    var userColorMapping = {};

    var canvas;
    var prevCanvasJSON = "";
    var currCanvasJSON = "";

    var rastaButton;
    var clearCanvasButton;
    var pencilButton;
    var handButton;
    var widthButton;
    var connectButton;
    var colorPicker;
    var selected = null;
    var chatTextArea;
    var connectedUserList;
    var textInput;

    var lineWidthPictures = [];
    
    var lastObj;
    var lineWidth = 3;
    var color = 'FFFFFF'


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


      console.log('background color is');
      console.log($(this).css('background-color'));
		});

    function loadImages(){
      lineWidthPictures.push('/images/width1.png');
      lineWidthPictures.push('/images/width2.png');
      lineWidthPictures.push('/images/width3.png');
      lineWidthPictures.push('/images/width4.png');
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
      pencilButton          = $("#pencilButton");
      chatTextArea          = $('#chat-text-area');
      handButton            = $('#handButton');
      widthButton           = $('#widthButton');
      connectedUserList     = $('#connectedUsers');
      colorPicker           = $('#colorPicker');
      connectButton         = $('#connectButton');
      rastaButton           = $('#rastaButton');
      clearCanvasButton     = $('#clearCanvasButton');
      canvas = new fabric.Canvas('my-canvas');
      prevCanvasJSON = JSON.stringify(canvas);
      currCanvasJSON = JSON.stringify(canvas);
      

      mouseDownAttach();
      mouseMoveAttach();
      mouseUpAttach();
      bindDelete();
      
/*                     PENCIL BUTTON                     */
      pencilButton.bind('click', function() {
        canvas.isDrawingMode = true;

        if(selected !== null && selected !== pencilButton)
          selected.toggleOff();
        pencilButton.toggleOn();

        //Clear the options menu, then move the pencil options up
        $('#optionButtons .option').appendTo($('#hiddenOptionButtons'));
        
        $('#hiddenOptionButtons #colorPicker').appendTo($('#optionButtons'));
        $('#hiddenOptionButtons #widthButton').appendTo($('#optionButtons'));
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
        canvas.isDrawingMode = false;

        // actually do something with this handbutton click
        if(selected !== null && selected !== handButton)
          selected.toggleOff();
        handButton.toggleOn();

        //Clear the options menu, then move the hand options up
        $('#optionButtons .option').appendTo($('#hiddenOptionButtons'));
        $('#hiddenOptionButtons #connectButton').appendTo($('#optionButtons'));
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

      
/*						COLOR PICKER					*/
	  colorPicker.change(function() {
	  	console.log('colorPicker change');
	  	color = colorPicker.val();
	  	canvas.freeDrawingColor = color;
	  });
		


/*                     WIDTH BUTTON                     */      
      var currWidthImageIdx = 1;
      canvas.freeDrawingLineWidth = lineWidth;
      widthButton.bind('click', function(){
        // actually do something when width button is clicked
        console.log("clicking width doesn't do anything");
        widthButton.cycle();
      });

      widthButton.cycle = function(){
        currWidthImageIdx = (currWidthImageIdx + 1) % lineWidthPictures.length;
        widthButton.attr('src', lineWidthPictures[currWidthImageIdx]);
        lineWidth = 2 * currWidthImageIdx + 1;
        canvas.freeDrawingLineWidth = lineWidth;
      };

      connectButton.click(function() {
        // var curSelectedObjects = new Array();
        // curSelectedObjects = canvas.getObjects(canvas.getActiveGroup);

        var group = new fabric.Group();
        // var group;
        // console.log(group);
        // group.initialize(canvas.getObjects(canvas.getActiveGroup));
        var top = canvas.getActiveGroup().top;
        var left = canvas.getActiveGroup().left;

        objArray = [];

        canvas.getActiveGroup().forEachObject(function(o){ 
          if(o instanceof fabric.Group){
            console.log("WE GOT A GROUP");
            o.forEachObject(function(o2){
              console.log("subObject");
              // group.addWithUpdate(o2.clone());
              objArray.push(o2.clone());
              });
            canvas.remove(o);
          }
          else{
            console.log("lets all go to the movies")
            // group.addWithUpdate(o.clone()); 
            objArray.push(o.clone());
            canvas.remove(o);
          }
        });

        for(var i = 0; i < objArray.length; i++)
          group.addWithUpdate(objArray[i]);

        group.set('top', top);
        group.set('left', left);
        canvas.setActiveObject(group);
        canvas.add(group);
        // group.center();


      });

      rastaButton.click(function() {
        var answer = confirm("Rasta-rize the image, mon?", "Rasterization");
        if (answer && fabric.Canvas.supports('toDataURL')) {
          window.open(canvas.toDataURL('png'));
        }
      });

      clearCanvasButton.click(function() {
        var answer = confirm("Are you sure you want to clear the canvas?", "Clear canvas?");
        if (answer) {
          canvas.clear();
          sendPatches();
        }
      });

    };
    
/*						DELETE								*/
	function bindDelete(){
		$(document).keyup(function(event){
        	if(event.keyCode == 46){    // press Delete
    			var obj = canvas.getActiveObject();
    			console.log(obj);
				if (obj !== null) {
          			obj.remove();
          		}  else {
           				var arrObj = canvas.getActiveGroup().getObjects();
           				console.log(arrObj);
           				for (var i=0; i<arrObj.length; i++) {
	           				arrObj[i].remove();
           				}
           		}
           		sendPatches();
          	}
        });
    }

/*						MOUSE DOWN							*/
	function mouseDownAttach() {
		canvas.observe('mouse:down', function(e) {
			sendPatches();
		});
	};
	

/*						MOUSE MOVE							*/
	function mouseMoveAttach() {
		canvas.observe('mouse:move', function(e) {
			sendPatches();
		});
	};
    
/*						MOUSE UP							*/
    function mouseUpAttach() {
     	canvas.observe('mouse:up', function(e) {
			sendPatches();
     	});
     };
     
/*						SEND PATCHES							*/
	function sendPatches() {
		currCanvasJSON = JSON.stringify(canvas);
    	var patches = diff_match_patch.patch_make(prevCanvasJSON, currCanvasJSON);
    	//console.log(patches);
    	socket.emit('canvasDiff', {patches: patches});
    	prevCanvasJSON = currCanvasJSON;
    }
	

    function socketThings() {
      socket.on('loginAllow', function(data){
        console.log('login successful!');
        $('#view-login').css('visibility', 'hidden');
        $('#view-canvas').css('visibility', 'visible');
        
        bindDrawThings();

        myName = data.yourName; 
      });

      socket.on('chatMessage', function(data){
        displayChatMessage(createMessageElt(data.message, data.from, new Date()));
      });

      socket.on('messages', function(data){
        var messages = data.messageList;
        console.log('received lots of messages ' + JSON.stringify(messages));
        for(var i=0; i<messages.length; i++)
          displayChatMessage(createMessageElt( messages[i].message, messages[i].from, new Date() ));
      });

      socket.on('loginReject', function(){
        console.log('username rejected');
      });

      socket.on('canvasDiff', function(data){
        console.log('new canvasDiff received=' + data.patches );
        currCanvasJSON = diff_match_patch.patch_apply(data.patches, currCanvasJSON)[0];
        prevCanvasJSON = currCanvasJSON;
        canvas.loadFromJSON(currCanvasJSON);
      });
      
      socket.on('canvasJSON', function(data) {
        console.log('received new canvas!!!');
        //console.log(data.canvas);
      	currCanvasJSON = data.canvas;
      	prevCanvasJSON = currCanvasJSON;
      	canvas.loadFromJSON(currCanvasJSON);
      });

      socket.on('users', function(data){
        var userList = data.userList;

        console.log('got a whole bunch of users {' + userList + '} ... (there are ' + userList.length + ')');
        var message = '';

        var otherUsers = [];

        for(var i=0; i<userList.length; i++){
          if(userList[i] !== myName)
            otherUsers.push(userList[i]);
        }

        if(otherUsers.length == 0)
          return;

        var color;
        if(otherUsers.length === 1){
          color = userColorMapping[otherUsers[0]] = getRandomColor();
          console.log('there is one user here and his color is [' + color + ']');
        }
        else
          color = getRandomColor();

        for(var i=0; i<otherUsers.length; i++){
          var username = otherUsers[i];
          console.log('user [' + username + '] joined');

          addUser(username);
          message += username;




          if(otherUsers.length > 1){
            if(i==0 && otherUsers.length == 2)
                message += ' and ';
              else{
                if(i<otherUsers.length-1){
                  message += ', ';
                  if(i==otherUsers.length-2 && otherUsers.length > 2)
                    message += 'and ';

                }
              }
          }

        }

        if(otherUsers.length > 1)
          message += ' are';
        else if(otherUsers.length == 1)
          message += ' is';        
        message += ' here now!';
        
        var msgElt = createMessageElt(message);
        console.log('the color is ' + color)
        msgElt.css('color', color);
        displayChatMessage(msgElt);

      });

      socket.on('userJoined', function(data){
        var username = data.username;
        addUser(username);
        
        var infoElt = createMessageElt(username + ' has joined the party!');
        infoElt.css('color', userColorMapping[username]);
        displayChatMessage(infoElt);

        
      }); 

      socket.on('userLeft', function(data){
        var username = data.username;
        if(username){
          var infoElt = createMessageElt(username + ' has left the party');
          infoElt.css('color', userColorMapping[username]);
          displayChatMessage(infoElt);

          removeUser(data.username);
        }

      });

    };

    function addUser(username){
      if(username !== myName){      // because we don't want to draw our own name in the userlist...
        console.log('adding [' + username + ']');
        if(!userColorMapping[username]){
          console.log('there is no color mapping so...');
          userColorMapping[username] = getRandomColor();
        }

        var newUserElt = $('<li>');
        newUserElt.attr('id', 'user_' + username);
        newUserElt.css('color', userColorMapping[username]);
        newUserElt.text(username);
        connectedUserList.append(newUserElt);
      }
    };

    function removeUser(username){
      if(username !== null){
        console.log('user [' + username + '] left');
        var id = '#user_' + username;
        $(id).remove();
        userColorMapping.username = null;
      }
    };

    function createMessageElt(messagePayload, from, time){
      var messageObject = $('<li>');
      var messageText = "";      

      if(time){
        var numHours = time.getHours();
        var numMinutes = time.getMinutes();
        messageText += '[' + numHours + ':' + numMinutes + '] ';
      }
      if(from){
        messageText += from + ': ';
        if(!userColorMapping[from])
          userColorMapping[from] = getRandomColor();
        messageObject.css('color', userColorMapping[from]);
      }

      messageText += messagePayload;
      messageObject.text(messageText);

      return messageObject;
    };

    function displayChatMessage(messageObject){  
      messageObject.css('visibility', 'hidden');
      $('#message-list').append(messageObject);
      messageObject.text(addNewlines(messageObject.text()));
      messageObject.css('visibility', 'visible');

      $('#message-list').animate({
        scrollTop: messageObject.offset().top
      }, 0);
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

      function getRandomColor(){
        var r = Math.floor(Math.random()*256);
        var g = Math.floor(Math.random()*256);
        var b = Math.floor(Math.random()*256);

        // darkens the color by 20%
        var lightPercentage = .80;
        r = parseInt(r*lightPercentage);
        g = parseInt(g*lightPercentage);
        b = parseInt(b*lightPercentage);

        return getHex(r,g,b);
      };

      function intToHex(n){
        n = n.toString(16);
        if(n.length < 2)
          n = "0"+n;
        return n;
      };

      function getHex(r,g,b){
        var colorString = '#' + intToHex(r) + intToHex(g) + intToHex(b);
        return colorString;
      };
});