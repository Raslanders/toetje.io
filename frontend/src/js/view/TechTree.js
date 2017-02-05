/**
 * Created by ruudandriessen on 05/02/2017.
 */
class TechTree {
    constructor(container) {
        this.container = container;
    }

    render(techtree) {
        // append buildings
        for (let k in techtree) {
            let tech = techtree[k];
            let div = document.createElement('div');
            div.setAttribute('class', `menu-item building-${tech.slug}`);

            let nameDiv = document.createElement('div');
            nameDiv.setAttribute('class', 'name');
            nameDiv.innerHTML = tech.name;
            div.appendChild(nameDiv);

            this.container.appendChild(div)
        }
    }
}

module.exports = TechTree;
