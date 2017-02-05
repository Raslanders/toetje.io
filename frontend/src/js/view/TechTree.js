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
            let div = document.createElement("div");
            div.setAttribute("class", "building");

            let image = document.createElement("div");
            image.setAttribute("class", "image");
            div.appendChild(image);

            let nameDiv = document.createElement("div");
            nameDiv.setAttribute("class", "name");
            nameDiv.innerHTML = tech.name;
            div.appendChild(nameDiv);

            this.container.appendChild(div)
        }
    }
}

module.exports = TechTree;