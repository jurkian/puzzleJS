// General files
import '../robots.txt';

// HTML views
import './lib/html-views';

// Scss
import '../sass/site.scss';

let Tools = require('./lib/tools.js'),
	Page = require('page'),
	View = require('./lib/view.js'),
	Uploader = require('./lib/puzzle-uploader.js'),
	Game = require('./lib/puzzle-game.js');

// Run the game if all assets are loaded
let init = () => {

	// Local variables
	let uploadImageBase64 = '';

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

	Page('/', () => {
		View.load('views/index.html', () => {
			let createPuzzles = () => {
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

	Page('upload', () => {
		View.loadTransition('views/upload.html', () => {

			// Initialize image uploader
			Uploader.init({
				uploadDropZoneView: document.querySelector('#upload-drop-zone'),
				uploadInput: document.querySelector('#upload-input'),
				uploadOverClass: 'drag-over',
			})
			.then(imageBase64 => {
				uploadImageBase64 = imageBase64;
				Page('game');
			});
		});
	});

	/**
	 * View 3
	 * Game
	 */

	Page('game', () => {
		View.loadTransition('views/game.html', () => {

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
	Page('*', () => {});
	Page();
};

window.addEventListener('load', init, false);