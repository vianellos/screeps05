loVar=require("variables")
loCon=require("constants")
utils=require("utils")
loInit=require("loinit")
require("lroom")
require("lspawn")

loInit.init();


module.exports.loop = function () {
	loInit.tick()
	for (var sid in Game.spawns) {
		Game.spawns[sid].spawn()
	}
}
