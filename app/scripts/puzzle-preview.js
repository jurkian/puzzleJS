var Tools = require('./tools.js');

var s = {
	createPuzzleBtn: {},
	puzzleGameView: {}
};

// User decided to create puzzles
// Go to puzzle game
var init = function(config) {

	// Get user's defined options
	Tools.updateSettings(s, config);

	var createPuzzles = function() {
		return new Promise(function(resolve, reject) {
			Tools.changeView(s.puzzleGameView, function() {
				document.querySelector('.wrapper').classList.add('game-wrapper');
			}, function() {
				resolve();
			});
		});
	};

	s.createPuzzleBtn.addEventListener('click', createPuzzles, false);

};

module.exports.init = init;