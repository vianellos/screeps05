Room.prototype.level = 0;
Room.prototype.containers = false;

Room.prototype.getLevel = function() {
	this.level=this.controller.level
	return this.level
}

Room.prototype.hasCont=function() {
	return this.containers
}

Room.prototype.architect = function() {
	fil={filter: (i) => i.structureType == STRUCTURE_CONTAINER }
	con=this.find(FIND_STRUCTURES, fil)
	if (con.length>0) {
		this.containers=true
	}
	maxcs=1
	cs=this.find(FIND_MY_CONSTRUCTION_SITES)
	if (cs && cs.length>=maxcs) {

	}
	else {
		stru=this.census()
		switch (this.getLevel()) {
			case 1:
				if (stru.container<4) {
					this.buildContainer()
				}
			break
			case 2:
				if (stru.extension<4) {
					this.buildExtension()
				}
				else if (stru.container<4) {
					this.buildContainer()
				}
			break;
		}
	}
}

Room.prototype.census = function() {
	stru={'container':0, 'extension': 0}
	for (var id in this.structures) {
		this.loLog("structures", this.structures[id])
	}
	return stru
}

Room.prototype.buildContainer= function(ty) {
	dist=1000
	newcon=false
	sp=this.find(FIND_MY_SPAWNS)
	for (var spid in sp) {
		res=this.find(FIND_SOURCES_ACTIVE)
		for (var resid in res) {
			npx=Math.floor((sp[spid].pos.x+res[resid].pos.x)/2)
			npy=Math.floor((sp[spid].pos.y+res[resid].pos.y)/2)
			emptys=this.findEmptySpace(npx, npy, 2)
			utils.loWarn("emptys", emptys)
			if (emptys) {
				if (emptys.d<dist) {
					dist=emptys.d
					newcon=emptys
				}
			}
		}
	}
	if (newcon) {
		create=this.createConstructionSite(newcon.x, newcon.y, STRUCTURE_CONTAINER)
		this.visual.circle(newcon.x,newcon.y, {radius:1, stroke:"#ffffff", fill:0})
		utils.loWarn("Creo", newcon)
	}
}

Room.prototype.buildExtension= function(ty) {
	dist=1000
	newcon=false
	sp=this.find(FIND_MY_SPAWNS)
	for (var spid in sp) {
		npx=sp[spid].pos.x
		npy=sp[spid].pos.y
		emptys=this.findEmptySpace(npx, npy, 2)
		if (emptys) {
			if (emptys.d<dist) {
				dist=emptys.d
				newcon=emptys
			}
		}
	}
	if (newcon) {
		create=this.createConstructionSite(newcon.x, newcon.y, STRUCTURE_EXTENSION)
		this.visual.circle(newcon.x,newcon.y, {radius:1, stroke:"#ffffff", fill:0})
		utils.loWarn("Creo", newcon)
	}
}

Room.prototype.findEmptySpace = function(sx, sy, max=2) {
	limit=40
	for (s=0; s<limit; s++) {
		gap=Math.ceil(s/4)
		ty=s%4
		for (add=gap*-1; add<=gap; add++) {
			switch (ty) {
				case 0:
					nx=sx+add
					ny=sy+gap
				break;
				case 1:
					nx=sx+add
					ny=sy-gap
				break;
				case 2:
					nx=sx+gap
					ny=sy+add
				break;
				case 3:
					nx=sx-gap
					ny=sy+add
				break;
			}
			if (this.canBuildAt(nx, ny, max)) {
				dis=Math.abs(add)+gap
				result={'x':nx, 'y': ny, 'd': dis}
				return result
				//this.visual.circle(nx, ny,  {fill: 'transparent', radius: 1, stroke: 'red'});
			}
		}
		//utils.elog("type", ty)
	}
	return false
}

Room.prototype.canBuildAt = function(sx, sy, max) {
	ok=true;
	for (i1=max*-1; i1<=max; i1++) {
		for (i2=max*-1; i2<=max; i2++) {
			look=this.lookAt(sx+i1, sy+i2)
			lok=false
			//utils.elog("nuova", nx+"x"+ny)
			if (look.length==1) {
				if (look[0].type=="terrain" && look[0].terrain=="plain") {
					lok=true
				}
			}
			if (!lok) { ok=false }
		}
	}
	return ok
}

Room.prototype.maxCreep = function() {
	if (globals.maxcreep) {
		return globals.maxcreep
	}
	else {
		maxcreep=10
		if (this.structures) {
			for (var id in this.structures) {
				utils.loLog("strucure maxcreep", this.structures[id], id)
			}
		}
		globals.maxcreep=maxcreep
		return globals.maxcreep
	}
}

Room.prototype.minCreep = function() {
	if (globals.mincreep) {
		return globals.mincreep
	}
	else {
		mincreep=1
		globals.mincreep=mincreep
		return globals.mincreep
	}
}
