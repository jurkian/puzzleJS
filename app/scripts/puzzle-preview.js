var Tools = require('./tools.js');

// Settings
var s = {};

// User decided to create puzzles
// Go to puzzle game
var init = function(config) {

	// Get user's defined options
	Tools.updateSettings(s, config);

	// Show uploaded image preview
	var img = s.puzzlePreviewImgEl;
	img.src = s.uploadImageBase64;
};

module.exports.init = init;