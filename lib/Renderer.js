var noise			= require("noise3d");

var Renderer = function() {
	this._planet	= null;
	this._window	= null;
	this._viewport	= null;
};

Renderer.create = function() {
	return new Renderer();
};

Renderer.prototype.setPlanet = function(planet) {
	this._planet = planet;
};

/**	
	Set Window
	@param window.width {Number} width relative to planet (planet.width = 1)
	@param window.height {Number} height relative to planet (planet.height = 1)
	@param window.x {Number} x offset (planet.x in [0, 1])
	@param window.y {Number} y offset (planet.y in [0, 1])
**/
Renderer.prototype.setWindow = function(window) {
	this._window = window;
};

/**
	Set Viewport
	@param viewport.width {Number} image width
	@param viewport.height {Number} image height
**/
Renderer.prototype.setViewport = function(viewport) {
	this._viewport = viewport;
};

/**
	Render planet
	@param angle {Number} Angle of rotation around Y-axis
	@param buffer {ArrayBuffer} buffer to contain rendered image (size = viewport.width * viewport.height * 4)
**/
Renderer.prototype.render = function(angle, buffer) {
	var lerp		= noise.interpolation.linear;
	var size		= this._viewport.width / this._window.width;
	var delta		= this._planet.getDiameter() / size;
	
	var radius		= size / 2;
	var radius2		= radius * radius;
	var cos			= Math.cos(angle);
	var sin			= Math.sin(angle);
	
	var nxStart		= this._planet.getRadius() * (2 * this._window.x - 1);
	var nyStart		= this._planet.getRadius() * (2 * this._window.y - 1);
	
	// TODO: replace viewport.x, viewport.y by window.x, window.y
	
	for (var x = 0, nx = nxStart; x < this._viewport.width; x++, nx += delta) {
		for (var y = 0, ny = nyStart; y < this._viewport.height; y++, ny += delta) {
			
			var index 	= (y * this._viewport.width + x) * 4;
			var xOffset	= this._viewport.x + x - radius;
			var yOffset = this._viewport.y + y - radius;
			var square	= radius2 - xOffset * xOffset - yOffset * yOffset;
			
			if (square >= 0) { // ray to (x, y) intersects with sphere
				var z = Math.sqrt(square) + radius; // intersection z
				var nz = z * delta - this._planet.getRadius();
				
				// rotate coordinates around Y axis
				var nxt = nz * sin + nx * cos;
				var nyt = ny;
				var nzt = nz * cos - nx * sin;
				
				var color = this._planet.lookup(nxt, nyt, nzt);
				
				buffer[index+0] = color[0]; // r
				buffer[index+1] = color[1]; // g
				buffer[index+2] = color[2]; // b
				buffer[index+3] = 255 // a
			}
		}
	}
};

module.exports = Renderer;