var Tools = require('./tools.js'),
	Page = require('page'),
	View = require('./view.js'),
	Uploader = require('./puzzle-uploader.js'),
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
	Page.base('/');

	/**
	 * View 1
	 * Image uploader
	 */

	Page('/', function() {
		View.load('views/index.html', function() {
			var createPuzzles = function() {
				Page('upload');
			};

			document.querySelector('#create-puzzles')
				.addEventListener('click', createPuzzles, false);
		});
	});

	/**
	 * View 2
	 * Uploaded image preview
	 */

	Page('upload', function() {
		View.loadTransition('views/upload.html', function() {

			// Initialize image uploader
			Uploader.init({
				uploadDropZoneView: document.querySelector('#upload-drop-zone'),
				uploadInput: document.querySelector('#upload-input'),
				uploadOverClass: 'drag-over',
			})
			.then(function(imageBase64) {
				uploadImageBase64 = imageBase64;
				Page('game');
			});
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