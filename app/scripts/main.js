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
				createPuzzleBtn = document.querySelector("#create-puzzle"),
				puzzleList = document.querySelector("#puzzle-list");

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

			dropZone.onCSSTransitionEnd(function() {
				// Hide dropZone completely
				dropZone.classList.add('hide-view');

				// Show puzzle preview
				handlePuzzlePreview();
			});
		};

		// Puzzle preview view
		var handlePuzzlePreview = function() {
			
			// Show image preview
			var img = document.querySelector('#puzzle-preview img');
			img.src = imageCode;

			// Make the view visible
			puzzlePreview.classList.remove('hide-view');

			puzzlePreview.onCSSTransitionEnd(function() {
				puzzlePreview.classList.remove('transparent-view');
			});
		};

		// User decided to create puzzles
		// Go to puzzle game
		var gotoPuzzleGame = function() {

			// Hide puzzle preview (transparent)
			puzzlePreview.classList.add('transparent-view');

			puzzlePreview.onCSSTransitionEnd(function() {
				// Hide puzzlePreview completely
				puzzlePreview.classList.add('hide-view');

				// Show puzzle game
				handlePuzzleGame();
			});
		};

		createPuzzleBtn.addEventListener('click', gotoPuzzleGame, false);
		
		// Puzzle game view
		var handlePuzzleGame = function() {
			
			// Show puzzle game
			puzzleGame.classList.remove('hide-view');

			puzzleGame.onCSSTransitionEnd(function() {
				puzzleGame.classList.remove('transparent-view');
			});

			// Initialize puzzle game
			Puzzle.init(imageCode);

			Puzzle.generatePuzzles(function(generatedPuzzles) {
				
				// Output puzzles on body
				for (var i = 0, len = generatedPuzzles.length; i < len; i++) {
					var singlePuzzle = document.createElement("img");
					singlePuzzle.src = generatedPuzzles[i];

					var div = document.createElement('div');
					div.appendChild(singlePuzzle);
					document.body.appendChild(div);
				}
				
			});
		};
	};

	// Initialize the app if all assets are loaded
	window.addEventListener('load', init, false);

})();