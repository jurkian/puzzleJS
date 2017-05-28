let Tools = {};

// Detect CSS transition or animation end
// and do callback
Tools.onCSSEnd = (type, element, callback) => {

	// > 94% global support, by caniuse.com
	let animationEvents = ['animationend', 'webkitAnimationEnd'],
		transitionEvents = ['transitionend', 'webkitTransitionEnd'];

	let onEnd = event => {
		callback();

		// When the transition/animation has finished, remove the event listener
		event.target.removeEventListener(event.type, onEnd);
	};

	if (type === 'transition') {
		transitionEvents.forEach(event => element.addEventListener(event, onEnd));
	} else {
		animationEvents.forEach(event => element.addEventListener(event, onEnd));
	}
};

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

	Tools.onCSSEnd('transition', currentView, () => {
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

		Tools.onCSSEnd('transition', newView, () => {
			newView.classList.remove('transparent-view');
		});

		// Do this when the new view is fully visible
		if (typeof callback === 'function') {
			callback();
		}
	};
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