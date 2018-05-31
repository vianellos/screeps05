module.exports = {
    /** @param {Creep} creep **/
	stcount: 0,
	tentick:0,
	cnum: 1,
    tick: 0,
	ttlLimit: 100,
	parkingx:11,
	parkingy:31,
	maxcreep:0,
	mincreep:0,
    bodies: {
		1:{ 'body': [WORK, CARRY, MOVE], 'cost': 200, 'role':'harvester', 'toCreate':true},
		2:{ 'body': [WORK, CARRY, MOVE], 'cost': 200, 'role':'builder', 'toCreate':true},
		3:{ 'body': [WORK, CARRY, MOVE], 'cost': 200, 'role':'upgrader'},
	},
	bd: {
		'worker': {
			1:{'level': 1,'body': [WORK, CARRY, MOVE], 'cost': 200},
			2:{'level': 2,'body': [WORK, WORK, CARRY, MOVE], 'cost': 300},
			3:{'level': 3,'body': [WORK, WORK, CARRY, CARRY, MOVE, MOVE], 'cost': 400},
			4:{'level': 4,'body': [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE], 'cost': 450},
		}
	},
	roles: {
		'harvester':{'body':'worker','go': 'loHarvest', 'come':'unloadEnergy','toCreate':true, 'suicided':false, 'count':0},
		'builder':{'body':'worker','go': 'loadEnergy', 'come':'loBuild','toCreate':true, 'suicided':false, 'count':0},
		'upgrader':{'body':'worker','go': 'loadEnergy', 'come':'loUpgrade','toCreate':true, 'suicided':false, 'count':0}
	}

};
