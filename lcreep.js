Creep.prototype.ljob = function() {

   switch (this.memory.role) {
        case "harvester":
            this.harvester()
        break;
   }
}

Creep.prototype.harvester = function() {
    switch (this.memory.jobstatus) {
        case 0:
            target=this.pos.findClosestByPath(FIND_SOURCES_ACTIVE)
            this.memory.targetx=target.pos.x
            this.memory.targety=target.pos.y
            this.memory.targetr=1
            this.memory.targeti=target.id
			this.memory.lx=0
			this.memory.ly=0
			this.memory.lf=0
            utils.elog("Target set", target, this.name)
            path2=this.pos.findPathTo(target, {range: 1})
            //utils.elog("path set",path2, this.name)
            this.memory.sp=Room.serializePath(path2)
            this.memory.jobstatus=1
			this.harvester()
        break;
        case 1:
			m=this.lMove()
			utils.elog("Muovendo 1",m, this.name)
			if (m==1) {
				this.memory.jobstatus=2
				utils.elog("Arrivato 1",m, this.name)
				this.harvester()
			}
			else if (m==-101) {
				utils.elog("Bloccato 1",m, this.name)
				this.memory.jobstatus=0
			}
        break;
        case 2:
            target=Game.getObjectById(this.memory.targeti)
            //utils.elog(this.name+"target3",t3)
            res=this.harvest(target)
			utils.elog("Lavorando",res, this.name)
			if (res==-9) {
				this.memory.jobstatus=0
				//this.harvester()
			}
			if (this.carry.energy>=this.carryCapacity) {
				this.memory.jobstatus=3
				utils.elog("Pieno", this.carry, this.name)
			}
		break;
		case 3:
			rtype=FIND_STRUCTURES
			rfilter= { filter: (structure) => { return ( ((structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity)); } }
			target=this.pos.findClosestByPath(rtype, rfilter)
			this.memory.targetx=target.pos.x
			this.memory.targety=target.pos.y
			this.memory.targetr=1
			this.memory.targeti=target.id
			this.memory.lx=0
			this.memory.ly=0
			this.memory.lf=0
			utils.elog("Target back set", target, this.name)
			path2=this.pos.findPathTo(target, {range: 1})
			//utils.elog("path set",path2, this.name)
			this.memory.sp=Room.serializePath(path2)
			this.memory.jobstatus=4
			this.harvester()
		break;
		case 4:
			m=this.lMove()
			utils.elog("Muovendo 2",m, this.name)
			if (m==1) {
				this.memory.jobstatus=5
				utils.elog("Arrivato 2",m, this.name)
				this.harvester()
			}
			else if (m==-101) {
				utils.elog("Bloccato 2",m, this.name)
				this.memory.jobstatus=3
			}
		break;
		case 5:
			obj=Game.getObjectById(this.memory.targeti)
			res=this.transfer(obj, RESOURCE_ENERGY)
			if (res==-9) {
				this.memory.jobstatus=3
				//this.harvester()
			}
			utils.elog("Scaricando", res, this.name)
			//utils.elog("Scaricando obj", obj, this.name)
			if (this.carry.energy==0) {
				utils.elog("Scaricato", this.carry, this.name)
				this.memory.jobstatus=0
			}
        break;
    }
}

Creep.prototype.lMove= function() {
	if (this.isArrived()){
		utils.elog("Arrivato", 1, this.name)
		return 1
	}
	else {
		if ((this.memory.lx==this.pos.x) && (this.memory.ly==this.pos.y) && (this.memory.lf==this.fatigue)) {
			utils.elog("Stucked", this.fatigue, this.name)
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
    if (this.pos.x>=this.memory.targetx-this.memory.targetr && this.pos.x<=this.memory.targetx+this.memory.targetr) {
        return true
    }
    else {
        return false
    }
}
