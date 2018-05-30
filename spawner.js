StructureSpawn.prototype.spawner = function() {

    for (var id in globals.bodies) {
		if (globals.bodies[id].toCreate) {
	        if (this.room.energyAvailable>globals.bodies[id].cost) {
				mem={role: globals.bodies[id].role, jobstatus:0, jobstep:0, bodyid:id}
	            sp=this.spawnCreep(globals.bodies[id].body, "Cr"+globals.cnum, { memory: mem})
	            if (sp==0) {
	                utils.loWarn("Spawning "+globals.bodies[id].role, globals.bodies[id].body, "Cr"+globals.cnum)
					globals.cnum++
	            }
	            else if (sp==-3)
	            {
	                 globals.cnum++
	            }
	            else {
	                utils.loError("non spa", sp)
	            }
	        }
		}
    }


}
