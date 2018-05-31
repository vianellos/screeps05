Creep.prototype.loJob = function() {
	//this.suicide()
	if (!this.memory.role) {
		this.suicide()
		return false
	}
	if (!this.spawning && this.checkTimeToLive()) {
		if (this.loTick()) {
			if (this.memory.jobstatus==1) {
				this.memory.jobstatus=0
			}
			else {
				this.memory.jobstatus=1
			}
		}
	}
}

Creep.prototype.checkTimeToLive = function() {
	if (this.ticksToLive<globals.ttlLimit) {
		if (this.carry.energy>0) {
			return true
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
			}
			this.suicide();
		}
		return false
	}
	else {
		return true
	}
}

Creep.prototype.loTick = function() {
	//utils.loCrLog("Tick",this.memory, this.name)
	switch(this.memory.jobstep) {
		case 0:
			if (this.loSetTarget()) {
				this.memory.jobstep=1
				this.loTick()
			}
			else {
				brain.stuckinfo(this.memory.role, this.memory.jobstatus, this.memory.jobstep)
				this.goToPark();
			}
		break
		case 1:
			mo=this.loMove()
			if (mo==1) {
				this.memory.jobstep=2
				this.loTick()
			}
			else {
				if (mo!=0) {
					brain.stuckinfo(this.memory.role, this.memory.jobstatus, this.memory.jobstep)
					this.memory.jobstep=0
					this.loTick()
				}
			}
		break;
		case 2:
			if (this.actionEnded()) {
				ac=this.loAction()
				if (ac!=0) {
					if ((ac==-8 && this.memory.role=='harvester' && this.memory.jobstatus==1 && this.memory.jobstep==2) || (ac==-99 && this.memory.role=='builder' && this.memory.jobstatus==1 && this.memory.jobstep==2) || (ac==-6 &&  this.memory.jobstatus==0 && this.memory.jobstep==2)) {
						//utils.loError("Action error :"+ac, this.memory, this.name)
					} else {
						utils.loError("Action error :"+ac, this.memory, this.name)
					}
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

Creep.prototype.actionEnded = function() {
	if (this.memory.jobstatus==0) {
		if (this.carry.energy<this.carryCapacity) {
			return true
		}
		else {
			return false
		}
	}
	else {
		if (this.memory.role=='repairer') {
			obj=Game.getObjectById(this.memory.targeti)
			if (obj.hits>obj.hitsMax*0.8) {
				//utils.loCrLog("end",obj, this.name)
				return false
			}
		}
		if (this.carry.energy>0) {
			return true
			}
		else {
			return false
		}
	}
}

Creep.prototype.loSetTarget = function() {
	switch (this.memory.role) {
		case "harvester":
			if (this.memory.jobstatus==0) {
				return this.setSourceTarget()
			}
			else {
				return this.setUleTarget()
			}
		break;
		case "builder":
			if (this.memory.jobstatus==0) {
				return this.setEnergyTarget()
			}
			else {
				return this.setBuildTarget()
			}
		break;
		case "upgrader":
			if (this.memory.jobstatus==0) {
				return this.setEnergyTarget()
			}
			else {
				return this.setUpgradeTarget()
			}
		break;
		case "repairer":
			if (this.memory.jobstatus==0) {
				return this.setEnergyTarget()
			}
			else {
				return this.setRepairTarget()
			}
		break;
	}
}


Creep.prototype.setSourceTarget = function() {
	tg=this.pos.findClosestByPath(FIND_SOURCES_ACTIVE)
	if (tg) {
		if (this.setNewTarget(tg, 1, 2)) {
			return true
		}
	}
	return false
}

Creep.prototype.setStorageTarget = function() {
	fil={filter: (i) => i.structureType == STRUCTURE_CONTAINER && i.store[RESOURCE_ENERGY] > 0 }
	tg=this.pos.findClosestByPath(FIND_STRUCTURES, fil);
	if (tg) {
		if (this.setNewTarget(tg, 1, 1)) {
			return true
		}
	}
	return false
}

Creep.prototype.setEnergyTarget = function() {
	fil={filter: (i) => i.structureType == STRUCTURE_CONTAINER && i.store[RESOURCE_ENERGY] > 0 }
	tg=this.pos.findClosestByPath(FIND_STRUCTURES, fil);
	tt=1
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
	}
	return false
}

Creep.prototype.setUleTarget = function() {
	fil={ filter : function(object) { if ((object.structureType==STRUCTURE_SPAWN || object.structureType==STRUCTURE_EXTENSION) && object.energy < object.energyCapacity) {return 1} else {return 0} }}
	tg=this.pos.findClosestByPath(FIND_MY_STRUCTURES, fil);
	tt=1
	if (!tg) {
		fil={filter: (i) => i.structureType == STRUCTURE_CONTAINER && i.store[RESOURCE_ENERGY] < i.storeCapacity }
		tg=this.pos.findClosestByPath(FIND_STRUCTURES, fil);
		tt=2
	}
	if (tg) {
		if (this.setNewTarget(tg, 1, tt)) {
			return true
		}
	}
	return false
}

Creep.prototype.setBuildTarget = function() {
	tg=this.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);
	if (tg) {
		if (this.setNewTarget(tg, 3, 1)) {
			return true
		}
	}
	return false
}

Creep.prototype.setUpgradeTarget = function() {
	tg=this.room.controller;
	if (tg) {
		if (this.setNewTarget(tg, 3, 1)) {
			return true
		}
	}
	return false
}

Creep.prototype.setRepairTarget = function() {
	fil={filter: (i) => i.hits < (i.hitsMax*0.8) }
	tg=this.pos.findClosestByPath(FIND_STRUCTURES, fil);
	if (tg) {
		if (this.setNewTarget(tg, 3, 1)) {
			return true
		}
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

Creep.prototype.loAction=function () {
	act=this.getAction()
	target=Game.getObjectById(this.memory.targeti)
	if (target) {
		if (act.opt) {
			res=this[act.type](target, act.opt)
		}
		else {
			res=this[act.type](target)
		}
		return res
	}
	else {
		return -99
	}
}

Creep.prototype.getAction=function () {
	ty=false
	opt=false
	switch (this.memory.role) {
		case "harvester":
			if (this.memory.jobstatus==0) {
				ty="harvest";
			}
			else {
				ty="transfer"
				opt=RESOURCE_ENERGY
			}
		break;
		case "builder":
			if (this.memory.jobstatus==0) {
				if (this.memory.targett==1) {
					ty="withdraw"
					opt=RESOURCE_ENERGY
				}
				else {
					ty="harvest"
				}
			}
			else {
				ty="build"
			}
		break;
		case "upgrader":
			if (this.memory.jobstatus==0) {
				if (this.memory.targett==1) {
					ty="withdraw"
					opt=RESOURCE_ENERGY
				}
				else {
					ty="harvest"
				}
			}
			else {
				ty="upgradeController"
			}
		break;
		case "repairer":
			if (this.memory.jobstatus==0) {
				if (this.memory.targett==1) {
					ty="withdraw"
					opt=RESOURCE_ENERGY
				}
				else {
					ty="harvest"
				}
			}
			else {
				ty="repair"
			}
		break;
	}
	ac={'type':ty, 'opt':opt}
	return ac
}

Creep.prototype.loMove= function() {
	if (this.isArrived()){
		brain.pathinfo(this.room.name, this.pos.x, this.pos.y)
		return 1
	}
	else {
		if ((this.memory.lx==this.pos.x) && (this.memory.ly==this.pos.y) && (this.memory.lf==this.fatigue)) {
			this.say("ST")
			return -101
		}
		else {
			this.memory.lx=this.pos.x
			this.memory.ly=this.pos.y
			this.memory.lf=this.fatigue
			if (this.fatigue>0) {
				return 0
			}
			else {
				brain.pathinfo(this.room.name, this.pos.x, this.pos.y)
				res=this.moveByPath(Room.deserializePath(this.memory.sp))
				return res
			}
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
	globals.roles[this.memory.role].toCreate=false
	rx=globals.parkingx+Math.floor((Math.random() * 20) - 9);
	ry=globals.parkingy+Math.floor((Math.random() * 20) - 9);
	//this.moveTo(rx, ry)
	this.move(BOTTOM_LEFT)
	if (!this.memory.parkedTime) {
		this.memory.parkedTime=0
	}
	this.memory.parkedTime++;
	if (this.memory.parkedTime>10) {
		this.memory.parkedTime=0
		r=Math.floor(Math.random() * 4)
		c=0
		newrole=false
		for (var id in globals.roles) {
			if (c==r) {
				newrole=id
			}
			c++
		}
		this.memory.role=newrole
	}
}


/*

Creep.prototype.loHarvest = function() {
	//utils.loLog("loHarvest "+this.memory.jobstep, this.memory, this.name)
	switch(this.memory.jobstep) {
		case 0:
			if (this.setSourceTarget()) {
				this.memory.jobstep=1
				this.loHarvest()
			}
			else {
				brain.stuckinfo(this.memory.role, this.memory.jobstatus, this.memory.jobstep, 1)
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
					brain.stuckinfo(this.memory.role, this.memory.jobstatus, this.memory.jobstep, 1)
					this.memory.jobstep=0
					this.loHarvest()
				}
			}
		break;
		case 2:
			if (this.carry.energy<this.carryCapacity) {
				ac=this.loAction("harvest")
				if (ac!=0) {
					utils.loError()
					brain.stuckinfo(this.memory.role, this.memory.jobstatus, this.memory.jobstep, 1)
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
				brain.stuckinfo(this.memory.role, this.memory.jobstatus, this.memory.jobstep, 1)
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
					brain.stuckinfo(this.memory.role, this.memory.jobstatus, this.memory.jobstep, 1)
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
					brain.stuckinfo(this.memory.role, this.memory.jobstatus, this.memory.jobstep, 1)
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
				brain.stuckinfo(this.memory.role, this.memory.jobstatus, this.memory.jobstep, 1)
				this.goToPark();
				globals.roles[this.memory.role].toCreate=false
			}
		break;
		case 1:
			mo=this.loMove()
			if (mo==1) {
				this.memory.jobstep=2
				this.unloadEnergy()
			}
			else {
				if (mo!=0 && mo!=-11) {
					brain.stuckinfo(this.memory.role, this.memory.jobstatus, this.memory.jobstep, 1)
					this.memory.jobstep=0
					this.unloadEnergy()
				}
			}
		break;
		case 2:
			if (this.carry.energy>0) {
				ac=this.loAction("transfer", RESOURCE_ENERGY)
				if (ac!=0) {
					brain.stuckinfo(this.memory.role, this.memory.jobstatus, this.memory.jobstep, 1)
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
				brain.stuckinfo(this.memory.role, this.memory.jobstatus, this.memory.jobstep, 1)
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
					if (mo!=0 && mo!=-11) {
						brain.stuckinfo(this.memory.role, this.memory.jobstatus, this.memory.jobstep, 1)
						this.memory.jobstep=0
					}
				}
		break;
		case 2:
			if (this.carry.energy>0) {
				ac=this.loAction("build")
				if (ac!=0) {
					brain.stuckinfo(this.memory.role, this.memory.jobstatus, this.memory.jobstep, 1)
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
				brain.stuckinfo(this.memory.role, this.memory.jobstatus, this.memory.jobstep, 1)
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
					if (mo!=0 && mo!=-11) {
						brain.stuckinfo(this.memory.role, this.memory.jobstatus, this.memory.jobstep, 1)
						this.memory.jobstep=0
					}
				}
		break;
		case 2:
			if (this.carry.energy>0) {
				ac=this.loAction("upgradeController")
				if (ac!=0) {
					brain.stuckinfo(this.memory.role, this.memory.jobstatus, this.memory.jobstep, 1)
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
}*/
