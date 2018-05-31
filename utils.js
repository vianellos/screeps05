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
    loLog: function(msg, val, name=false) {
		if (name) {
			console.log(name+" -> "+msg+": "+JSON.stringify(val))
		}
		else {
        	console.log(msg+": "+JSON.stringify(val))
		}
    } ,
	loWarn: function(msg, val, name=false) {
		if (name) {
			//console.log("WARNING: "+name+" -> "+msg+": "+JSON.stringify(val))
		}
		else {
			//console.log("WARNING: "+msg+": "+JSON.stringify(val))
		}
	} ,
	loError: function(msg, val, name=false) {
		console.log("----------ERROR-----------")
		if (name) {
			console.log(name+" -> "+msg+": "+JSON.stringify(val))
		}
		else {
			console.log(msg+": "+JSON.stringify(val))
		}
		console.log("------------------------------")
	} ,
	loCrLog: function(msg, val, name) {
		if (name=='upg4_4') {
			console.log(name+" -> "+msg+": "+JSON.stringify(val))
		}
	} ,
	cleanCreeps: function() {
		for(var i in Memory.creeps) {
		    if(!Game.creeps[i]) {
		        utils.loWarn("Deleted", Memory.creeps[i], Memory.creeps[i].name)
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
