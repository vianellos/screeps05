module.exports = {
    /** @param {Creep} creep **/
	stcount: 0,
	tentick:0,
	cnum: 1,
    tick: 0,
	ttlLimit: 100,
    bodies: {
		1:{ 'body': [WORK, CARRY, MOVE], 'cost': 200, 'role':'harvester'},
		//2:{ 'body': [WORK, CARRY, MOVE], 'cost': 200, 'role':'builder'},
		//3:{ 'body': [WORK, CARRY, MOVE], 'cost': 200, 'role':'upgrader'},
	},
	roles: {
		'harvester':{'go': 'loHarvest', 'come':'unloadEnergy'},
		//'builder':{'go': 'loadEnergy', 'come':'loBuild'},
		//'upgrader':{'go': 'loadEnergy', 'come':'loUpgrade'}
	}

};
