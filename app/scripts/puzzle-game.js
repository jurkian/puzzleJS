var Tools = require('./tools.js'),
	Images = require('./images.js'),
	Generators = require('./generators.js');

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
			
			Images.resizeUploaded(s.uploadImageBase64, windowWidth)
			.then(function(resizedImgCode) {
				return Images.splitToParts(resizedImgCode, tilesX, tilesY);
			}).then(function(parts) {
				resizedImageParts = parts.list;
				return Generators.drawPuzzleDropZones(tilesX, tilesY, parts.singleWidth, parts.singleHeight, s.puzzleDropZonesEl);
			}).then(function() {
				Generators.drawPuzzles(resizedImageParts, s.puzzleListEl);
				makePuzzlesDraggable();
			});

		} else {
			alert('Puzzle rows and columns can be only integers');
			reject();
		}
	});
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