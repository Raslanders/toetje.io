/**
 * Created by ruudandriessen on 05/02/2017.
 */

const _ = require('lodash');

class TechTree {
    constructor(container) {
        this.container = container;
        this.techtree = [];
    }

    render(techtree) {
        if (this.techtree.length) {
            return;
        }

        this.techtree = techtree;

        // append buildings
        for (let k in this.techtree) {
            let tech = this.techtree[k];
            let div = document.createElement('div');
            div.setAttribute('class', `_tech menu-item building-${tech.slug}`);
            div.onclick = () => {
                this.clickTech(tech, div);
            }

            let nameDiv = document.createElement('div');
            nameDiv.setAttribute('class', 'name');
            nameDiv.innerHTML = tech.name;
            div.appendChild(nameDiv);

            this.container.appendChild(div)
        }
    }

    clickTech(tech, div) {
        const techs = document.getElementsByClassName('_tech');
        _.each(techs, tDiv => tDiv.classList.remove('active'));

        div.classList.add('active');
    }
}

module.exports = TechTree;
