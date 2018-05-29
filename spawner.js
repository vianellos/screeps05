StructureSpawn.prototype.spawner = function() {
    
    for (var id in globals.bodies) {
        if (this.room.energyAvailable>globals.bodies[id].cost) {
            sp=this.spawnCreep(globals.bodies[id].body, "Cr"+globals.cnum, { memory: {role: globals.bodies[id].role, jobstatus:0}})
            if (sp==0) {
                globals.cnum++
                utils.elog("spa", globals.cnum)
            }
            else if (sp==-3)
            {
                 globals.cnum++
            }
            else {
                utils.elog("non spa", sp)
            }
        }
    }

    
}