var Uploader = (function() {

	var _dropZone = '',
			_uploadImageBtn = '';

	var init = function(dropZone, uploadImageBtn) {
		_dropZone = dropZone;
		_uploadImageBtn = uploadImageBtn;
	};
	
	var addHover = function() {
		_dropZone.classList.add("drag-over");
	};

	var removeHover = function() {
		_dropZone.classList.remove("drag-over");
	};

	var handleDrop = function(e, callback) {
		e.preventDefault();
		e.stopPropagation();

		// Detect if user uploaded the image using drag and drop or file input method
		var uploadedFile = '';

		if (e.type === 'drop') {
			uploadedFile = e.dataTransfer.files;
		} else {
			uploadedFile = _uploadImageBtn.files;
		}

		if (uploadedFile.length !== 1) {
			alert('You can upload only 1 image - Try again');
		} else {

			if (uploadedFile[0].type.match('image.*')) {

				// There is one file and it's an image
				_getImage(uploadedFile[0], callback);

			} else {
				alert('You can upload only images');
			}
		}
		
		removeHover();
	};

	var cancelDefault = function(e) {
		e.preventDefault();
		return false;
	};

	var _getImage = function(file, callback) {
		var reader = new FileReader(),
				imageCode = '';

		reader.onload = function() {
			imageCode = reader.result;
			
			if (typeof callback === 'function') {
				callback(imageCode);
			}
		};

		reader.readAsDataURL(file);
	};

	return {
		init: init,
		addHover: addHover,
		removeHover: removeHover,
		cancelDefault: cancelDefault,
		handleDrop: handleDrop
	};

})();