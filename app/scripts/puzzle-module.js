var Puzzle = (function() {

	var imageCode = '',
		w = window,
		d = document,
		e = d.documentElement,
		g = d.getElementsByTagName('body')[0],
		windowWidth = w.innerWidth || e.clientWidth || g.clientWidth;

	var init = function(code) {
		imageCode = code;
	};
		 
	var generatePuzzles = function(tilesX, tilesY, callback) {

		if (tilesX === parseInt(tilesX, 10) && tilesY === parseInt(tilesY, 10)) {

			// Resize the image proportionally
			var img = new Image(),
					puzzleGameEl = document.querySelector('#puzzle-game'),
					resizedImgCode = '';

			resizeUploadedImage(imageCode, windowWidth, function(resizedImgCode) {
				// Prepare image to split into parts
				img.src = resizedImgCode;
				img.onload = function() {

					// Convert image (base64) to parts (single puzzles), using canvas
					var canvas = document.createElement('canvas'),
							ctx = canvas.getContext('2d'),
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
							imgParts.push(canvas.toDataURL());
						}
					}

					drawPuzzleDropZone(tilesX, tilesY, singleWidth, singleHeight);

					if (typeof callback === 'function') {
						callback(imgParts);
					}
				};
			});

		} else {
			alert('Puzzle rows and columns can be only integers');
			return false;
		}

	};

	var resizeUploadedImage = function(imageCode, wWidth, callback) {
		// Resize the image so that it fits the 47.5% of screen width
		// The rest is 5% free space and 47.5% for puzzle dropzones
		var canvas = document.createElement('canvas'),
		    ctx = canvas.getContext('2d'),
		    img = new Image(),
		    targetImageWidth = wWidth * 0.475;

    img.src = imageCode;
    img.onload = function() {

    	// If the image doesn't need to be resized (has less width than targeted)
    	// return the imageCode
    	if (img.width < targetImageWidth) {
    		
    		if (typeof callback === 'function') {
    			callback(imageCode);
    		}

    	} else {
				// Set image size basing on target width
				canvas.width = targetImageWidth;
				canvas.height = canvas.width * (img.height / img.width);

				// Draw source image into the off-screen canvas
				ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

				// Send a callback with base64 coded new image
				if (typeof callback === 'function') {
					callback(canvas.toDataURL());
				}
			}
		};
	};

	var drawPuzzleDropZone = function(tilesX, tilesY, imgWidth, imgHeight) {
		var puzzleDropZoneEl = document.querySelector('#puzzle-dropzones'),
				i = 0;

		for (var y = 0; y < tilesY; y++) {
			for (var x = 0; x < tilesX; x++) {
				
				var singleDz = document.createElement('div');

				singleDz.dataset.correctId = i+1;
				singleDz.style.width = imgWidth + 'px';
				singleDz.style.height = imgHeight + 'px';
				
				puzzleDropZoneEl.appendChild(singleDz);
				i++;
			}
		}
	};

	var drawPuzzles = function(puzzleCodes, puzzleContainer) {

		var generatedImages = [],
				i = 0,
				len = 0;

		// Prepare puzzle elements
		for (i = 0, len = puzzleCodes.length; i < len; i++) {
			var singlePuzzle = document.createElement('img');
			
			singlePuzzle.src = puzzleCodes[i];
			singlePuzzle.setAttribute('draggable', true);
			singlePuzzle.dataset.index = i+1;

			generatedImages.push(singlePuzzle);
		}

		// Randomize the puzzles
		generatedImages = App.randomizeArray(generatedImages);

		// Show ready images on screen
		for (i = 0, len = generatedImages.length; i < len; i++) {
			puzzleContainer.appendChild(generatedImages[i]);
		}
	};

	var makePuzzlesDraggable = function() {

		var puzzleDropZones = document.querySelectorAll('#puzzle-dropzones > div'),
				singlePuzzles = document.querySelectorAll('#puzzle-list > img'),
				i = 0,
				len = 0;

		// Single puzzles event handlers

		// When the drag interaction starts
		var puzzleDragstart = function(e) {
			e.dataTransfer.effectAllowed = 'move';

			// Highlight currently dragged puzzle
			this.classList.add('puzzle-highlight');
			this.style.zIndex = '99';

			// Send data: current puzzle x, y position and index
			var style = window.getComputedStyle(e.target, null),
					posX = parseInt(style.getPropertyValue('left'), 10) - e.clientX,
					posY = parseInt(style.getPropertyValue('top'), 10) - e.clientY,
					puzzleIndex = this.dataset.index;

			e.dataTransfer.setData('text/plain', posX + ',' + posY + ',' + puzzleIndex);
		};

		// When the drag interaction finishes
		var puzzleDragend = function(e) {
			// Remove highlight 
			this.classList.remove('puzzle-highlight');
		};

		// Body drag events
		var bodyPuzzleDrop = function(e) {
			
			var dPuzzleData = e.dataTransfer.getData('text/plain').split(','),
					dPuzzleIndex = parseInt(dPuzzleData[2], 10),
					dPuzzle = document.querySelector('#puzzle-list > img[data-index="' + dPuzzleIndex + '"]');

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

			// Remove drop zone highlight
			this.classList.remove('dz-highlight');

			var dPuzzleData = e.dataTransfer.getData('text/plain').split(','),
					dPuzzleIndex = parseInt(dPuzzleData[2], 10),
					dImage = document.querySelector('#puzzle-list > img[data-index="' + dPuzzleIndex + '"]');

			// Handle puzzle guesses
			if (parseInt(this.dataset.correctId, 10) === dPuzzleIndex) {
				var dropZoneEvents = {
					'dragover': dzDragover,
					'dragenter': dzDragenter,
					'dragleave': dzDragleave,
					'drop': dzDrop
				};

				var dropZone = this;
				correctPuzzleDrop(dImage, dropZone, dropZoneEvents);

			} else {
				incorrectPuzzleDrop();
			}

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

	var correctPuzzleDrop = function(image, dropZone, dropZoneEvents) {
		// Show the guessed puzzle on single drop zone
		var imageSrc = image.src;
		dropZone.style.background = 'url(' + imageSrc + ')';

		// Remove the guessed puzzle
		document.querySelector('#puzzle-list').removeChild(image);

		// Remove event listeners from the drop zone
		// To prevent dropping images on it
		for (var event in dropZoneEvents) {
		  if (dropZoneEvents.hasOwnProperty(event)) {
		    dropZone.removeEventListener(event, dropZoneEvents[event]);
		  }
		}
	};

	var incorrectPuzzleDrop = function() {};

	return {
		init: init,
		generatePuzzles: generatePuzzles,
		drawPuzzles: drawPuzzles,
		makePuzzlesDraggable: makePuzzlesDraggable
	};

})();