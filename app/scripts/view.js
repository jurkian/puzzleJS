// Settings
var s = {
	container: {},
	cache: {}
};

var init = function(container) {
	s.container = container;
};

// Get HTML template
var getTemplate = function(url, callback) {
	if (s.cache[url]) {
		if (typeof callback === 'function') {
			return callback(s.cache[url]);
		}
	}

	var request = new XMLHttpRequest();

	request.onreadystatechange = function() {
		if (request.readyState === 4 && request.status === 200) {

			var data = request.responseText;
			s.cache[url] = data;

			if (typeof callback === 'function') {
				callback(data);
			}
		}
	};

	request.open('GET', url, true);
	request.send();
};

// Render the view
var render = function(html) {
	s.container.innerHTML = '';
	s.container.insertAdjacentHTML('beforeend', html);
};

var load = function(view, callback) {
	getTemplate(view, function(html) {
		render(html);

		if (typeof callback === 'function') {
			callback();
		}
	});
};

var loadTransition = function(view, before, callback) {

	// Reset transition classes
	s.container.classList.remove('view-out', 'view-in');

	// Hide view
	s.container.classList.add('view-out');
	s.container.onCSSAnimationEnd(function() {

		// Do things before showing new view
		getTemplate(view, function(html) {
			render(html);

			// Before new view - callback
			if (typeof before === 'function') {
				before();
			}

			// Start showing new view
			s.container.classList.add('view-in');
			s.container.onCSSAnimationEnd(function() {
				s.container.classList.remove('view-out', 'view-in');

				if (typeof callback === 'function') {
					callback();
				}
			});
		});
	});
};

module.exports = {
	init: init,
	load: load,
	loadTransition: loadTransition
};