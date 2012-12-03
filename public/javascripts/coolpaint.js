define(['jquery', 'fabric'], function($, fabric){
    $(function () {
			console.log("hello from coolapint.js ready handler");
		});
		
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
    	
    	var canvas = new fabric.Canvas('my-canvas');
    	
    	var drawingModeEl = document.getElementById('drawing-mode');
    	
		drawingModeEl.onclick = function() {
    		canvas.isDrawingMode = !canvas.isDrawingMode;
    		if (canvas.isDrawingMode) {
      			drawingModeEl.innerHTML = 'Exit drawing mode';
      			drawingModeEl.className = 'is-drawing';
      			drawingOptionsEl.style.display = '';
    		}
    		else {
      			drawingModeEl.innerHTML = 'Enter drawing mode';
      			drawingModeEl.className = '';
      			drawingOptionsEl.style.display = 'none';
    		}
  		};
  		
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

      var testObj = {
        test:"hello from coolpaint module!"
      };

      return testObj;

});