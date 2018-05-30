Creep.prototype.loJob = function() {
	//this.suicide()
	if (!this.spawning && this.checkTimeToLive()) {
		if (this.memory.jobstatus==0) {
			//utils.loLog("roles", globals.roles[this.memory.role].go)
			if (this[globals.roles[this.memory.role].go]()) {
				this.memory.jobstatus=1
			}
		}
		else {
			if (this[globals.roles[this.memory.role].come]()) {
				this.memory.jobstatus=0
			}
		}
	}
}

Creep.prototype.checkTimeToLive = function() {
	if (this.ticksToLive<globals.ttlLimit) {
		if (this.carry.energy>0) {
			this.unloadEnergy();
		}
		else {
			this.say("Bye bye")
			utils.loWarn("Suicided", this, this.name)
			this.suicide();
		}
		return false
	}
	else {
		return true
	}
}

Creep.prototype.loHarvest = function() {
	switch(this.memory.jobstep) {
		case 0:
			if (this.setEnergyTarget(true)) {
				this.memory.jobstep=1
			}
			else {
				utils.loError("No energy target", this, this.name)
			}
		break;
		case 1:
			if (mo=this.loMove()) {
				this.memory.jobstep=2
			}
			else {
				if (mo!=0) {
					utils.loLog("loMove error", mo, this.name)
					this.memory.jobstep=0
				}
			}
		break;
		case 2:
			if (this.carry.energy<this.carryCapacity) {
				ac=this.loAction("harvest")
				if (ac!=0) {
					utils.loLog("loAction harvest error", ac, this.name)
					this.memory.jobstep=0
				}
			}
			else {
				this.memory.jobstep=0
				return true
			}
		break;
	}
	return false
}

Creep.prototype.unloadEnergy = function() {
	switch(this.memory.jobstep) {
		case 0:
			if (this.setUleTarget(true)) {
				this.memory.jobstep=1
			}
			else {
				utils.loError("No unload energy target", this, this.name)
			}
		break;
		case 1:
			if (mo=this.loMove()) {
				this.memory.jobstep=2
			}
			else {
				if (mo!=0) {
					utils.loLog("loMove error", mo, this.name)
					this.memory.jobstep=0
				}
			}
		break;
		case 2:
			if (this.carry.energy>0) {
				ac=this.loAction("transfer", RESOURCE_ENERGY)
				if (ac!=0) {
					utils.loLog("loAction transfer error", ac, this.name)
					this.memory.jobstep=0
				}
			}
			else {
				this.memory.jobstep=0
				return true
			}
		break;
	}
	return false
}

Creep.prototype.setEnergyTarget = function(ha) {
	tg=false
	if (!ha) {
		fil={ filter : function(object) { if (object.structureType==STRUCTURE_STORAGE && object.energy > 0) {return 1} else {return 0} }}
		tg=this.pos.findClosestByPath(FIND_MY_STRUCTURES, fil);
	}
	if (!tg) {
		tg=this.pos.findClosestByPath(FIND_SOURCES_ACTIVE)
	}
	if (tg) {
		if (this.setNewTarget(tg, 1)) {
			return true
		}
		else {
			utils.loError("No path to target", this, this.name)
		}
	}
	else {
		utils.loError("No target", this, this.name)
	}
	return false
}

Creep.prototype.setUleTarget = function(ha) {
	tg=false
	if (ha) {
		fil={ filter : function(object) { if (object.structureType==STRUCTURE_SPAWN && object.energy < object.energyCapacity) {return 1} else {return 0} }}
		tg=this.pos.findClosestByPath(FIND_MY_STRUCTURES, fil);
	}
	if (!tg) {
		fil={ filter : function(object) { if (object.structureType==STRUCTURE_CONTAINER && object.energy < object.energyCapacity) {return 1} else {return 0} }}
		tg=this.pos.findClosestByPath(FIND_MY_STRUCTURES, fil);
	}
	if (tg) {
		if (this.setNewTarget(tg, 1)) {
			return true
		}
		else {
			utils.loError("No path to target", this, this.name)
		}
	}
	else {
		utils.loError("No target", this, this.name)
	}
	return false
}

