const _ = require('lodash');

class WaveProgress {
    constructor(container) {
        this.container = container;
        this.timeRemaining = -1;
    }

    render(timeRemaining) {
        if (timeRemaining) {
            this.timeRemaining = timeRemaining;
        }
        this.timeRemaining = timeRemaining;
        this.container.innerHTML = `${timeRemaining}s`;
    }
}

module.exports = WaveProgress;
