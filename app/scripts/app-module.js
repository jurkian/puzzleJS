var App = (function() {

	var randomizeArray = function(arr) {
		arr.sort(function() { 
			return 0.5 - Math.random();
		});
		
		return arr;
	};

	return {
		randomizeArray: randomizeArray
	};

})();