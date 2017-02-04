/**
 * Created by ruudandriessen on 04/02/2017.
 */
'use strict';

const tech = require('./tech');
const Technology = require('../models/Technology');
const Unit = require('../models/Unit');

/**
 * Instantiates all data from tech.json
 * @returns {{units: {}, technologies: {}}}
 */
function data() {
    let techs = {};
    let units = {};
    for (let k in tech) {
        let t = tech[k];
        let unit = new Unit(t.stats);
        techs[t.id] = new Technology(t.id, t.name, t.description, t.price, t.required, unit);
        units[t.id] = unit;
    }
    return {units: units, technologies: techs};
}

module.exports = data;