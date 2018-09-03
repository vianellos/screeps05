module.exports = {
	init: function() {
		this.initRoles();
	},
	initRoles: function () {
		loVar.roles={}
		for (var id in loVar.rolelist) {
			loVar.roles[loVar.rolelist[id]]={'idleCount':0, 'current':0,'desired':0}
		}
		loVar.creepsNumber=utils.countCreeps()
		if (loVar.creepsNumber) {
			for (var id in loVar.roles) {
				if (id!="starter") {
					loVar.roles[id].desired=loVar.roles[id].current
				}
			}
		}
		loVar.lastRoleCheck=Game.time
	},
	tick: function() {

	}
};
