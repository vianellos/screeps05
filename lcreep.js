Creep.prototype.loJob = function() {
	if (!this.memory.role) {
		this.suicide()
		return false
	}
	if (!this.spawning && this.checkTimeToLive()) {
		//utils.loLog(this.memory.role, this.memory.jobstatus+"x"+this.memory.jobstep, this.name)
		if (this.memory.jobstatus==0) {
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
			if (!globals.roles[this.memory.role].suicided) {
				globals.roles[this.memory.role].suicided=1
			}
			else {
				globals.roles[this.memory.role].suicided=0
				globals.roles[this.memory.role].toCreate=true
				//globals.bodies[this.memory.bodyid].toCreate=true;
			}
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
			if (this.setSourceTarget()) {
				this.memory.jobstep=1
				this.loHarvest()
			}
			else {
				this.goToPark();
				fil={filter: (i) => i.structureType == STRUCTURE_CONTAINER }
				tg=this.pos.findClosestByPath(FIND_STRUCTURES, fil);
				if (tg) {
					globals.roles[this.memory.role].toCreate=false
				}
			}
		break;
		case 1:
			mo=this.loMove()
			if (mo==1) {
				this.memory.jobstep=2
				this.loHarvest()
			}
			else {
				if (mo!=0) {
					this.memory.jobstep=0
					this.loHarvest()
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

Creep.prototype.loadEnergy = function() {
	switch(this.memory.jobstep) {
		case 0:
			if (this.setEnergyTarget()) {
				this.memory.jobstep=1
			}
			else {
				this.goToPark();
				globals.roles[this.memory.role].toCreate=false
			}
		break;
		case 1:
			mo=this.loMove()
			if (mo==1) {
				this.memory.jobstep=2
			}
			else {
				if (mo!=0) {
					this.memory.jobstep=0
				}
			}
		break;
		case 2:
			if (this.carry.energy<this.carryCapacity) {
				if (this.memory.targett==1) {
					ac=this.loAction("withdraw", RESOURCE_ENERGY)
				}
				else {
					ac=this.loAction("harvest")
				}
				if (ac!=0) {
					utils.loLog("loAction loaden error", ac, this.name)
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
				this.unloadEnergy()
			}
			else {
				this.goToPark();
				globals.roles[this.memory.role].toCreate=false
			}
		break;
		case 1:
			if (this.fatigue==0) {
				mo=this.loMove()
				if (mo==1) {
					this.memory.jobstep=2
					this.unloadEnergy()
				}
				else {
					if (mo!=0 && mo!=-11) {
						this.memory.jobstep=0
						this.unloadEnergy()
					}
				}
			}
		break;
		case 2:
			if (this.carry.energy>0) {
				ac=this.loAction("transfer", RESOURCE_ENERGY)
				if (ac!=0) {
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

Creep.prototype.loBuild = function() {
	switch(this.memory.jobstep) {
		case 0:
			if (this.setBuildTarget()) {
				this.memory.jobstep=1
			}
			else {
				this.goToPark();
				globals.roles[this.memory.role].toCreate=false
			}
		break;
		case 1:
			if (this.fatigue==0) {
				mo=this.loMove()
				if (mo==1) {
					this.memory.jobstep=2
				}
				else {
					if (mo!=0 && mo!=-11) {
						this.memory.jobstep=0
					}
				}
			}
		break;
		case 2:
			if (this.carry.energy>0) {
				ac=this.loAction("build")
				if (ac!=0) {
					utils.loLog("loAction build error", ac, this.name)
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

Creep.prototype.loUpgrade = function() {
	switch(this.memory.jobstep) {
		case 0:
			if (this.setUpgradeTarget()) {
				this.memory.jobstep=1
			}
			else {
				this.goToPark();
				globals.roles[this.memory.role].toCreate=false
			}
		break;
		case 1:
			if (this.fatigue==0) {
				mo=this.loMove()
				if (mo==1) {
					this.memory.jobstep=2
				}
				else {
					if (mo!=0 && mo!=-11) {
						this.memory.jobstep=0
					}
				}
			}
		break;
		case 2:
			if (this.carry.energy>0) {
				ac=this.loAction("upgradeController")
				if (ac!=0) {
					utils.loLog("loAction build error", ac, this.name)
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

Creep.prototype.setSourceTarget = function() {
	tg=this.pos.findClosestByPath(FIND_SOURCES_ACTIVE)
	if (tg) {
		if (this.setNewTarget(tg, 1, 2)) {
			return true
		}
		else {
			utils.loError("No path to target", this, this.name)
		}
	}
	else {
		//utils.loError("No target", this, this.name)
	}
	return false
}

Creep.prototype.setStorageTarget = function(ha) {
	fil={filter: (i) => i.structureType == STRUCTURE_CONTAINER && i.store[RESOURCE_ENERGY] > 0 }
	tg=this.pos.findClosestByPath(FIND_STRUCTURES, fil);
	if (tg) {
		if (this.setNewTarget(tg, 1, 1)) {
			return true
		}
		else {
			utils.loError("No path to target", this, this.name)
		}
	}
	else {
		//utils.loError("No target", this, this.name)
	}
	return false
}


Creep.prototype.setEnergyTarget = function(ha) {
	tg=false
	if (!ha) {
		fil={filter: (i) => i.structureType == STRUCTURE_CONTAINER && i.store[RESOURCE_ENERGY] > 0 }
		tg=this.pos.findClosestByPath(FIND_STRUCTURES, fil);
		tt=1
	}
	if (!tg) {
		if (!this.room.hasCont) {
			tg=this.pos.findClosestByPath(FIND_SOURCES_ACTIVE)
			tt=2
		}
	}
	if (tg) {
		if (this.setNewTarget(tg, 1, tt)) {
			return true
		}
		else {
			//utils.loError("No path to target", this, this.name)
		}
	}
	else {
		//utils.loError("No target", this, this.name)
	}
	return false
}

Creep.prototype.setUleTarget = function(ha) {
	tg=false
	if (ha) {
		fil={ filter : function(object) { if ((object.structureType==STRUCTURE_SPAWN || object.structureType==STRUCTURE_EXTENSION) && object.energy < object.energyCapacity) {return 1} else {return 0} }}
		tg=this.pos.findClosestByPath(FIND_MY_STRUCTURES, fil);
		tt=1
	}
	if (!tg) {
		fil={filter: (i) => i.structureType == STRUCTURE_CONTAINER && i.store[RESOURCE_ENERGY] < i.storeCapacity }
		tg=this.pos.findClosestByPath(FIND_STRUCTURES, fil);
		tt=2
	}
	if (tg) {
		if (this.setNewTarget(tg, 1, tt)) {
			return true
		}
		else {
			utils.loError("No path to target", this, this.name)
		}
	}
	else {
		//utils.loError("No target", this, this.name)
	}
	return false
}

Creep.prototype.setBuildTarget = function() {
	tg=this.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);
	if (tg) {
		if (this.setNewTarget(tg, 3, 1)) {
			return true
		}
		else {
			utils.loError("No path to target", this, this.name)
		}
	}
	else {
		//utils.loError("No target", this, this.name)
	}
	return false
}

Creep.prototype.setUpgradeTarget = function() {
	tg=this.room.controller;
	if (tg) {
		if (this.setNewTarget(tg, 3, 1)) {
			return true
		}
		else {
			utils.loError("No path to target", this, this.name)
		}
	}
	else {
		//utils.loError("No target", this, this.name)
	}
	return false
}

Creep.prototype.setNewTarget = function(target, ra, tt) {
	path=this.pos.findPathTo(target, {range: ra})
	if (path) {
		this.memory.targetx=target.pos.x
		this.memory.targety=target.pos.y
		this.memory.targetr=ra
		this.memory.targeti=target.id
		this.memory.targett=tt
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
		if (res==-9) {
			this.say("-9")
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

Creep.prototype.goToPark = function() {
	this.say("P")
	rx=Math.floor((Math.random() * 20) - 9);
	ry=Math.floor((Math.random() * 20) - 9);
	//this.move(BOTTOM_LEFT)
	this.moveTo(globals.parkingx+rx, globals.parkingy+ry)
}
