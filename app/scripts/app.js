var Tools = require('./tools.js'),
	Uploader = require('./puzzle-uploader.js'),
	Preview = require('./puzzle-preview.js'),
	Game = require('./puzzle-game.js');

// Default settings
var d = document,
	s = {
	uploadDropZoneView: d.querySelector('#upload-drop-zone'),
	puzzlePreviewView: d.querySelector('#puzzle-preview'),
	puzzleGameView: d.querySelector('#puzzle-game'),

	// Upload
	uploadInput: d.querySelector('#upload-input'),
	uploadImageBase64: '',
	uploadOverClass: 'drag-over',

	// Preview
	createPuzzleBtn: d.querySelector('#create-puzzle'),
	puzzlePreviewImgEl: d.querySelector('#puzzle-preview img'),

	// Game
	puzzleListEl: d.querySelector('#puzzle-list'),
	puzzleDropZonesEl: d.querySelector('#puzzle-dropzones'),
	draggedPuzzleHlClass: 'puzzle-highlight',
	dropZoneEnterClass: 'dz-highlight'
};

// Start the game
var start = function(config, callback) {
	// Detect if browser supports new HTML5 APIs
	if (!Tools.isNewAPISupported()) {
		alert('Make sure your browser is up to date. Consider using Chrome or Firefox.');
	}

	// Detect if user has low screen resolution
	if (Tools.isLowScreenRes()) {
		alert('You need a bigger screen to play comfortably.');
	}

	// Get user's defined options
	Tools.updateSettings(s, config);

	/**
	 * View 1
	 * Image uploader
	 */

	// Initialize image uploader
	Uploader.init(s)
	.then(function(imageBase64) {
		s.uploadImageBase64 = imageBase64;

		// Show uploaded image preview
		var img = s.puzzlePreviewImgEl;
		img.src = imageBase64;

	/**
	 * View 2
	 * Uploaded image preview
	 */
		
	}).then(Preview.init(s))
	.then(function() {

	/**
	 * View 3
	 * Game
	 */

		// Puzzle game view
		Game.init(s);
		Game.generatePuzzles(4, 4);
	});

	if (typeof callback === 'function') {
		callback();
	}
};

module.exports = {
	start: start
};