Creep.prototype.setNewTarget = function(target, ra) {
	path=this.pos.findPathTo(target, {range: ra})
	if (path) {
		this.memory.targetx=target.pos.x
		this.memory.targety=target.pos.y
		this.memory.targetr=ra
		this.memory.targeti=target.id
		this.memory.lx=0
		this.memory.ly=0
		this.memory.lf=0
		this.memory.sp=Room.serializePath(path)
		return true
	}
	else {
		return false
	}
}

Creep.prototype.loAction=function (ty, opt) {
	target=Game.getObjectById(this.memory.targeti)
	if (target) {
		if (opt) {
			res=this[ty](target, opt)
		}
		else {
			res=this[ty](target)
		}
		return res
	}
	else {
		return -99
	}
}

Creep.prototype.loMove= function() {
	if (this.isArrived()){
		return 1
	}
	else {
		if ((this.memory.lx==this.pos.x) && (this.memory.ly==this.pos.y) && (this.memory.lf==this.fatigue)) {
			utils.loWarn("Stucked", this, this.name)
			this.say("ST")
			globals.stcount++;
			return -101
		}
		else {
			this.memory.lx=this.pos.x
			this.memory.ly=this.pos.y
			this.memory.lf=this.fatigue
			res=this.moveByPath(Room.deserializePath(this.memory.sp))
			return res
		}
	}
}

Creep.prototype.isArrived = function() {
    if (this.pos.x>=this.memory.targetx-this.memory.targetr && this.pos.x<=this.memory.targetx+this.memory.targetr && this.pos.y>=this.memory.targety-this.memory.targetr && this.pos.y<=this.memory.targety+this.memory.targetr) {
		return true
    }
    else {
        return false
    }
}


Creep.prototype.ljob = function() {
	//this.suicide()
	/*if (!this.spawning) {
		switch (this.memory.role) {
			case "harvester":
				this.harvester()
			break;
			case "starter":
				this.harvester()
			break;
			case "builder":
				this.builder()
			break;
			case "upgrader":
				this.upgrader()
			break;
		}
	}*/
}

