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

	var drawPuzzles = function(generatedPuzzles, puzzleContainer) {
		// How much area can the drawn puzzles take?
		// Let it be 80% screen width
		var w = window,
				d = document,
				e = d.documentElement,
				g = d.getElementsByTagName('body')[0],
				windowWidth = w.innerWidth || e.clientWidth || g.clientWidth,
				maxContainerWidth = windowWidth * 0.8,
				startingLeftPx = parseInt(windowWidth * 0.05, 10),
				startingTopPx = startingLeftPx;

		// Prepare and output puzzles
		for (var i = 0, len = generatedPuzzles.length; i < len; i++) {
			var singlePuzzle = document.createElement("img");
			
			singlePuzzle.src = generatedPuzzles[i];
			singlePuzzle.setAttribute('draggable', true);
			singlePuzzle.dataset.index = i+2;
			singlePuzzle.style.left = startingLeftPx * (i+1) + 'px';
			singlePuzzle.style.top = startingLeftPx * (i+1) + 'px';

			puzzleContainer.appendChild(singlePuzzle);
		}
	};

	var makePuzzlesDraggable = function() {

		var puzzleDropZones = document.querySelectorAll('#puzzle-game-dz > div'),
				singlePuzzles = document.querySelectorAll('#puzzle-game > img'),
				i = 0,
				len = 0;

		// Single puzzles event handlers

		// When the drag interaction starts
		var puzzleDragstart = function(e) {
			e.dataTransfer.effectAllowed = 'move';

			// Highlight currently dragged puzzle
			this.classList.add('puzzle-highlight');

			// Send data: current puzzle x, y position and index
			var style = window.getComputedStyle(e.target, null),
					posX = parseInt(style.getPropertyValue("left"), 10) - e.clientX,
					posY = parseInt(style.getPropertyValue("top"), 10) - e.clientY,
					puzzleIndex = this.dataset.index;

			e.dataTransfer.setData("text/plain", posX + ',' + posY + ',' + puzzleIndex);
		};

		// When the drag interaction finishes
		var puzzleDragend = function(e) {
			// Remove highlight 
			this.classList.remove('puzzle-highlight');
		};

		// Body drag events
		var bodyPuzzleDrop = function(e) { 
			
			var dPuzzleData = e.dataTransfer.getData("text/plain").split(','),
					dPuzzleIndex = parseInt(dPuzzleData[2], 10),
					dPuzzle = document.querySelector('#puzzle-game > img:nth-child(' + dPuzzleIndex + ')');

			dPuzzle.style.left = (e.clientX + parseInt(dPuzzleData[0], 10)) + 'px';
			dPuzzle.style.top = (e.clientY + parseInt(dPuzzleData[1], 10)) + 'px';

			e.preventDefault();
			return false;
		};

		var bodyDragOver = function(e) { 
			e.preventDefault(); 
			return false; 
		};

		document.body.addEventListener('drop', bodyPuzzleDrop, false);
		document.body.addEventListener('dragover', bodyDragOver, false);

		// Drop zone event handlers

		// When the dragged element is over the drop zone
		var dzDragover = function(e) {
			e.preventDefault();
			e.dataTransfer.dropEffect = 'move';

			return false;
		};

		// When the dragged element enters the drop zone
		var dzDragenter = function() {
			this.classList.add('dz-highlight');
		};

		// When the dragged element leaves the drop zone
		var dzDragleave = function() {
			this.classList.remove('dz-highlight');
		};

		// When the dragged element dropped in the drop zone
		var dzDrop = function(e) {
			e.preventDefault();
			e.stopPropagation();

			this.classList.remove('dz-highlight');

			return false;
		};

		// Attach events for draggable puzzles
		for (i = 0, len = singlePuzzles.length; i < len; i++) {
			singlePuzzles[i].addEventListener('dragstart', puzzleDragstart);
			singlePuzzles[i].addEventListener('dragend', puzzleDragend);
		}

		// Attach events for puzzle drop zones
		for (i = 0, len = puzzleDropZones.length; i < len; i++) {
			puzzleDropZones[i].addEventListener('dragover', dzDragover);
			puzzleDropZones[i].addEventListener('dragenter', dzDragenter);
			puzzleDropZones[i].addEventListener('dragleave', dzDragleave);
			puzzleDropZones[i].addEventListener('drop', dzDrop);
		}

	};

	return {
		init: init,
		generatePuzzles: generatePuzzles,
		drawPuzzles: drawPuzzles,
		makePuzzlesDraggable: makePuzzlesDraggable
	};

})();