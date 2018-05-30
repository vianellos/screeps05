module.exports = {
	level: 0,
    init: function() {
        utils.loWarn("Start", 1)
		for (var id in globals.bodies) {
			globals.bodies[id].toCreate=true;
		}
    },
	tick: function() {
		utils.loWarn("Tick", globals.stcount)
		if (globals.tentick>=9) {
			globals.stcount=0
			globals.tentick=0
		}
		globals.tentick++
		globals.tick++
		utils.cleanCreeps()
		this.architect()
	},
	architect: function() {
		for (var id in Game.rooms) {
			Game.rooms[id].architect()
		}
	}
};
