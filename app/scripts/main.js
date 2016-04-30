(function() {

	var init = function() {

		// Detect if browser supports drag and drop and FileReader APIs
		if (typeof FileReader === 'undefined' && 'draggable' in document.createElement('span') === false ) {
			alert('Make sure your browser is up to date. Consider using Chrome or Firefox.');
		}

		var dropZone = document.querySelector('#drop-zone'),
				uploadImageBtn = document.querySelector("#upload-image"),
				puzzlePreview = document.querySelector('#puzzle-preview'),
				imageCode = '';

		// Initialize image uploader
		Uploader.init(dropZone, uploadImageBtn);

		// Handle other drop events
		dropZone.addEventListener('dragenter', Uploader.addHover, false);
		dropZone.addEventListener('dragleave', Uploader.removeHover, false);
		dropZone.addEventListener('dragover', Uploader.cancelDefault, false);

		// Handle image drop event
		var handleImageDrop = function(e) {

			Uploader.handleDrop(e, function(image) {
				imageCode = image;
				gotoPuzzlePreview();
			});
			
		};

		dropZone.addEventListener('drop', handleImageDrop, false);
		uploadImageBtn.addEventListener('change', handleImageDrop, false);

		// User uploaded an image
		// Go to puzzle preview
		var gotoPuzzlePreview = function() {

			// Hide dropZone (transparent)
			dropZone.classList.add('transparent-view');

			// When dropZone transition ends			
			var dropZoneTransitionEnd = function(e) {

				// Hide dropZone completely
				dropZone.classList.add('hide-view');

				// Show puzzle preview
				handlePuzzlePreview();
			};

			dropZone.addEventListener('webkitTransitionEnd', dropZoneTransitionEnd, false);
			dropZone.addEventListener('transitionend', dropZoneTransitionEnd, false);
		};

		var handlePuzzlePreview = function() {
			
			// Show image preview
			var img = document.querySelector('#puzzle-preview img');
			img.src = imageCode;

			// Make the view visible
			puzzlePreview.classList.remove('transparent-view', 'hide-view');
		};

	};

	// Initialize the app if all assets are loaded
	window.addEventListener('load', init, false);

})();