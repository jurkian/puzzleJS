var Tools = require('./tools.js'),
	Uploader = require('./puzzle-uploader.js'),
	Preview = require('./puzzle-preview.js'),
	Game = require('./puzzle-game.js');

// Run the game if all assets are loaded
var init = function() {

	// Detect if browser supports new HTML5 APIs
	if (!Tools.isNewAPISupported()) {
		alert('Make sure your browser is up to date. Consider using Chrome or Firefox.');
	}

	// Detect if user has low screen resolution
	if (Tools.isLowScreenRes()) {
		alert('You need a bigger screen to play comfortably.');
	}

	var d = document;

	// Settings
	var	s = {
		// Views
		uploadDropZoneView: d.querySelector('#upload-drop-zone'),
		puzzlePreviewView: d.querySelector('#puzzle-preview'),
		puzzleGameView: d.querySelector('#puzzle-game'),

		// 1. Upload
		uploadInput: d.querySelector('#upload-input'),
		uploadImageBase64: '',
		uploadOverClass: 'drag-over',

		// 2. Preview
		createPuzzleBtn: d.querySelector('#create-puzzle'),
		puzzlePreviewImgEl: d.querySelector('#puzzle-preview img'),

		// 3. Game
		puzzleListEl: d.querySelector('#puzzle-list'),
		puzzleDropZonesEl: d.querySelector('#puzzle-dropzones'),
		draggedPuzzleHlClass: 'puzzle-highlight',
		dropZoneEnterClass: 'dz-highlight'
	};

	/**
	 * View 1
	 * Image uploader
	 */
	
	// Initialize image uploader
	Uploader.init(s);

	// User uploaded an image
	var handleImageDrop = function(e) {
		Uploader.getDroppedImage(e, function(image) {
			s.uploadImageBase64 = image;

			// Go to puzzle preview
			Tools.changeView(s.puzzlePreviewView, function() {

				// Before it happens, remove events from body
				// We no longer need it to handle img uploading
				Uploader.removeDragEvents();
				document.body.removeEventListener('drop', handleImageDrop);
				s.uploadInput.removeEventListener('change', handleImageDrop);

				// Show uploaded image preview
				var img = s.puzzlePreviewImgEl;
				img.src = s.uploadImageBase64;
			});
		});
	};

	// Add image drop/file upload listeners
	document.body.addEventListener('drop', handleImageDrop, false);
	s.uploadInput.addEventListener('change', handleImageDrop, false);

	/**
	 * View 2
	 * Uploaded image preview
	 */

	// User decided to create puzzles
	// Go to puzzle game
	var gotoPuzzleGame = function() {

		Tools.changeView(s.puzzleGameView, function() {
			document.querySelector('.wrapper').classList.add('game-wrapper');
		}, function() {
			handlePuzzleGame();
		});
	};

	s.createPuzzleBtn.addEventListener('click', gotoPuzzleGame, false);

	/**
	 * View 3
	 * Game
	 */

	// Puzzle game view
	var handlePuzzleGame = function() {

		// Initialize puzzle game
		Game.init(s);

		Game.generatePuzzles(4, 4)
		.then(function(puzzleCodes) {
			Game.drawPuzzles(puzzleCodes, s.puzzleListEl);
			Game.makePuzzlesDraggable();
		});
	};
};
window.addEventListener('load', init, false);