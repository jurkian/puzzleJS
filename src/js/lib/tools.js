import './css-animation-helper';

let Tools = {};

Tools.isNewAPISupported = () => {
	let features = {
		'fr': (typeof FileReader !== 'undefined'),
		'drag': ('draggable' in document.createElement('span') !== false),
		'canvas': !!document.createElement('canvas').getContext
	};

	return (features.fr && features.drag && features.canvas);
};

Tools.isLowScreenRes = () => {
	if (window.innerWidth <= 800 && window.innerHeight <= 600) {
		return true;
	} else {
		return false;
	}
};

Tools.changeView = (newView, beforeShowingNew, callback) => {
	// Get currently visible view
	let currentView = document.querySelector('.wrapper > .view:not(.hide-view)');

	// Hide current view (make it transparent)
	currentView.classList.add('transparent-view');

	currentView.onCSSTransitionEnd(() => {
		// Hide it completely
		currentView.classList.add('hide-view');

		currentViewHidden();
	});

	let currentViewHidden = () => {
		// Do this before the new view becomes visible
		if (typeof beforeShowingNew === 'function') {
			beforeShowingNew();
		}

		// Start showing the new view
		newView.classList.remove('hide-view');

		newView.onCSSTransitionEnd(() => {
			newView.classList.remove('transparent-view');
		});

		// Do this when the new view is fully visible
		if (typeof callback === 'function') {
			callback();
		}
	};
};

Tools.randomizeArray = o => {
	for(let j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
};

// Overwrite default settings with user's
Tools.updateSettings = (defaultSettings, newSettings) => {
	for (let prop in newSettings) {
		if (newSettings.hasOwnProperty(prop)) {
			defaultSettings[prop] = newSettings[prop];
		}
	}
};

export default Tools;