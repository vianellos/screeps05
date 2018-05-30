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
        Game.creeps[id].ljob()
    }
}
