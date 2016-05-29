var Tools = require('./tools.js');

// Default settings
var s = {
	uploadImageBase64: '',
	puzzleListEl: {},
	puzzleDropZonesEl: {},
	draggedPuzzleHlClass: '',
	dropZoneEnterClass: ''
};

// Local variables
var w = window,
	d = document,
	e = d.documentElement,
	g = d.getElementsByTagName('body')[0],
	windowWidth = w.innerWidth || e.clientWidth || g.clientWidth;

var init = function(config) {
	// Get user's defined options
	Tools.updateSettings(s, config);
};

// Generate puzzles basing on chosen X and Y tiles amount
var generatePuzzles = function(tilesX, tilesY) {
	return new Promise(function(resolve, reject) {

		// X and Y tiles can be only integers
		if (tilesX === parseInt(tilesX, 10) && tilesY === parseInt(tilesY, 10)) {

			var resizedImageParts = [];

			resizeUploadedImage(s.uploadImageBase64, windowWidth)
			.then(function(resizedImgCode) {

				return splitImageIntoParts(resizedImgCode, tilesX, tilesY);

			}).then(function(parts) {

				resizedImageParts = parts.list;
				return drawPuzzleDropZone(tilesX, tilesY, parts.singleWidth, parts.singleHeight);

			}).then(function() {

				drawPuzzles(resizedImageParts, s.puzzleListEl);
				makePuzzlesDraggable();

			});

		} else {
			alert('Puzzle rows and columns can be only integers');
			reject();
		}
	});
};

// Resize the image proportionally so that it fits the 47.5% of screen width
// The rest is 5% free space and 47.5% for puzzle dropzones
var resizeUploadedImage = function(imageCode, wWidth) {

	var canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    img = new Image(),
    targetImageWidth = wWidth * 0.475;

	return new Promise(function(resolve, reject) {
    img.src = imageCode;
    img.onload = function() {

    	// If the image doesn't need to be resized (has less width than targeted)
    	// return the imageCode
    	if (img.width < targetImageWidth) {
  			resolve(imageCode);
    	} else {

				// Set image size basing on target width
				canvas.width = targetImageWidth;
				canvas.height = canvas.width * (img.height / img.width);

				// Draw source image into the off-screen canvas
				ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

				// Send a base64 coded new image
				resolve(canvas.toDataURL());
			}
		};
	});
};

var splitImageIntoParts = function(resizedImgCode, tilesX, tilesY) {
	var canvas = document.createElement('canvas'),
		ctx = canvas.getContext('2d'),
		img = new Image(),
		imgParts = [],
		singleWidth = 0,
		singleHeight = 0;

	return new Promise(function(resolve, reject) {

		// Prepare image to split into parts
		img.src = resizedImgCode;
		img.onload = function() {

			// Convert image (base64) to parts (single puzzles), using canvas
			singleWidth = img.width / tilesX;
			singleHeight = img.height / tilesY;

			for (var y = 0; y < tilesY; y++) {
				for (var x = 0; x < tilesX; x++) {
					
					canvas.width = singleWidth;
					canvas.height = singleHeight;
					
					// ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
					// sx, sy = calculate dynamically (source image)
					// dx, dy = 0 (we don't want to move the clipped image on new canvas)
					ctx.drawImage(img, x * singleWidth, y * singleHeight, singleWidth, singleHeight, 0, 0, singleWidth, singleHeight);

					// Store every image part in the array
					imgParts.push(canvas.toDataURL());
				}
			}

			var data = {
				list: imgParts,
				singleWidth: singleWidth,
				singleHeight: singleHeight
			};

			resolve(data);
		};
	});
};

var drawPuzzleDropZone = function(tilesX, tilesY, imgWidth, imgHeight) {
	var i = 0;

	return new Promise(function(resolve, reject) {
		for (var y = 0; y < tilesY; y++) {
			for (var x = 0; x < tilesX; x++) {

				var singleDz = document.createElement('div');

				singleDz.dataset.correctId = i+1;
				singleDz.style.width = imgWidth + 'px';
				singleDz.style.height = imgHeight + 'px';
				
				s.puzzleDropZonesEl.appendChild(singleDz);
				i++;
			}
		}

		resolve();
	});
};

var drawPuzzles = function(puzzleCodes, puzzleContainer) {
	var generatedImages = [],
		i = 0,
		len = 0;

	// Prepare puzzle elements
	// Set src, draggable, index
	for (i = 0, len = puzzleCodes.length; i < len; i++) {
		var singlePuzzle = document.createElement('img');
		
		singlePuzzle.src = puzzleCodes[i];
		singlePuzzle.setAttribute('draggable', true);
		singlePuzzle.dataset.index = i+1;

		generatedImages.push(singlePuzzle);
	}

	// Randomize the puzzles
	generatedImages = Tools.randomizeArray(generatedImages);

	// Draw images on screen
	for (i = 0, len = generatedImages.length; i < len; i++) {
		puzzleContainer.appendChild(generatedImages[i]);
	}
};

