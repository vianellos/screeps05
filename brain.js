module.exports = {
    init: function() {
        utils.elog("Start", 1)
    },
	tick: function() {
		utils.elog("Tick", globals.stcount)
		if (globals.tentick>=9) {
			globals.stcount=0
			globals.tentick=0
		}
		globals.tentick++
		globals.tick++
		utils.cleanCreeps()
	}
};
