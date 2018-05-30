Creep.prototype.ljob = function() {
	//this.suicide()
	if (!this.spawning) {
		switch (this.memory.role) {
			case "starter":
				this.harvester()
			break;
			case "builder":
				this.builder()
			break;
		}
	}
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
			if (this.setNewTarget(FIND_MY_CONSTRUCTION_SITES, 1)) {
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


Creep.prototype.setNewTarget = function(ty, fi, ra) {
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

Creep.prototype.doAction=function (ty, opt) {
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

Creep.prototype.lMove= function() {
	if (this.isArrived()){
		return 1
	}
	else {
		if ((this.memory.lx==this.pos.x) && (this.memory.ly==this.pos.y) && (this.memory.lf==this.fatigue)) {
			utils.elog("Stucked", this.fatigue, this.name)
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
		/*switch(res) {
			case -5:
				this.memory.jobstatus=0
			break;
			case 0:
				if (this.isArrived()){
					this.memory.jobstatus=2
				}
				else {
					utils.elog(this.name+"lx",this.memory.lx)
					utils.elog(this.name+"x",this.pos.x)
					utils.elog(this.name+"ly",this.memory.ly)
					utils.elog(this.name+"y",this.pos.y)
					utils.elog(this.name+"lf",this.memory.lf)
					utils.elog(this.name+"f",this.fatigue)
				}
			break;
		}*/
}

Creep.prototype.isArrived = function() {
    if (this.pos.x>=this.memory.targetx-this.memory.targetr && this.pos.x<=this.memory.targetx+this.memory.targetr && this.pos.y>=this.memory.targety-this.memory.targetr && this.pos.y<=this.memory.targety+this.memory.targetr) {
		return true
    }
    else {
        return false
    }
}
