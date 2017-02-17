const _ = require('lodash');

class WaveProgress {
    constructor(container) {
        this.container = container;
        this.waveCounter = 0;
    }

    render(waveCounter) {
        if(waveCounter) {
            this.waveCounter = waveCounter;
        }
        this.waveCounter = waveCounter;
        this.container.style.width = waveCounter*100 + "%";
    }
}

module.exports = WaveProgress;
