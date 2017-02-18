let instance = null;

class Globals {
    constructor() {
        if(!instance) {
            instance = this;
        }
        // Milliseconds per tick
        this.timePerTick = 1000;
        // Ticks until a wave spawns
        this.ticksPerWave = 10;

        return instance;
    }
}

module.exports = new Globals();
