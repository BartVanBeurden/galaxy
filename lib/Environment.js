var Color			= require("./Color.js");

var lerp = function(a, b, t) {
	return a + t * (b - a);
};


var Environment = function(planet) {
	this.texMap = new Array(32 << planet._detail);
	this.texMapMult = this.texMap.length / 2;
	this.texMapStart = this.texMapMult - 1;
	this.texMapJitterCo = 1 << planet._detail;
	
	var numLayers 	= new Array(planet._randomInt(3, 6));
	var bLow	  	= -1;
	var bHigh		= null;
	var cLow		= null;
	var cHigh		= null;
	
	for (var i = 0; i < this.texMap.length; i++) {
		var t = i / this.texMap.length;
		if (t < 0.6) {
			t = t / 0.6;
			cLow = new Color([15, 50, 100], "RGB");
			this.texMap[i] = cLow.lighten(t / 3);
		} else {
			t = (t - 0.6) / 0.4;
			cLow = new Color([50, 100, 30], "RGB");
			cHigh = cLow.createComplement(true);
			this.texMap[i] = new Color([
				Math.floor(lerp(cLow.getRGB()[0], cHigh.getRGB()[0], t)),
				Math.floor(lerp(cLow.getRGB()[1], cHigh.getRGB()[1], t)),
				Math.floor(lerp(cLow.getRGB()[2], cHigh.getRGB()[2], t))], "RGB");
		}
		
	}
	
};

Environment.create = function(planet) {
	return new Environment(planet);
};

Environment.prototype.lookup = function(x, y, z, t) {
	var hashf = this.texMapStart + t * this.texMapMult;
	var hash = Math.floor(hashf);
	
	// todo: add some jitter
		
	return this.texMap[hash];
};

module.exports = Environment;