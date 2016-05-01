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

			  _drawPuzzleDropZone(tilesX, tilesY, singleWidth, singleHeight);

			  // Randomize the puzzle images array
			  imgParts = App.randomizeArray(imgParts);

			  if (typeof callback === 'function') {
			  	callback(imgParts);
			  }	

			} else {
				alert('Puzzle rows and columns can be only integers');
				return false;
			}

		};
	};

	var _drawPuzzleDropZone = function(tilesX, tilesY, imgWidth, imgHeight) {
		var puzzleDropZoneEl = document.querySelector('#puzzle-game-dz');

	  for (var y = 0; y < tilesY; y++) {
	  	for (var x = 0; x < tilesX; x++) {
  			
  			var singleDz = document.createElement('div');

  			singleDz.classList.add('single-puzzle-game-dz');
  			singleDz.style.width = imgWidth + 'px';
  			singleDz.style.height = imgHeight + 'px';
  			
  			puzzleDropZoneEl.appendChild(singleDz);
	  	}
	  }
	};

	var makePuzzlesDraggable = function() {

		var puzzleDropZones = document.querySelectorAll('#puzzle-game-dz > div'),
				puzzleDragEls = document.querySelectorAll('#puzzle-list img'),
				elementDragged = null,
				i = 0,
				len = 0;

		// Drop zone/puzzles event handling functions
		var dzDragstart = function(e) {
			e.dataTransfer.effectAllowed = 'move';
			e.dataTransfer.setData('text', this.innerHTML);

			elementDragged = this;
		};

		var dzDragend = function(e) {
			elementDragged = null;
		};

		var dzDragover = function(e) {
			e.preventDefault();
			e.dataTransfer.dropEffect = 'move';

			return false;
		};

		var dzDragenter = function() {
			this.classList.add('dz-highlight');
		};

		var dzDragleave = function() {
			this.classList.remove('dz-highlight');
		};

		var dzDrop = function(e) {
			e.preventDefault();
	  	e.stopPropagation();

			this.classList.remove('dz-highlight');

			return false;
		};

		// Events for draggable puzzles
		for (i = 0, len = puzzleDragEls.length; i < len; i++) {

			// When the drag interaction starts
			puzzleDragEls[i].addEventListener('dragstart', dzDragstart);

			// When the drag interaction finishes
			puzzleDragEls[i].addEventListener('dragend', dzDragend);
		}

		// Events for puzzle drop zones
		for (i = 0, len = puzzleDropZones.length; i < len; i++) {

			// When the dragged element is over the drop zone
			puzzleDropZones[i].addEventListener('dragover', dzDragover);

			// When the dragged element enters the drop zone
			puzzleDropZones[i].addEventListener('dragenter', dzDragenter);

			// When the dragged element leaves the drop zone
			puzzleDropZones[i].addEventListener('dragleave', dzDragleave);

			// Event Listener for when the dragged element dropped in the drop zone.
			puzzleDropZones[i].addEventListener('drop', dzDrop);
		}

	};

	return {
		init: init,
		generatePuzzles: generatePuzzles,
		makePuzzlesDraggable: makePuzzlesDraggable
	};

})();