const _ = require('lodash');

class Resource {
    constructor(container) {
        this.container = container;
        this.resource = 0;
    }

    render(resource) {
        if(resource) {
            this.resource = resource;
        }
        this.resource = resource;

        this.container.innerHTML = "Resources: " + this.resource;
    }
}

module.exports = Resource;
