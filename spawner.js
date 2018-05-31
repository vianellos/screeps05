StructureSpawn.prototype.spawner = function() {
	for(var name in globals.roles) {
		globals.roles[name].count=0
	}
	globals.totcreep=0
	for(var name in Game.creeps) {
		if (Game.creeps[name].memory.role) {
			globals.roles[Game.creeps[name].memory.role].count++
			globals.totcreep++
		}
	}
	utils.loWarn("Roles", globals.roles)
	if (!this.spawning) {
		if (globals.totcreep==0) {
			name=this.getName("harvester", 0)
			mem={role: "harvester", jobstatus:0, jobstep:0}
			sp=this.spawnCreep([WORK, CARRY, MOVE],name, { memory: mem})
			if (sp==0) {
			   utils.loWarn("Spawning "+id, body, name)
			   return true
		   }
		   else {
			   utils.loError("Not Spawning", sp)
		   }
		}
		for (var id in globals.roles) {
			if (globals.roles[id].count<this.room.minCreep()) {
				body=this.selectBody(globals.roles[id].body)
				if (body && body.cost<=this.room.energyAvailable) {
					mem={role: id, jobstatus:0, jobstep:0}
					name=this.getName(id, body.level)
			        sp=this.spawnCreep(body.body,name, { memory: mem})
					if (sp==0) {
					   utils.loWarn("Spawning "+id, body, name)
					   return true
				   }
				   else {
					   utils.loError("Not Spawning", sp)
				   }
				}
			}
		}
		if (globals.totcreep<this.room.maxCreep()) {
			for (var id in globals.roles) {
				if (globals.roles[id].toCreate) {
					body=this.selectBody(globals.roles[id].body)
					if (body && body.cost<=this.room.energyAvailable) {
						mem={role: id, jobstatus:0, jobstep:0}
						name=this.getName(id, body.level)
				        sp=this.spawnCreep(body.body,name, { memory: mem})
						if (sp==0) {
						   utils.loWarn("Spawning "+id, body, name)
						   return true
					   }
					   else {
						   utils.loError("Not Spawning", sp)
					   }
					}
				}
			}
		}
	}
	return false
}

StructureSpawn.prototype.selectBody = function(bd) {
	/*if (globals.currentbody[bd]) {
		return globals.currentbody[bd]
	}*/
	energy=this.room.energyCapacityAvailable
	//utils.loLog("energy", energy)
	body=false
	for (var id in globals.bd[bd]) {
		if (globals.bd[bd][id].cost<=energy && (!body || globals.bd[bd][id].cost>body.cost)) {
			body=globals.bd[bd][id]
		}
	}
	//utils.loLog("bodychose", body)
	//globals.currentbody[bd]=body
	return body
}

StructureSpawn.prototype.getName = function(id, lev) {
	name=false
	c=1
	while (!name) {
		nn=id.substr(0,3)+lev+"_"+c
		if (Game.creeps[nn]) {
			c++
		}
		else {
			return nn
		}
	}
}
