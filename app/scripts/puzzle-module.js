var Puzzle = (function() {

	var _imageCode = '';

	var init = function(imageCode) {
		_imageCode = imageCode;
	};
	   
	var generatePuzzles = function(callback) {
		
		// Prepare image to split into parts
		var img = new Image();
		img.src = _imageCode;
		
		img.onload = function() {

			// Convert image (base64) to parts (single puzzles), using canvas
			var canvas = document.createElement("canvas"),
					ctx = canvas.getContext("2d"),
					imgParts = [],
					singleWidth = img.width / 6,
		      singleHeight = img.height / 6;
		  
		  canvas.width  = singleWidth;
		  canvas.height = singleHeight;

		  for (var i = 0; i < 12; i++) {

		    var x = (-singleWidth * i) % (singleWidth * 6),
		        y = (singleHeight * i) <= singleHeight ? 0 : -singleHeight;

		    ctx.drawImage(this, x, y, singleWidth * 6, singleHeight * 6); // img, x, y, w, h
		    imgParts.push(canvas.toDataURL()); // ("image/jpeg") for jpeg
		  }

		  callback(imgParts);
		};

	};

	return {
		init: init,
		generatePuzzles: generatePuzzles
	};

})();