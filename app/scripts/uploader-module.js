var Uploader = (function() {

	var _dropZone = document.querySelector("#drop-zone"),
			_uploadImageBtn = document.querySelector("#upload-image");
	
	var _addHover = function() {
		_dropZone.classList.add("drag-over");
	};

	var _removeHover = function() {
		_dropZone.classList.remove("drag-over");
	};

	var _handleDrop = function(e) {
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
				_generateImgPreview(uploadedFile[0]);
			} else {
				alert('You can upload only images');
			}
		}
		
		_removeHover();
	};

	var _cancelDefault = function(e) {
		e.preventDefault();
		return false;
	};

	var _generateImgPreview = function(file) {
		var reader = new FileReader(),
				img = document.createElement('img');

		reader.onload = function() {
			img.src = reader.result;
		};

		reader.readAsDataURL(file);
		document.body.appendChild(img);
	};

	var init = function() {
		_dropZone.addEventListener('dragenter', _addHover, false);
		_dropZone.addEventListener('dragleave', _removeHover, false);
		_dropZone.addEventListener('dragover', _cancelDefault, false);
		_dropZone.addEventListener('drop', _handleDrop, false);
		_uploadImageBtn.addEventListener('change', _handleDrop, false);
	};

	return {
		init: init
	};

})();