var Uploader = (function() {

	var _dropZone = document.querySelector("#drop-zone");
	
	var _addHover = function() {
		_dropZone.classList.add("drag-over");
	};

	var _removeHover = function() {
		_dropZone.classList.remove("drag-over");
	};

	var _handleDrop = function() {
		e.preventDefault();
		e.stopPropagation();

		_removeHover();
	};

	var _cancelDefault = function(e) {
		e.preventDefault();
		return false;
	};

	var init = function() {
		_dropZone.ondragenter = _addHover;
		_dropZone.ondragleave = _removeHover;
		_dropZone.ondragover = _cancelDefault;
		_dropZone.ondrop = _handleDrop;
	};

	return {
		init: init
	};

})();