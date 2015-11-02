var ViewRegion = function(context, window, viewport) {
	this._context	= context;
	this._window 	= window;
	this._viewport	= viewport;
	this._image		= context.createImageData(viewport.width, viewport.height);
	this._buffer	= new ArrayBuffer(viewport.width * viewport.height * 4);
	this._worker	= new Worker("./worker.js");
	this._readyState= ViewRegion.ReadyState.IDLE;
	
	this._worker.postMessage({
		type: "setWindow",
		window: this._window
	});
	
	this._worker.postMessage({
		type: "setViewport",
		viewport: this._viewport
	});
	
	this._worker.onmessage = function(event) {
		switch (event.data.type) {
			
			case "render":
				this._buffer = event.data.buffer;
				this._image.data.set(new Uint8ClampedArray(this._buffer));
				this._readyState = ViewRegion.ReadyState.READY;
				break;
				
			case "error":
				this._readyState = ViewRegion.ReadyState.ERROR;
				break;
				
		}
	}.bind(this);
};

ViewRegion.create = function(context, window, viewport) {
	return new ViewRegion(context, window, viewport);
};

ViewRegion.ReadyState = {
	IDLE: "IDLE",
	READY: "READY",
	WORKING: "WORKING",
	ERROR: "ERROR"
};

ViewRegion.prototype.getReadyState = function() {
	return this._readyState;
};

ViewRegion.prototype.bindPlanet = function(planet) {
	this._worker.postMessage({
		type: "setPlanet",
		planet: planet
	});
};

ViewRegion.prototype.render = function(angle) {
	switch (this._readyState) {
		
		case ViewRegion.ReadyState.IDLE:
			this._readyState = ViewRegion.ReadyState.WORKING;
			this._worker.postMessage({
				type: "render",
				angle: angle,
				buffer: this._buffer
			}, [this._buffer]);
			return true;
			
		case ViewRegion.ReadyState.WORKING:
			return false;
			
		default:
			return;
			
	}
};			

ViewRegion.prototype.draw = function() {
	// please note: perlin noise & blitting should be done in webgl
	// so this will probably run very slow
	this._context.putImageData(this._image, this._viewport.x, this._viewport.y);
	this._readyState = ViewRegion.ReadyState.IDLE;
};

ViewRegion.prototype.destroy = function() {
	this._worker.terminate();
};

module.exports = ViewRegion;