Room.prototype.level = 0;

Room.prototype.getLevel = function() {
	this.level=this.controller.level
	return this.level
}

Room.prototype.architect = function() {
	str=this.census()
}

Room.prototype.census = function() {
	structures={'container':0, 'extension': 0}
	for (var id in this.structures) {
		utils.elog("struct", this.structures[id])
	}
}
