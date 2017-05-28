let Tools = require('./tools.js');

// Settings
let s = {};

let init = config => {

	return new Promise((resolve, reject) => {
		// Get user's defined options
		Tools.updateSettings(s, config);

		// Add drag and drop events
		addDragEvents();

		// User uploaded an image
		let imageUploaded = e => {
			getDroppedImage(e, imageBase64 => {

				// Remove events from body
				// We no longer need it to handle img uploading
				removeHover();
				removeDragEvents();

				document.body.removeEventListener('drop', imageUploaded);
				s.uploadInput.removeEventListener('change', imageUploaded);

				resolve(imageBase64);
			});
		};

		// Add image drop/file upload listeners
		document.body.addEventListener('drop', imageUploaded, false);
		s.uploadInput.addEventListener('change', imageUploaded, false);
	});
};

// Drag events
let addHover = () => s.uploadDropZoneView.classList.add(s.uploadOverClass);

let removeHover = () => s.uploadDropZoneView.classList.remove(s.uploadOverClass);

let cancelDefault = e => {
	e.preventDefault();
	return false;
};

let handleImageDrop = e => {
	e.preventDefault();
	e.stopPropagation();

	return new Promise((resolve, reject) => {
		// Detect if user uploaded the image using drag and drop or file input method
		let uploadedFile = '';

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

let getImageBase64 = file => {
	let reader = new FileReader(),
		imageCode = '';

	return new Promise((resolve, reject) => {
		reader.onload = () => {
			imageCode = reader.result;
			resolve(imageCode);
		};

		reader.readAsDataURL(file);
	});
};

let getDroppedImage = (e, callback) => {
	handleImageDrop(e).then(uploadedFile => {
		return getImageBase64(uploadedFile);
	}).then(imageBase64 => {
		return callback(imageBase64);
	});
};

// Add drag events
let addDragEvents = () => {
	document.body.addEventListener('dragenter', addHover, false);
	document.body.addEventListener('dragleave', removeHover, false);
	document.body.addEventListener('dragover', cancelDefault, false);
};

// Remove all registered drag and drop events
let removeDragEvents = () => {
	document.body.removeEventListener('dragenter', addHover);
	document.body.removeEventListener('dragleave', removeHover);
	document.body.removeEventListener('dragover', cancelDefault);
};

module.exports = {
	init
};