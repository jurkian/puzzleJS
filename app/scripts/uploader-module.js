var Uploader = (function() {

	var dropZoneEl = '',
			uploadBtnEl = '';

	var init = function(dropZone, uploadBtn) {
		dropZoneEl = dropZone;
		uploadBtnEl = uploadBtn;
	};
	
	var addHover = function() {
		dropZoneEl.classList.add('drag-over');
	};

	var removeHover = function() {
		dropZoneEl.classList.remove('drag-over');
	};

	var getDroppedImage = function(e, callback) {

		handleImageDrop(e).then(function(uploadedFile) {
			return getImageBase64(uploadedFile);
		}).then(function(imageBase64) {
			return callback(imageBase64);
		});

		addDragEvents();
		removeHover();
	};

	var handleImageDrop = function(e) {
		e.preventDefault();
		e.stopPropagation();

		return new Promise(function(resolve, reject) {
			// Detect if user uploaded the image using drag and drop or file input method
			var uploadedFile = '';

			uploadedFile = (e.type === 'drop') ? e.dataTransfer.files : uploadBtnEl.files;

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

	var cancelDefault = function(e) {
		e.preventDefault();
		return false;
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

	return {
		init: init,
		getDroppedImage: getDroppedImage,
		removeDragEvents: removeDragEvents
	};

})();