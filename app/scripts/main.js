(function() {

	var init = function() {

		// Detect if browser supports new HTML5 APIs
		if (!App.isNewAPISupported()) {
			alert('Make sure your browser is up to date. Consider using Chrome or Firefox.');
		}

		var dropZone = document.querySelector('#drop-zone'),
				puzzlePreview = document.querySelector('#puzzle-preview'),
				puzzleGame = document.querySelector('#puzzle-game'),
				puzzleList = document.querySelector('#puzzle-list'),
				uploadImageBtn = document.querySelector('#upload-image'),
				imageCode = '',
				createPuzzleBtn = document.querySelector('#create-puzzle');

		/**
		 * View 1
		 * Image uploader
		 */
		
		// Initialize image uploader
		Uploader.init(dropZone, uploadImageBtn);

		// User uploaded an image
		var handleImageDrop = function(e) {
			Uploader.getDroppedImage(e, function(image) {
				imageCode = image;

				// Go to puzzle preview
				App.changeView(puzzlePreview, function() {

					// Before it happens, remove events from body
					// We no longer need it to handle img uploading
					Uploader.removeDragEvents();
					document.body.removeEventListener('drop', handleImageDrop);
					uploadImageBtn.removeEventListener('change', handleImageDrop);

					// Show uploaded image preview
					var img = document.querySelector('#puzzle-preview img');
					img.src = imageCode;
				});
			});
		};
		
		// Add image drop/file upload listeners
		document.body.addEventListener('drop', handleImageDrop, false);
		uploadImageBtn.addEventListener('change', handleImageDrop, false);

		/**
		 * View 2
		 * Uploaded image preview
		 */
		
		// User decided to create puzzles
		// Go to puzzle game
		var gotoPuzzleGame = function() {

			App.changeView(puzzleGame, function() {
				document.querySelector('.wrapper').classList.add('game-wrapper');
			}, function() {
				handlePuzzleGame();
			});
		};

		createPuzzleBtn.addEventListener('click', gotoPuzzleGame, false);
		
		/**
		 * View 3
		 * Game
		 */

		// Puzzle game view
		var handlePuzzleGame = function() {

			// Initialize puzzle game
			Puzzle.init(imageCode);

			Puzzle.generatePuzzles(4, 4)
			.then(function(puzzleCodes) {
				Puzzle.drawPuzzles(puzzleCodes, puzzleList);
				Puzzle.makePuzzlesDraggable();
			});
		};
	};

	// Initialize the app if all assets are loaded
	window.addEventListener('load', init, false);

})();