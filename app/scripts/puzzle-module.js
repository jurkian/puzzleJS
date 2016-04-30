var Puzzle = (function() {

	var _imageCode = '',
			_img = new Image();

	var init = function(imageCode) {
		_imageCode = imageCode;

		// Prepare image to split into parts
		_img.src = _imageCode;
		_img.onload = _split_image;
	};
	   
	var _split_image = function() {

		// Convert image (base64) to parts (single puzzles), using canvas
		var canvas = document.createElement("canvas"),
				ctx = canvas.getContext("2d"),
				imgParts = [],
				width2 = _img.width / 2,
	      height2 = _img.height / 2;
	  
	  canvas.width  = width2;
	  canvas.height = height2;

	  for (var i = 0; i < 4; i++) {

	    var x = (-width2 * i) % (width2 * 2),
	        y = (height2 * i) <= height2 ? 0 : -height2;

	    ctx.drawImage(this, x, y, width2 * 2, height2 * 2); // img, x, y, w, h
	    imgParts.push(canvas.toDataURL()); // ("image/jpeg") for jpeg

	    // Output on body element
	    var slicedImage = document.createElement("img");
	    slicedImage.src = imgParts[i];

	    var div = document.createElement('div');
	    div.appendChild(slicedImage);
	    document.body.appendChild(div);
	  }
	};

	return {
		init: init
	};

})();