let instance = null;

class Globals {
    constructor() {
        if(!instance) {
            instance = this;
        }
        this.waveTicks = 10;

        return instance;
    }
}

module.exports = new Globals();
