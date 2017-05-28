// Settings
let s = {
	container: {},
	cache: {}
};

let init = container => s.container = container;

// Get HTML template
let getTemplate = (url, callback) => {
	if (s.cache[url]) {
		if (typeof callback === 'function') {
			return callback(s.cache[url]);
		}
	}

	fetch(url, {
		method: 'GET'
	})
	.then((response) => response.text())
	.then(data => {
		s.cache[url] = data;

		if (typeof callback === 'function') {
			callback(data);
		}
	});
};

// Render the view
let render = html => {
	s.container.innerHTML = '';
	s.container.insertAdjacentHTML('beforeend', html);
};

let load = (view, callback) => {
	getTemplate(view, html => {
		render(html);

		if (typeof callback === 'function') {
			callback();
		}
	});
};

let loadTransition = (view, before, callback) => {

	// Reset transition classes
	s.container.classList.remove('view-out', 'view-in');

	// Hide view
	s.container.classList.add('view-out');
	s.container.onCSSAnimationEnd(() => {

		// Do things before showing new view
		getTemplate(view, html => {
			render(html);

			// Before new view - callback
			if (typeof before === 'function') {
				before();
			}

			// Start showing new view
			s.container.classList.add('view-in');
			s.container.onCSSAnimationEnd(() => {
				s.container.classList.remove('view-out', 'view-in');

				if (typeof callback === 'function') {
					callback();
				}
			});
		});
	});
};

module.exports = {
	init,
	load,
	loadTransition
};