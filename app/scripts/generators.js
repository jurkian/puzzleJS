var Tools = require('./tools.js');

var drawPuzzles = function(puzzleCodes, puzzleContainer) {
	var generatedImages = [],
		i = 0,
		len = 0;

	// Prepare puzzle elements
	// Set src, draggable, index
	for (i = 0, len = puzzleCodes.length; i < len; i++) {
		var singlePuzzle = document.createElement('img');

		singlePuzzle.src = puzzleCodes[i];
		singlePuzzle.setAttribute('draggable', true);
		singlePuzzle.dataset.index = i+1;

		generatedImages.push(singlePuzzle);
	}

	// Randomize the puzzles
	generatedImages = Tools.randomizeArray(generatedImages);

	// Draw images on screen
	for (i = 0, len = generatedImages.length; i < len; i++) {
		puzzleContainer.appendChild(generatedImages[i]);
	}
};

var drawPuzzleDropZones = function(tilesX, tilesY, imgWidth, imgHeight, dropZonesEl) {
	
	return new Promise(function(resolve, reject) {
		var i = 0;

		for (var y = 0; y < tilesY; y++) {
			for (var x = 0; x < tilesX; x++) {

				var singleDz = document.createElement('div');

				singleDz.dataset.correctId = i+1;
				singleDz.style.width = imgWidth + 'px';
				singleDz.style.height = imgHeight + 'px';
				
				dropZonesEl.appendChild(singleDz);
				i++;
			}
		}

		resolve();
	});
};

module.exports = {
	drawPuzzles: drawPuzzles,
	drawPuzzleDropZones: drawPuzzleDropZones
};