Creep.prototype.harvester = function() {
	utils.elog("harv", this.memory.jobstatus, this.name)
    switch (this.memory.jobstatus) {
        case 0:
			if (this.setNewTarget(FIND_SOURCES_ACTIVE, {}, 1)) {
	            this.memory.jobstatus=1
				this.harvester()
			}
			else {
				globals.bodies[this.memory.bodyid].toCreate=false;
				utils.elog("Stop creating 1", this.memory.bodyid, this.name)
			}
        break;
        case 1:
			m=this.lMove()
			switch (m) {
				case 1:
					this.memory.jobstatus=2
					this.harvester()
				break;
				case -101:
					this.memory.jobstatus=0
				break;
			}
        break;
        case 2:
			res=this.doAction("harvest")
			switch (res) {
				case -9:
				case -99:
					this.memory.jobstatus=0
				break;
			}
			if (this.carry.energy>=this.carryCapacity) {
				this.memory.jobstatus=3
			}
		break;
		case 3:
			rfilter= { filter: (structure) => { return ( ((structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity)); } }
			if (this.setNewTarget(FIND_STRUCTURES, rfilter, 1)) {
				this.memory.jobstatus=4
				this.harvester()
			}
			else {
				globals.bodies[this.memory.bodyid].toCreate=false;
				utils.elog("Stop creating 2", this.memory.bodyid, this.name)
			}
		break;
		case 4:
			m=this.lMove()
			switch (m) {
				case 1:
					this.memory.jobstatus=5
					this.harvester()
				break;
				case -101:
					this.memory.jobstatus=3
				break;
			}
		break;
		case 5:
			res=this.doAction("transfer", RESOURCE_ENERGY)
			switch (res) {
				case -99:
				case -9:
					this.memory.jobstatus=3
				break;
			}
			if (this.carry.energy==0) {
				this.memory.jobstatus=0
			}
        break;
    }
}

Creep.prototype.builder = function() {
	utils.elog("build", this.memory.jobstatus, this.name)
    switch (this.memory.jobstatus) {
        case 0:
			if (this.setNewTarget(FIND_SOURCES_ACTIVE, {}, 1)) {
	            this.memory.jobstatus=1
				this.builder()
			}
			else {
				globals.bodies[this.memory.bodyid].toCreate=false;
				utils.elog("Stop creating 1", this.memory.bodyid, this.name)
			}
        break;
        case 1:
			m=this.lMove()
			switch (m) {
				case 1:
					this.memory.jobstatus=2
					this.builder()
				break;
				case -101:
					this.memory.jobstatus=0
				break;
			}
        break;
        case 2:
			res=this.doAction("harvest")
			switch (res) {
				case -9:
				case -99:
					this.memory.jobstatus=0
				break;
			}
			if (this.carry.energy>=this.carryCapacity) {
				this.memory.jobstatus=3
			}
		break;
		case 3:
			if (this.setNewTarget(FIND_MY_CONSTRUCTION_SITES,{}, 1)) {
				this.memory.jobstatus=4
				this.builder()
			}
			else {
				globals.bodies[this.memory.bodyid].toCreate=false;
				utils.elog("Stop creating 2", this.memory.bodyid, this.name)
			}
		break;
		case 4:
			m=this.lMove()
			switch (m) {
				case 1:
					this.memory.jobstatus=5
					this.builder()
				break;
				case -101:
					this.memory.jobstatus=3
				break;
			}
		break;
		case 5:
			res=this.doAction("build")
			switch (res) {
				case -99:
				case -9:
					this.memory.jobstatus=3
				break;
			}
			if (this.carry.energy==0) {
				this.memory.jobstatus=0
			}
        break;
    }
}

Creep.prototype.upgrader = function() {
	utils.elog("upgrade", this.memory.jobstatus, this.name)
    switch (this.memory.jobstatus) {
        case 0:
			if (this.setNewTarget(FIND_SOURCES_ACTIVE, {}, 1)) {
	            this.memory.jobstatus=1
				this.upgrader()
			}
			else {
				globals.bodies[this.memory.bodyid].toCreate=false;
				utils.elog("Stop creating 1", this.memory.bodyid, this.name)
			}
        break;
        case 1:
			m=this.lMove()
			switch (m) {
				case 1:
					this.memory.jobstatus=2
					this.upgrader()
				break;
				case -101:
					this.memory.jobstatus=0
				break;
			}
        break;
        case 2:
			res=this.doAction("harvest")
			switch (res) {
				case -9:
				case -99:
					this.memory.jobstatus=0
				break;
			}
			if (this.carry.energy>=this.carryCapacity) {
				this.memory.jobstatus=3
			}
		break;
		case 3:
			if (this.setNewTarget("controller",{}, 1)) {
				this.memory.jobstatus=4
				this.upgrader()
			}
			else {
				globals.bodies[this.memory.bodyid].toCreate=false;
				utils.elog("Stop creating 2", this.memory.bodyid, this.name)
			}
		break;
		case 4:
			m=this.lMove()
			switch (m) {
				case 1:
					this.memory.jobstatus=5
					this.upgrader()
				break;
				case -101:
					this.memory.jobstatus=3
				break;
			}
		break;
		case 5:
			res=this.doAction("upgrade")
			switch (res) {
				case -99:
				case -9:
					this.memory.jobstatus=3
				break;
			}
			if (this.carry.energy==0) {
				this.memory.jobstatus=0
			}
        break;
    }
}

Creep.prototype.setNewTargetOld = function(ty, fi, ra) {
	if (ty=="controller") {
		if (this.room.controller) {
			this.memory.targetx=this.room.controller.pos.x
			this.memory.targety=this.room.controller.pos.y
			this.memory.targetr=ra
			this.memory.targeti=this.room.controller.id
			this.memory.lx=0
			this.memory.ly=0
			this.memory.lf=0
			path2=this.pos.findPathTo(this.room.controller, {range: ra})
			this.memory.sp=Room.serializePath(path2)
			return true
		}
		else {
			return false
		}
	}
	else {
		target=this.pos.findClosestByPath(ty, fi)
		if (target) {
			this.memory.targetx=target.pos.x
			this.memory.targety=target.pos.y
			this.memory.targetr=ra
			this.memory.targeti=target.id
			this.memory.lx=0
			this.memory.ly=0
			this.memory.lf=0
			path2=this.pos.findPathTo(target, {range: ra})
			this.memory.sp=Room.serializePath(path2)
			return true
		}
		else {
			return false
		}
	}
}

Creep.prototype.doActionOld=function (ty, opt) {
	target=Game.getObjectById(this.memory.targeti)
	if (target) {
		if (opt) {
			res=this[ty](target, opt)
		}
		else {
			res=this[ty](target)
		}
		return res
	}
	else {
		return -99
	}
}
