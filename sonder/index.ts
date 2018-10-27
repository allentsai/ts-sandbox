import {readFileSync} from 'fs';
import * as path from 'path';

class UnitManager {
    properties;
    allProperties;
    EXPANSION;
    constructor() {
        this.allProperties = {};
        this.properties = {};
        this.EXPANSION = 50; // max ~radius to search
    }

    add_unit(unit) {
        this.allProperties[unit.id] = unit;
        if (!this.properties[unit.city]) {
            this.properties[unit.city] = {};
        }
        const distance = this.get_distance_metric(unit);
        if (!this.properties[unit.city][distance]) {
            this.properties[unit.city][distance] = {};
        }

        this.properties[unit.city][distance][unit.id] = unit;
    }

    nearest_similar_units(unit, limit) {
        const distance = this.get_distance_metric(unit);
        let potentialProperties = this.get_potentials(unit, distance, 0);
        let offset = 1;
        while (potentialProperties.length < limit && offset < this.EXPANSION) { // Didn't find enough, widen search
            potentialProperties = potentialProperties.concat(this.get_potentials(unit, distance, offset));
            offset += 1;
        }

        potentialProperties.sort((a, b) => (a.distance - b.distance));
        while(potentialProperties.length > limit) {
            potentialProperties.pop(); // remove furthest
        }

        return potentialProperties.map(({property}) => (property));
    }

    get_potentials(unit, distance, offset) {
        let potentialProperties = [];
        const properties = offset === 0 
            ? this.properties[unit.city][distance] 
            : {
                ...(this.properties[unit.city][distance + offset] || {}), 
                ...(this.properties[unit.city][distance - offset] || {})
            };
        for (let pid in properties) {
            const property = this.allProperties[pid];
            if (this.is_similar(unit, property) && unit.id != property.id) {
                potentialProperties.push({distance: this.get_distance(property, unit), property});
            }
        }

        return potentialProperties;
    }

    is_similar(base, comparison) {
        return base.beds === comparison.beds && base.baths === comparison.baths
    }

    get_distance(property, unit) {
        return Math.pow(property.lat - unit.lat, 2) + Math.pow(property.lng - unit.lng, 2);
    }

    get_distance_metric(unit) {
        return Math.round(Math.pow(unit.lat, 2) + Math.pow(unit.lng, 2));
    }
}

function runner(fileLocation) {
    const file = readFileSync(path.resolve(__dirname, fileLocation));
    const properties = JSON.parse(file.toString());
    const UM = new UnitManager();
    const now = Date.now();
    const limit = 10;
    properties.forEach((property) => {
        UM.add_unit(property); 
        UM.nearest_similar_units(property, limit);
    });
    console.log(Date.now() - now);
}

runner('../units_small.json');
runner('../units_large.json');
