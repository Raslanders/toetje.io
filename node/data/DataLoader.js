/**
 * Created by ruudandriessen on 04/02/2017.
 */
'use strict';

const tech = require('./tech');
const Technology = require('../models/Technology');
const Unit = require('../models/Unit');

class DataLoader {
    /**
     * Instantiates all data from tech.json
     * @returns {{units: {}, technologies: {}}}
     */
    static data() {
        let techs = {};
        let units = {};
        for (let k in tech) {
            let t = tech[k];
            let technology = new Technology(t.id, t.name, t.description, t.price, t.required);
            let unit = new Unit(technology, t.stats);
            techs[t.id] = technology;
            units[t.id] = unit;
        }
        console.log(techs, units);
        return {units: units, technologies: techs};
    }
}

module.export = DataLoader;