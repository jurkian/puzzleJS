var App = (function() {

	var randomizeArray = function(arr) {
		arr.sort(function() { 
			return 0.5 - Math.random();
		});
		
		return arr;
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

	return {
		randomizeArray: randomizeArray,
		changeView: changeView
	};

})();