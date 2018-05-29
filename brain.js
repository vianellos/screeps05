module.exports = {
    init: function() {
        utils.elog("Start", 1)

    },
	tick: function() {
		utils.elog("Tick", globals.tick)
		globals.tick++;
		utils.cleanCreeps()
	}
};
