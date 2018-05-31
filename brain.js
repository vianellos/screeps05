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
		//utils.loWarn("stucktotals",st)
		//utils.loWarn("pathinfo",Memory.pathinfo)
		utils.loWarn("CPU", Game.cpu.getUsed()+"/"+Game.cpu.tickLimit)
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
	stuckinfo: function(ty, ac, st) {
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
			Memory.stuckinfo[tick][ty][ac][st]=0
		}
		Memory.stuckinfo[tick][ty][ac][st]++
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
						st[ty]['count']+=Memory.stuckinfo[tick][ty][ac][ste]
						st[ty][ac]['count']+=Memory.stuckinfo[tick][ty][ac][ste]
						st[ty][ac][ste]['count']+=Memory.stuckinfo[tick][ty][ac][ste]
					}
				}
			}
		}
	return st
	},
	pathinfo: function(r, x, y) {
		if (!Memory.pathinfo[r]) {
			Memory.pathinfo[r]={}
		}
		if (!Memory.pathinfo[r][x+'x'+y]) {
			look=Game.rooms[r].lookAt(x, y)
			str=false
			for (var id in look) {
				if (look[id].type=='structure') {
					str=true
				}
			}
			if (str) {
				Memory.pathinfo[r][x+'x'+y]=0
			}
			else {
				Memory.pathinfo[r][x+'x'+y]=1
			}
		}
		else {
			if (Memory.pathinfo[r][x+'x'+y]!=0) {
				Memory.pathinfo[r][x+'x'+y]++
			}
		}
	}
};