var correctPuzzleDrop = function(image, dropZone, dropZoneEvents) {
	// Show the guessed puzzle on single drop zone
	var imageSrc = image.src;
	dropZone.style.background = 'url(' + imageSrc + ')';

	// Remove the guessed puzzle
	s.puzzleListEl.removeChild(image);

	// Remove event listeners from the drop zone
	// To prevent dropping images on it
	for (var event in dropZoneEvents) {
	  if (dropZoneEvents.hasOwnProperty(event)) {
	    dropZone.removeEventListener(event, dropZoneEvents[event]);
	  }
	}
};

var incorrectPuzzleDrop = function() {};

/**
 * Puzzle events
 * Organized in an object
 */

var gameEvents = {};

/**
 * Single puzzle events
 */

// When the drag interaction starts
gameEvents.puzzleDragstart = function(e) {
	e.dataTransfer.effectAllowed = 'move';

	// Highlight currently dragged puzzle
	this.classList.add(s.draggedPuzzleHlClass);
	this.style.zIndex = '99';

	// Send data: current puzzle x, y position and index
	var style = window.getComputedStyle(e.target, null),
		posX = parseInt(style.getPropertyValue('left'), 10) - e.clientX,
		posY = parseInt(style.getPropertyValue('top'), 10) - e.clientY,
		puzzleIndex = this.dataset.index;

	e.dataTransfer.setData('text/plain', posX + ',' + posY + ',' + puzzleIndex);
};

// When the drag interaction finishes
// Remove highlight 
gameEvents.puzzleDragend = function(e) {
	this.classList.remove(s.draggedPuzzleHlClass);
};

/**
 * Body drag and drop events
 */

gameEvents.bodyPuzzleDrop = function(e) {
	e.preventDefault();
	
	var dropPuzzleData = e.dataTransfer.getData('text/plain').split(','),
		dropPuzzleIndex = parseInt(dropPuzzleData[2], 10),
		dropPuzzle = s.puzzleListEl.querySelector('img[data-index="' + dropPuzzleIndex + '"]');

	dropPuzzle.style.left = (e.clientX + parseInt(dropPuzzleData[0], 10)) + 'px';
	dropPuzzle.style.top = (e.clientY + parseInt(dropPuzzleData[1], 10)) + 'px';

	return false;
};

gameEvents.bodyDragOver = function(e) { 
	e.preventDefault(); 
	return false; 
};

/**
 * Drop zone events
 */

// When the dragged element is over the drop zone
gameEvents.dzDragover = function(e) {
	e.preventDefault();
	e.dataTransfer.dropEffect = 'move';

	return false;
};

// When the dragged element enters the drop zone
gameEvents.dzDragenter = function() {
	this.classList.add(s.dropZoneEnterClass);
};

// When the dragged element leaves the drop zone
gameEvents.dzDragleave = function() {
	this.classList.remove(s.dropZoneEnterClass);
};

// When the dragged element dropped in the drop zone
gameEvents.dzDrop = function(e) {
	e.preventDefault();
	e.stopPropagation();

	// Remove drop zone highlight
	this.classList.remove(s.dropZoneEnterClass);

	var dragPuzzleData = e.dataTransfer.getData('text/plain').split(','),
		dragPuzzleIndex = parseInt(dragPuzzleData[2], 10),
		dragImage = s.puzzleListEl.querySelector('img[data-index="' + dragPuzzleIndex + '"]');

	// Handle puzzle guesses
	if (parseInt(this.dataset.correctId, 10) === dragPuzzleIndex) {
		var dropZoneEvents = {
			'dragover': gameEvents.dzDragover,
			'dragenter': gameEvents.dzDragenter,
			'dragleave': gameEvents.dzDragleave,
			'drop': gameEvents.dzDrop
		};

		var dropZone = this;
		correctPuzzleDrop(dragImage, dropZone, dropZoneEvents);

	} else {
		incorrectPuzzleDrop();
	}

	return false;
};

// Add game drag and drop events
var makePuzzlesDraggable = function() {

	var puzzleDropZones = s.puzzleDropZonesEl.querySelectorAll('div'),
		singlePuzzles = s.puzzleListEl.querySelectorAll('img'),
		i = 0,
		len = 0;

	// Attach events to draggable puzzles
	for (i = 0, len = singlePuzzles.length; i < len; i++) {
		singlePuzzles[i].addEventListener('dragstart', gameEvents.puzzleDragstart);
		singlePuzzles[i].addEventListener('dragend', gameEvents.puzzleDragend);
	}

	// Attach events to puzzle drop zones
	for (i = 0, len = puzzleDropZones.length; i < len; i++) {
		puzzleDropZones[i].addEventListener('dragover', gameEvents.dzDragover);
		puzzleDropZones[i].addEventListener('dragenter', gameEvents.dzDragenter);
		puzzleDropZones[i].addEventListener('dragleave', gameEvents.dzDragleave);
		puzzleDropZones[i].addEventListener('drop', gameEvents.dzDrop);
	}

	// Attach events to body
	document.body.addEventListener('drop', gameEvents.bodyPuzzleDrop, false);
	document.body.addEventListener('dragover', gameEvents.bodyDragOver, false);
};

module.exports = {
	init: init,
	generatePuzzles: generatePuzzles
};