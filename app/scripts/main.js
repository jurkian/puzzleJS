var Tools = require('./tools.js'),
	Page = require('page'),
	View = require('./view.js'),
	Uploader = require('./puzzle-uploader.js'),
	Preview = require('./puzzle-preview.js'),
	Game = require('./puzzle-game.js');

// Run the game if all assets are loaded
var init = function() {

	// Local variables
	var uploadImageBase64 = '';

	// Detect if browser supports new HTML5 APIs
	if (!Tools.isNewAPISupported()) {
		alert('Make sure your browser is up to date. Consider using Chrome or Firefox.');
	}

	// Detect if user has low screen resolution
	if (Tools.isLowScreenRes()) {
		alert('You need a bigger screen to play comfortably.');
	}

	// Set routing

	View.init(document.querySelector('.wrapper'));

	/**
	 * View 1
	 * Image uploader
	 */

	Page('/', function() {
		View.load('views/index.html', function() {

			// Initialize image uploader
			Uploader.init({
				uploadDropZoneView: document.querySelector('#upload-drop-zone'),
				uploadInput: document.querySelector('#upload-input'),
				uploadOverClass: 'drag-over',
			})
			.then(function(imageBase64) {
				uploadImageBase64 = imageBase64;
				Page('preview');
			});
		});
	});

	/**
	 * View 2
	 * Uploaded image preview
	 */

	Page('preview', function() {
		View.loadTransition('views/preview.html', function() {

			// Initialize preview
			Preview.init({
				uploadImageBase64: uploadImageBase64,
				puzzlePreviewImgEl: document.querySelector('#puzzle-preview img')
			});

			var createPuzzles = function() {
				Page('game');
			};

			document.querySelector('#create-puzzle').addEventListener('click', createPuzzles, false);
		});
	});

	/**
	 * View 3
	 * Game
	 */

	Page('game', function() {
		View.loadTransition('views/game.html', function() {

			// Initialize game
			Game.init({
				uploadImageBase64: uploadImageBase64,
				puzzleListEl: document.querySelector('#puzzle-list'),
				puzzleDropZonesEl: document.querySelector('#puzzle-dropzones'),
				draggedPuzzleHlClass: 'puzzle-highlight',
				dropZoneEnterClass: 'dz-highlight'
			});

			document.querySelector('.wrapper').classList.add('game-wrapper');
			Game.generatePuzzles(4, 4);
		});
	});

	// Not found
	Page('*', function() {});
	Page();
};
window.addEventListener('load', init, false);