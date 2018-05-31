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
			5:{'level': 5,'body': [WORK, WORK, CARRY, CARRY,CARRY,MOVE, MOVE, MOVE, MOVE], 'cost': 550},
			6:{'level': 6,'body': [WORK, WORK, CARRY, CARRY,CARRY,MOVE, MOVE, MOVE, MOVE, MOVE], 'cost': 600},
			7:{'level': 7,'body': [WORK, WORK, CARRY, CARRY,CARRY,CARRY,MOVE, MOVE, MOVE, MOVE, MOVE], 'cost': 650},
			8:{'level': 8,'body': [WORK, WORK,WORK, CARRY, CARRY,CARRY,CARRY,MOVE, MOVE, MOVE, MOVE, MOVE], 'cost': 750},
			9:{'level': 9,'body': [WORK, WORK,WORK, CARRY, CARRY,CARRY,CARRY,MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], 'cost': 800},
			10:{'level': 10,'body': [WORK, WORK,WORK, CARRY, CARRY,CARRY,CARRY,CARRY,MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], 'cost': 850},
		}
	},
	roles: {
		'harvester':{'body':'worker','toCreate':true, 'suicided':false, 'count':0},
		'builder':{'body':'worker','toCreate':true, 'suicided':false, 'count':0},
		'upgrader':{'body':'worker','toCreate':true, 'suicided':false, 'count':0},
		'repairer':{'body':'worker','toCreate':true, 'suicided':false, 'count':0}
	}

};
