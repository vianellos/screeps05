module.exports = {
    /** @param {Creep} creep **/
	stcount: 0,
	tentick:0,
	cnum: 1,
    tick: 0,
    bodies: {
		1:{ 'body': [WORK, CARRY, MOVE], 'cost': 200, 'role':'starter'},
		2:{ 'body': [WORK, CARRY, MOVE], 'cost': 200, 'role':'builder'},
		3:{ 'body': [WORK, CARRY, MOVE], 'cost': 200, 'role':'harvester'},
	}

};
