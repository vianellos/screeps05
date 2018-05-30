Room.prototype.level = 0;

Room.prototype.getLevel = function() {
	this.level=this.controller.level
	return this.level
}

Room.prototype.architect = function() {
	stru=this.census()
	switch (this.getLevel()) {
		case 1:
			if (stru.container<4) {
				this.buildSt("container")
			}
		break;
	}

}

Room.prototype.census = function() {
	stru={'container':0, 'extension': 0}
	for (var id in this.structures) {
	}
	return stru
}

Room.prototype.buildSt= function(ty) {
	maxcs=1
	cs=this.find(FIND_MY_CONSTRUCTION_SITES)
	if (cs && cs.length>=maxcs) {
		//utils.elog("Sto già costrunedo", cs)
	}
	else {
		dist=1000
		newcon=false
		sp=this.find(FIND_MY_SPAWNS)
		for (var spid in sp) {
			res=this.find(FIND_SOURCES_ACTIVE)
			for (var resid in res) {
				npx=Math.floor((sp[spid].pos.x+res[resid].pos.x)/2)
				npy=Math.floor((sp[spid].pos.y+res[resid].pos.y)/2)
				emptys=this.findEmptySpace(npx, npy)
				if (emptys) {
					if (emptys.d<dist) {
						dist=emptys.d
						newcon=emptys
					}
				}
			}
		}
		if (newcon) {
			//create=this.createConstructionSite(newcon.x, newcon.y, STRUCTURE_CONTAINER)
			this.visual.circle(newcon.x,newcon.y, {radius:1, stroke:"#ffffff", fill:0})
			utils.loWarn("Creo", true)
		}
	}
}

Room.prototype.findEmptySpace = function(sx, sy) {
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
			if (this.canBuildAt(nx, ny)) {
				dis=Math.abs(add)+gap
				result={'x':nx, 'y': ny, 'd': dis}
				this.visual.circle(nx, ny,  {fill: 'transparent', radius: 1, stroke: 'red'});
			}
		}
		//utils.elog("type", ty)
	}
	return false
}

Room.prototype.canBuildAt = function(sx, sy) {
	ok=true;
	max=2
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
