var CSSanimationHelper = require('./css-animation-helper.js');

var isNewAPISupported = function() {
	var features = {
		'fr': (typeof FileReader !== 'undefined'),
		'drag': ('draggable' in document.createElement('span') !== false),
		'canvas': !!document.createElement('canvas').getContext
	};

	return (features.fr && features.drag && features.canvas);
};

var isLowScreenRes = function() {
	if (window.innerWidth <= 800 && window.innerHeight <= 600) {
		return true;
	} else {
		return false;
	}
};

var changeView = function(newView, beforeShowingNew, callback) {
	// Get currently visible view
	var currentView = document.querySelector('.wrapper > .view:not(.hide-view)');

	// Hide current view (make it transparent)
	currentView.classList.add('transparent-view');

	currentView.onCSSTransitionEnd(function() {
		// Hide it completely
		currentView.classList.add('hide-view');

		currentViewHidden();
	});

	var currentViewHidden = function() {
		// Do this before the new view becomes visible
		if (typeof beforeShowingNew === 'function') {
			beforeShowingNew();
		}

		// Start showing the new view
		newView.classList.remove('hide-view');

		newView.onCSSTransitionEnd(function() {
			newView.classList.remove('transparent-view');
		});

		// Do this when the new view is fully visible
		if (typeof callback === 'function') {
			callback();
		}
	};
};

var randomizeArray = function(o) {
	for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
};

// Overwrite default settings with user's
var updateSettings = function(defaultSettings, newSettings) {
	for (var prop in newSettings) {
		if (newSettings.hasOwnProperty(prop)) {
			defaultSettings[prop] = newSettings[prop];
		}
	}
};

module.exports = {
	isNewAPISupported: isNewAPISupported,
	isLowScreenRes: isLowScreenRes,
	changeView: changeView,
	randomizeArray: randomizeArray,
	updateSettings: updateSettings
};