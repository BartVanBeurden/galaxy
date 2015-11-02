var ViewRegion = require("./ViewRegion.js");

var prop = function(name) {
	return function(obj) {
		return obj[name];
	};
};

var func = function(name, params) {
	return function(obj) {
		return obj[name].apply(obj, params);
	};
};

var getConcurrencyLevel = function(height) {
	var defaultConcurrency = 4;
	var concurrency = window.navigator.hardwareConcurrency || defaultConcurrency;
	var mod = height % concurrency;
	
	// ensure height of image is divisible by the hardware concurrency
	return mod
		? (concurrency - mod)
		: (concurrency);
};

var main = function() {
	
	var canvas		= document.querySelector("[name='view']");
	var inputSeed	= document.querySelector("[name='planet.seed']");
	var inputAnim	= document.querySelector("[name='view.animate']");
	var inputDetail	= document.querySelector("[name='view.detail']");
	
	var context		= canvas.getContext("2d");
	var angle		= 0;
	var size		= 0;
	var animate		= false;
	var regions		= [];
	
	var planet		= {
		seed		: 0,
		detail		: 3
	};
	
	var setSize = function(size) {
		canvas.width = size;
		canvas.height = size;
		
		regions.forEach(func("destroy"));
		regions = [];
		
		var concurrency = getConcurrencyLevel(size);
		var ratio		= 1 / concurrency;
		
		for (var i = 0; i < concurrency; i++) {
			
			var window  = {
				width	: 1,
				height	: ratio,
				x		: 0,
				y		: i * ratio
			};
			
			var viewport = {
				width	: size,
				height	: size * ratio,
				x		: 0,
				y		: i * size * ratio
			};
			
			regions[i] = ViewRegion.create(context, window, viewport);
		}
	};
	
	var setDetail = function(detail) {
		planet.detail = detail;
		setSize(8 << detail);
		regions.forEach(func("bindPlanet", [planet]));
	};
	
	var setSeed = function(seed) {
		planet.seed = seed;
		regions.forEach(func("bindPlanet", [planet]));
	};
	
	var setAnimate = function(value) {
		animate = value;
	};
	
	var render = function(timestamp) {
		
		// check if all regions are ready
		var ready = regions.reduce(function(numReady, region) {
			if (region.getReadyState() == ViewRegion.ReadyState.READY) {
				return numReady + 1;
			}
			return numReady
		}, 0) == regions.length;

		if (ready) {
			regions.forEach(func("draw"));
			if (animate) angle += Math.PI / 180;
		}
		
		regions.forEach(func("render", [angle]));
		
		if (!ready || animate) window.requestAnimationFrame(render);
	};
	render.lastTimestamp = 0;
	
	// INPUT HANDLERS
	// ==============
	
	inputSeed.addEventListener("change", function() {
		setSeed(parseInt(inputSeed.value));
		animate || render();
	});
	
	inputAnim.addEventListener("change", function() {
		setAnimate(inputAnim.checked);
		animate && render();
	});
	
	inputDetail.addEventListener("change", function() {
		setDetail(parseInt(inputDetail.value));
		animate || render();
	});
	
	// INITIALIZATION
	// ==============
	
	setSeed(parseInt(inputSeed.value), parseInt(inputDetail.value));
	setAnimate(inputAnim.checked);
	setDetail(parseInt(inputDetail.value));
	render();
};

document.readyState == "interactive"
	? main()
	: document.addEventListener("DOMContentLoaded", main);