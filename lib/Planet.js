var noise			= require("noise3d");
var MersenneTwister	= require("./MersenneTwister.js");
var Environment		= require("./Environment.js");

/**
	Planet class
	@param seed {Number} starting number from which to generate the planet - identical seeds generate identical planets so it's not random
	@param detail {Number} level of detail - TODO: this belongs in renderer, not planet
**/
var Planet = function(seed, detail) {
	this._seed 			= seed;
	this._detail		= detail;
	this._mt			= MersenneTwister.create(seed);
	
	this._env			= Environment.create(this);
	this._radius		= this._randomInt(1.5, 2.5);
	this._diameter		= this._radius * 2;
	this._noise			= noise.createBrownianMotion({
		persistence			: 0.5,
		octaves				: detail,
		noise				: noise.createPerlin({
			interpolation		: noise.interpolation.linear,
			permutation			: noise.array.shuffle(noise.array.range(0, 255), this._mt.randomReal2)
		})
	});
	
};

Planet.create = function(seed, detail) {
	return new Planet(seed, detail);
};

Planet.prototype.getRadius = function() {
	return this._radius;
};

Planet.prototype.getDiameter = function() {
	return this._diameter;
};

Planet.prototype.lookup = function(x, y, z) {
	var value = this._noise(x, y, z);
	return this._env.lookup(x, y, z, value).getRGB();
};

Planet.prototype._random = function() {
	return this._mt.randomReal2();
};

Planet.prototype._randomInt = function(min, max) {
	return Math.floor(min + this._mt.randomReal1() * (max - min));
}

module.exports = Planet;