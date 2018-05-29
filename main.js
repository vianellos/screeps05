console.log("START")
require("brain")
require("spawner")
require("lcreep")
globals=require("globals")
utils=require("utils")

module.exports.loop = function () {
    utils.elog("Tick", globals.tick)

    globals.tick++
    for (var id in Game.spawns) {
        Game.spawns[id].spawner()
    }

    for (var id in Game.creeps) {
        Game.creeps[id].ljob()
    }
}
