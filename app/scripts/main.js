(function() {

	// Detect if browser supports drag and drop and FileReader APIs
	if (typeof FileReader === 'undefined' && 'draggable' in document.createElement('span') === false ) {
		alert('Make sure your browser is up to date. Consider using Chrome or Firefox.');
	}

	// Initialize the app if all files are loaded
	window.addEventListener('load', Uploader.init, false);
})();