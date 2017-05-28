import Tools from './tools';

let View = {};

// Settings
let s = {
	container: {},
	cache: {}
};

View.init = container => s.container = container;

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

View.load = (view, callback) => {
	getTemplate(view, html => {
		render(html);

		if (typeof callback === 'function') {
			callback();
		}
	});
};

View.loadTransition = (view, before, callback) => {

	// Reset transition classes
	s.container.classList.remove('view-out', 'view-in');

	// Hide view
	s.container.classList.add('view-out');
	Tools.onCSSEnd('animation', s.container, () => {

		// Do things before showing new view
		getTemplate(view, html => {
			render(html);

			// Before new view - callback
			if (typeof before === 'function') {
				before();
			}

			// Start showing new view
			s.container.classList.add('view-in');
			Tools.onCSSEnd('animation', s.container, () => {
				s.container.classList.remove('view-out', 'view-in');

				if (typeof callback === 'function') {
					callback();
				}
			});
		});
	});
};

export default View;