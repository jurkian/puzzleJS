var Tools = require('./tools.js');

// Settings
var s = {
	uploadDropZoneView: {},
	uploadInput: {},
	uploadOverClass: {},
	puzzlePreviewView: {}
};

var init = function(config) {

	return new Promise(function(resolve, reject) {
		// Get user's defined options
		Tools.updateSettings(s, config);

		// Add drag and drop events
		addDragEvents();

		// User uploaded an image
		var imageUploaded = function(e) {
			getDroppedImage(e, function(imageBase64) {

				// Remove events from body
				// We no longer need it to handle img uploading
				removeHover();
				removeDragEvents();

				document.body.removeEventListener('drop', imageUploaded);
				s.uploadInput.removeEventListener('change', imageUploaded);

				// Go to puzzle preview
				Tools.changeView(s.puzzlePreviewView, function() {
					resolve(imageBase64);
				});	
			});
		};

		// Add image drop/file upload listeners
		document.body.addEventListener('drop', imageUploaded, false);
		s.uploadInput.addEventListener('change', imageUploaded, false);
	});
};

// Drag events
var addHover = function() {
	s.uploadDropZoneView.classList.add(s.uploadOverClass);
};

var removeHover = function() {
	s.uploadDropZoneView.classList.remove(s.uploadOverClass);
};

var cancelDefault = function(e) {
	e.preventDefault();
	return false;
};

var handleImageDrop = function(e) {
	e.preventDefault();
	e.stopPropagation();

	return new Promise(function(resolve, reject) {
		// Detect if user uploaded the image using drag and drop or file input method
		var uploadedFile = '';

		uploadedFile = (e.type === 'drop') ? e.dataTransfer.files : s.uploadInput.files;

		if (uploadedFile.length !== 1) {
			alert('You can upload only 1 image - Try again');
		} else {

			if (uploadedFile[0].type.match('image.*')) {
				// There is one file and it's an image 
				resolve(uploadedFile[0]);
			} else {
				alert('You can upload only images');
				reject();
			}
		}
	});
};

var getImageBase64 = function(file) {
	var reader = new FileReader(),
		imageCode = '';

	return new Promise(function(resolve, reject) {
		reader.onload = function() {
			imageCode = reader.result;
			resolve(imageCode);
		};

		reader.readAsDataURL(file);
	});
};

var getDroppedImage = function(e, callback) {
	handleImageDrop(e).then(function(uploadedFile) {
		return getImageBase64(uploadedFile);
	}).then(function(imageBase64) {
		return callback(imageBase64);
	});
};

// Add drag events
var addDragEvents = function() {
	document.body.addEventListener('dragenter', addHover, false);
	document.body.addEventListener('dragleave', removeHover, false);
	document.body.addEventListener('dragover', cancelDefault, false);
};

// Remove all registered drag and drop events
var removeDragEvents = function() {
	document.body.removeEventListener('dragenter', addHover);
	document.body.removeEventListener('dragleave', removeHover);
	document.body.removeEventListener('dragover', cancelDefault);
};

module.exports = {
	init: init
};