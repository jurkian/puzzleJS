var Puzzle = (function() {

	var _imageCode = '';

	var init = function(imageCode) {
		_imageCode = imageCode;
	};
		 
	var generatePuzzles = function(tilesX, tilesY, callback) {
		
		// Prepare image to split into parts
		var img = new Image();

		img.src = _imageCode;
		img.onload = function() {

			if (tilesX === parseInt(tilesX, 10) && tilesY === parseInt(tilesY, 10)) {
			
				// Convert image (base64) to parts (single puzzles), using canvas
			  var canvas = document.createElement("canvas"),
			  		ctx = canvas.getContext("2d"),
			  		imgParts = [],
			  		singleWidth = img.width / tilesX,
			  		singleHeight = img.height / tilesY;

			  for (var y = 0; y < tilesY; y++) {
			  	for (var x = 0; x < tilesX; x++) {
		  			
		  			canvas.width = singleWidth;
		  			canvas.height = singleHeight;
		  			
		  			// ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
		  			// sx, sy = calculate dynamically (source image)
		  			// dx, dy = 0 (we don't want to move the clipped image on new canvas)
		  			ctx.drawImage(img, x * singleWidth, y * singleHeight, singleWidth, singleHeight, 0, 0, singleWidth, singleHeight);

			  		// Store the image data of each tile in the array
			  		imgParts.push(canvas.toDataURL()); // ("image/jpeg") for jpeg
			  	}
			  }

			  if (typeof callback === 'function') {
			  	callback(imgParts);
			  }	

			} else {
				alert('Puzzle rows and columns can be only integers');
				return false;
			}

		};
	};

	return {
		init: init,
		generatePuzzles: generatePuzzles
	};

})();