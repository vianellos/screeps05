/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('utils');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    /** @param {Creep} creep **/
    log: function(msg, val, name=false) {
		if (name) {
			console.log(name+" -> "+msg+": "+JSON.stringify(val))
		}
		else {
        	console.log(msg+": "+JSON.stringify(val))
		}
    },
	cleanCreeps: function() {
		for(var i in Memory.creeps) {
		    if(!Game.creeps[i]) {
		        utils.loWarn("Deleted", Memory.creeps[i], Memory.creeps[i].name)
		        delete Memory.creeps[i];
		    }
		}
	},
	countCreeps: function() {
		tot=0
		for (var id in Game.creeps) {
			tot++
			loVar.roles[Game.creeps[id].memory.role].current++
		}
		loVar.creepsNumber=tot
		return tot
	},
    getGoals: function (gro, gt, gra) {
        let goals = _.map(gro.find(gt), function(source) {
                return { pos: source.pos, range: gra };
            });
        return goals
    },
	calcCost: function (body) {
		cost=0;
		for (var bpid in body) {
			cost+=BODYPART_COST[body[bpid]]
		}
		return cost
	}
};
