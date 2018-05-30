brain=require("brain")
require("spawner")
require("lcreep")
require("lroom")
globals=require("globals")
utils=require("utils")



brain.init()



module.exports.loop = function () {
	brain.tick()
    for (var id in Game.spawns) {
        Game.spawns[id].spawner()
    }
    for (var id in Game.creeps) {
        Game.creeps[id].loJob()
		/*fil={ filter : function(object) { if (object.structureType==STRUCTURE_SPAWN && object.energy < object.energyCapacity) {return 1} else {return 0} }}
		tg=Game.creeps[id].pos.findClosestByPath(FIND_MY_STRUCTURES, fil);
		utils.loLog("test find", tg)*/
    }
}
