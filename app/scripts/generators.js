let Tools = require('./tools.js');

let drawPuzzles = (puzzleCodes, puzzleContainer) => {
	let generatedImages = [],
		i = 0,
		len = 0;

	// Prepare puzzle elements
	// Set src, draggable, index
	puzzleCodes.forEach((el, index) => {
		let singlePuzzle = document.createElement('img');

		singlePuzzle.src = el;
		singlePuzzle.setAttribute('draggable', true);
		singlePuzzle.dataset.index = index + 1;

		generatedImages.push(singlePuzzle);
	});

	// Randomize the puzzles
	generatedImages = Tools.randomizeArray(generatedImages);

	// Draw images on screen
	generatedImages.forEach((el) => {
		puzzleContainer.appendChild(el);
	});
};

let drawPuzzleDropZones = (tilesX, tilesY, imgWidth, imgHeight, dropZonesEl) => {
	
	return new Promise((resolve, reject) => {
		let i = 0;

		for (let y = 0; y < tilesY; y++) {
			for (let x = 0; x < tilesX; x++) {

				let singleDz = document.createElement('div');

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
	drawPuzzles,
	drawPuzzleDropZones
};