(function() {

	// Detect if browser supports drag and drop and FileReader APIs
	if (typeof FileReader === 'undefined' && 'draggable' in document.createElement('span') === false ) {
		alert('Make sure your browser is up to date. Consider using Chrome or Firefox.');
	}

	Uploader.init();

})();