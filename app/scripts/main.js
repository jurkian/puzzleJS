(function() {

	var init = function() {

		// Detect if browser supports drag and drop and FileReader APIs
		if (typeof FileReader === 'undefined' && 'draggable' in document.createElement('span') === false ) {
			alert('Make sure your browser is up to date. Consider using Chrome or Firefox.');
		}

		var dropZone = document.querySelector('#drop-zone'),
				puzzlePreview = document.querySelector('#puzzle-preview'),
				puzzleGame = document.querySelector("#puzzle-game"),
				uploadImageBtn = document.querySelector("#upload-image"),
				imageCode = '',
				createPuzzleBtn = document.querySelector("#create-puzzle");

		// Initialize image uploader
		Uploader.init(dropZone, uploadImageBtn);

		// Handle other drop events
		document.body.addEventListener('dragenter', Uploader.addHover, false);
		document.body.addEventListener('dragleave', Uploader.removeHover, false);
		document.body.addEventListener('dragover', Uploader.cancelDefault, false);

		// Handle image drop event
		var handleImageDrop = function(e) {

			Uploader.handleDrop(e, function(image) {
				imageCode = image;

				// User uploaded an image
				// Go to puzzle preview
				App.changeView(puzzlePreview, function() {

					// Before it happens, remove events from body
					// We no longer need it to handle img uploading
					var b = document.body;
					b.removeEventListener('dragenter', Uploader.addHover);
					b.removeEventListener('dragleave', Uploader.removeHover);
					b.removeEventListener('dragover', Uploader.cancelDefault);
					b.removeEventListener('drop', handleImageDrop);

					// Show uploaded image preview
					var img = document.querySelector('#puzzle-preview img');
					img.src = imageCode;
				});
			});

		};

		document.body.addEventListener('drop', handleImageDrop, false);
		uploadImageBtn.addEventListener('change', handleImageDrop, false);

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
		
		// Puzzle game view
		var handlePuzzleGame = function() {

			// Initialize puzzle game
			Puzzle.init(imageCode);

			Puzzle.generatePuzzles(4, 4, function(puzzleCodes) {
				Puzzle.drawPuzzles(puzzleCodes, puzzleGame);
				Puzzle.makePuzzlesDraggable();
			});
		};
	};

	// Initialize the app if all assets are loaded
	window.addEventListener('load', init, false);

})();