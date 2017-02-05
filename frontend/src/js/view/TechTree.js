/**
 * Created by ruudandriessen on 05/02/2017.
 */

const _ = require('lodash');

class TechTree {
    constructor(container) {
        this.container = container;
        this.activeTech = null;
        this.techtree = {};
    }

    render(techtree) {
        if (_.keys(this.techtree).length) {
            return;
        }

        this.techtree = _.keyBy(techtree, t => parseInt(t.id));
        this.activeTech = parseInt(_.keys(this.techtree)[0]);

        // append buildings
        _.each(this.techtree, tech => {
            let div = document.createElement('div');
            div.setAttribute('class', `_tech menu-item building-${tech.slug}`);
            div.onclick = () => {
                this.clickTech(tech, div);
            }

            let nameDiv = document.createElement('div');
            nameDiv.setAttribute('class', 'name');
            nameDiv.innerHTML = tech.name;
            div.appendChild(nameDiv);

            this.container.appendChild(div);
        });
    }

    getSpriteUrlForTechId(id) {
        const tech = this.techtree[id];
        let slug = tech.slug;

        // The base tech has '' as slug
        // And that asset has no underscore
        if (slug !== '') {
            slug = '_' + slug;
        }

        return `static/building${slug}.png`;
    }

    clickTech(tech, div) {
        const techs = document.getElementsByClassName('_tech');
        _.each(techs, tDiv => tDiv.classList.remove('active'));

        this.activeTech = tech.id;
        div.classList.add('active');
    }
}

module.exports = TechTree;
