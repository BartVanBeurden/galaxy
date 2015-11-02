/**
	Clamp value between lower & upper bounds
	@param value {Number}
	@param min {Number} minimum value to return
	@param max {Number} maximum value to return
	@returns value between [min, max]
**/
var clamp = function(value, min, max) {
	if (value < min)
		return min;
	if (value > max)
		return max;
	return value;
};

/**
	Immutable color class
	@param data {Array} color parameters
	@param colorSpace {String} color space of data
**/
var Color = function(data, colorSpace) {
	this._internalColorSpace = colorSpace;
	
	// store both representations for performance
	this._rgb = Color.toRGB(data, colorSpace);
	this._hsl = Color.toHSL(data, colorSpace);
};

Color.Space = {
	RGB: "RGB",
	HSL: "HSL"
};

/**
	Retrieve RGB array
	@returns {Array}
**/
Color.prototype.getRGB = function() {
	return this._rgb;
};

/**
	Retrieve HSL array
	@returns {Array}
**/
Color.prototype.getHSL = function() {
	return this._hsl;
};

/**
	Change color hue
	@param delta {Number} change of hue in degrees (0 to 360)
	@returns {Color}
**/
Color.prototype.shiftHue = function(hue) {
	hue = (this._hsl[0] + hue) % 360;
	return new Color([hue, this._hsl[1], this._hsl[2]], Color.Space.HSL);
};

/**
	Increase color saturation
	@param delta {Number} change of saturation (0 to 1)
	@returns {Color}
**/
Color.prototype.saturate = function(delta) {
	var saturation = clamp(this._hsl[1] + delta, 0, 1);
	return new Color([this._hsl[0], saturation, this._hsl[2]], Color.Space.HSL);
};

/**
	Decrease color saturation
	@param delta {Number} change of saturation (0 to 1)
	@returns {Color}
**/
Color.prototype.desaturate = function(delta) {
	return this.saturate(-delta);
};

/**
	Increase color lightness
	@param delta {Number} change of lightness (0 to 1)
	@returns {Color}
**/
Color.prototype.lighten = function(delta) {
	var lightness = clamp(this._hsl[2] + delta, 0, 1);
	return new Color([this._hsl[0], this._hsl[1], lightness], Color.Space.HSL);
};

/**
	Decrease color lightness
	@param delta {Number} change of lightness (0 to 1)
	@returns {Color}
**/
Color.prototype.darken = function(delta) {
	return this.lighten(-delta);
};

/**
	Create complement color
	@returns {Color}
**/
Color.prototype.createComplement = function() {
	return this.shiftHue(180);
};

/**
	Create analogous color
	@param clockwise {Boolean} hue direction
	@returns {Color}
**/
Color.prototype.createAnalogue = function(clockwise) {
	return this.shiftHue(clockwise ? 30 : -30);
};

/**
	Create triad color
	@param clockwise {Boolean} hue direction
	@returns {Color}
**/
Color.prototype.createTriad = function(clockwise) {
	return this.shiftHue(clockwise ? 120 : -120);
};

/**
	Create split complement
	@param clockwise {Boolean} hue direction
	@returns {Color}
**/
Color.prototype.createSplitComplement = function(clockwise) {
	return this.shiftHue(clockwise ? 150 : -150);
};

/**
	Create tetradic color - see Color#createComplement to create the fourth tetradic color
	@param clockwise {Boolean} hue direction
**/
Color.prototype.createTetradic = function(complement) {
	return this.shiftHue(complement ? 60 : -120);
};

/**
	Create square color
	@param index {Number} in clockwise order, index of the square color to create
**/
Color.prototype.createSquare = function(num) {
	return this.shiftHue(90 * num);
};

Color.toRGB = function(data, colorSpace) {
	return Color.toRGB["from" + colorSpace](data);
};

Color.toRGB.fromRGB = function(data) {
	return data.slice(0);
};

Color.toRGB.fromHSL = function(data) {
	var hue = data[0];
	var saturation = data[1];
	var lightness = data[2];
	
	var c = (1 - Math.abs(2 * lightness - 1)) * saturation;
	var h = hue / 60;
	var x = c * (1 - Math.abs((h % 2) - 1));
	var m = lightness - 0.5 * c;
	var rgb = [0, 0, 0];
	
	     if (h >= 0 && h < 1)	rgb = [c, x, 0];
	else if (h >= 1 && h < 2)	rgb = [x, c, 0];
	else if (h >= 2 && h < 3)	rgb = [0, c, x];
	else if (h >= 3 && h < 4)	rgb = [0, x, c];
	else if (h >= 4 && h < 5)	rgb = [x, 0, c];
	else if (h >= 5 && h < 6)	rgb = [c, 0, x];
	
	return [
		Math.floor(255 * (rgb[0] + m)),
		Math.floor(255 * (rgb[1] + m)),
		Math.floor(255 * (rgb[2] + m))
	];
};

Color.toHSL = function(data, colorSpace) {
	return Color.toHSL["from"+colorSpace](data);
};

Color.toHSL.fromRGB = function(data) {
	var r = data[0] / 255;
	var g = data[1] / 255;
	var b = data[2] / 255;
	
	var max = Math.max(r, g, b);
	var min = Math.min(r, g, b);
	var c = max - min;
	var h = 0;
	var l = 0.5 * (max + min);
	var s = c / (1 - Math.abs(2 * l - 1));
	
	     if (max == r) h = 60 * (((g - b) / c) % 6);
	else if (max == g) h = 60 * (((b - r) / c) + 2);
	else if (max == b) h = 60 * (((r - g) / c) + 4);
	
	return [h, s, l];
};

Color.toHSL.fromHSL = function(data) {
	return data.slice(0);
};

module.exports = Color;
	