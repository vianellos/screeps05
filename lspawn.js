StructureSpawn.prototype.loTick=function() {
	if (!this.spawning) {
		if (loVar.nextSpawn) {
			this.spawn();
		}
		else {
			if (loVar.lastRoleCheck+loCon.roleCheckGap<Game.time) {
				if (this.rolesCheck()) {
					this.spawn();
				}
			}
		}
	}
}

StructureSpawn.prototype.rolesCheck=function() {
	res=false
	if (loVar.creepsNumber) {

	}
	else {

	}
}

StructureSpawn.prototype.spawn=function() {
	body=this.getBody(loVar.nextSpawn)
	if (this.room.energyAvailable>utils.calcCost(body)) {
		this.spawnCreep(body, this.createName(loVar.nextSpawn), { memory: {role: loVar.nextSpawn} })
		loVar.lastRoleCheck=0
	}
}

StructureSpawn.prototype.getBody=function(role) {
	body=false
	switch(role) {
		case "starter":
			body=[WORK, CARRY, MOVE]
		break;
	}
	return body
}

StructureSpawn.prototype.createName=function(bid) {
	if (Game.creeps.length) {
		n=Game.creeps.length
	}
	else {
		n=0;
	}
	name=bid.substr(0, 5)+"_"+n
	return name
}
