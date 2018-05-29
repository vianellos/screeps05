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
            utils.elog(this.name+"target set", target)
            path2=this.pos.findPathTo(target, {range: 1})
            utils.elog(this.name+"path set",path2)
            this.memory.sp=Room.serializePath(path2)
            this.memory.jobstatus=1
        break;
        case 1:
            this.memory.lx=this.pos.x
            this.memory.ly=this.pos.y
            this.memory.lf=this.fatigue
            res=this.moveByPath(Room.deserializePath(this.memory.sp))
            if (this.isArrived()){
                this.memory.jobstatus=2
            }
            else {
                switch(res) {
                    case -5:
                        this.memory.jobstatus=0 
                    break;
                    case 0:
                        if (this.isArrived()){
                            this.memory.jobstatus=2
                        }
                        else {
                            /*utils.elog(this.name+"lx",this.memory.lx)
                            utils.elog(this.name+"x",this.pos.x)
                            utils.elog(this.name+"ly",this.memory.ly)
                            utils.elog(this.name+"y",this.pos.y)
                            utils.elog(this.name+"lf",this.memory.lf)
                            utils.elog(this.name+"f",this.fatigue)*/
                        }
                    break;
                }
            }
            utils.elog(this.name+"res",res)
            //utils.elog("pos2",this.pos)
            utils.elog(this.name+"arrived",this.isArrived())
        break;
        case 2:
            target=Game.getObjectById(this.memory.targeti)
            //utils.elog(this.name+"target3",t3)
            res=this.harvest(target)
            utils.elog(this.name+"res har",res)
            //this.memory.jobstatus=0
        break;
    }
    
}

Creep.prototype.isArrived = function() {
    if (this.pos.x>=this.memory.targetx-this.memory.targetr && this.pos.x<=this.memory.targetx+this.memory.targetr) {
        return true
    }
    else {
        return false
    }
}