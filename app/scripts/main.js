(function() {

	var init = function() {

		// Detect if browser supports drag and drop and FileReader APIs
		if (typeof FileReader === 'undefined' && 'draggable' in document.createElement('span') === false ) {
			alert('Make sure your browser is up to date. Consider using Chrome or Firefox.');
		}

		var dropZone = document.querySelector('#drop-zone'),
				uploadImageBtn = document.querySelector("#upload-image"),
				puzzlePreview = document.querySelector('#puzzle-preview');

		// Initialize image uploader
		Uploader.init(dropZone, uploadImageBtn);

		// Handle other drop events
		dropZone.addEventListener('dragenter', Uploader.addHover, false);
		dropZone.addEventListener('dragleave', Uploader.removeHover, false);
		dropZone.addEventListener('dragover', Uploader.cancelDefault, false);

		// Handle image drop event
		var handleImageDrop = function(e) {

			Uploader.handleDrop(e, function(imageCode) {
				var img = document.createElement('img');
				
				img.src = imageCode;
				document.body.appendChild(img);
			});
			
		};

		dropZone.addEventListener('drop', handleImageDrop, false);
		uploadImageBtn.addEventListener('change', handleImageDrop, false);

	};

	// Initialize the app if all assets are loaded
	window.addEventListener('load', init, false);

})();