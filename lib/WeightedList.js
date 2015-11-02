// NOTE: current implementation is O(n) so please consider using a binary search tree if you need to support a large set of items

var WeightedListItem = function(weight, data) {
	this.weight = weight;
	this.data = data;
};

var WeightedList = function(random) {
	this.items = [];
	this.totalWeight = 0;
	this.random = random;
};

WeightedList.prototype.addItem = function(data, weight) {
	if (weight <= 0 || !Number.isFinite(weight))
		throw new RangeError("invalid weight");
	if (!Number.isFinite(this.totalWeight + weight))
		throw new Error("weight overflow");
	
	this.items.push(new WeightedListItem(data, weight));
	this.totalWeight += weight;
};

WeightedList.prototype.removeItem = function(data) {
	for (var i = 0; i < this.items.length; i++) {
		if (this.items[i].data == data) {
			this.totalWeight -= this.items[i].weight;
			this.items.splice(i, 1);
			return;
		}
	}
};

WeightedList.prototype.setRandom = function(random) {
	this.random = random;
};

WeightedList.prototype.getRandomItem = function() {
	var weightIndex = random() * this.totalWeight;
	
	for (var i = 0; i < this.items.length; i++) {
		weightIndex -= this.items[i].weight;
		if (weightIndex <= 0) {
			return this.items[i].data;
		}
	}
	
	return this.items[i-1].data;
};

module.exports = WeightedList;