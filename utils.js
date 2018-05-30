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
    elog: function(msg, val, name=false) {
		if (name) {
			console.log(name+" -> "+msg+": "+JSON.stringify(val))
		}
		else {
        	console.log(msg+": "+JSON.stringify(val))
		}
    } ,
	cleanCreeps: function() {
		for(var i in Memory.creeps) {
		    if(!Game.creeps[i]) {
		        utils.elog("Deleted", Memory.creeps[i], Memory.creeps[i].name)
				globals.bodies[Memory.creeps[i].bodyid].toCreate=true;
		        delete Memory.creeps[i];
		    }
		}
	},
    getGoals: function (gro, gt, gra) {
        let goals = _.map(gro.find(gt), function(source) {
                return { pos: source.pos, range: gra };
            });
        return goals
    }
};
