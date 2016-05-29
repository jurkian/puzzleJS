var App = require('./app.js');

// Run the game if all assets are loaded
var init = function() {

	// Settings
	var d = document,
		settings = {
		// Views
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

	App.start(settings);

};
window.addEventListener('load', init, false);