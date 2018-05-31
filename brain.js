module.exports = {
	level: 0,
    init: function() {
        utils.loWarn("Start", 1)
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
		this.resetGlobals()
	},
	closeTick: function() {
		st=this.stuckTotals()
		//utils.loWarn("stuckinfo",Memory.stuckinfo)
		utils.loWarn("stucktotals",st)
		utils.loWarn("CPU", Game.cpu)
	},
	architect: function() {
		for (var id in Game.rooms) {
			Game.rooms[id].architect()
		}
	},
	resetGlobals: function() {
		globals.currentbody={}
		globals.maxcreep=0
		globals.mincreep=0
		for (var id in Game.rooms) {
			Game.rooms[id].loInit()
		}
	},
	stuckinfo: function(ty, ac, st, err) {
		tick=Game.time
		//Memory.stuckinfo={}
		if (!Memory.stuckinfo) {
			Memory.stuckinfo={}
		}
		if (!Memory.stuckinfo[tick]) {
			dtk=0
			c=0
			for (var tk in Memory.stuckinfo) {
				c++
				if (dtk==0 || tk<dtk) {
					dtk=tk
				}
			}
			if (c>9) {
				delete Memory.stuckinfo[dtk]
			}
			Memory.stuckinfo[tick]={}
		}
		if (!Memory.stuckinfo[tick][ty]) {
			Memory.stuckinfo[tick][ty]={}
		}
		if (!Memory.stuckinfo[tick][ty][ac]) {
			Memory.stuckinfo[tick][ty][ac]={}
		}
		if (!Memory.stuckinfo[tick][ty][ac][st]) {
			Memory.stuckinfo[tick][ty][ac][st]={}
		}
		if (!Memory.stuckinfo[tick][ty][ac][st][err]) {
			Memory.stuckinfo[tick][ty][ac][st][err]=0
		}
		Memory.stuckinfo[tick][ty][ac][st][err]++
	},
	stuckTotals: function() {
		st={}
		for (var tick in Memory.stuckinfo) {
			for (var ty in Memory.stuckinfo[tick]) {
				if (!st[ty]) {
					st[ty]={}
					st[ty]['count']=0
				}
				for (var ac in Memory.stuckinfo[tick][ty]) {
					if (!st[ty][ac]) {
						st[ty][ac]={}
						st[ty][ac]['count']=0
					}
					for (var ste in Memory.stuckinfo[tick][ty][ac]) {
						if (!st[ty][ac][ste]) {
							st[ty][ac][ste]={}
							st[ty][ac][ste]['count']=0
						}
						for (var err in Memory.stuckinfo[tick][ty][ac][ste]) {
							if (!st[ty][ac][ste][err]) {
								st[ty][ac][ste][err]={}
								st[ty][ac][ste][err]['count']=0
							}
							st[ty]['count']+=Memory.stuckinfo[tick][ty][ac][ste][err]
							st[ty][ac]['count']+=Memory.stuckinfo[tick][ty][ac][ste][err]
							st[ty][ac][ste]['count']+=Memory.stuckinfo[tick][ty][ac][ste][err]
							st[ty][ac][ste][err]['count']+=Memory.stuckinfo[tick][ty][ac][ste][err]
						}
					}
				}
			}
		}
	return st
	}
};
