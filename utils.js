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
    elog: function(msg, val) {
        console.log(msg+": "+JSON.stringify(val))
    } ,
    getGoals: function (gro, gt, gra) {
        let goals = _.map(gro.find(gt), function(source) {
                return { pos: source.pos, range: gra };
            });
        return goals
    }
};
