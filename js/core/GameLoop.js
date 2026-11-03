
import { GAME_CONFIG } from "../utils/Constants.js";

export default class GameLoop {
    constructor(update, render) {
        this.update = update;
        this.render = render;
        this.running = false;
        this.lastTime = 0;
        this.animationId = null;

        this.frame = this.frame.bind(this);
    }

    start() {
        if (this.running) return;

        this.running = true;
        this.lastTime = performance.now();
        this.animationId = requestAnimationFrame(this.frame);
    }

    stop() {
        this.running = false;

        if (this.animationId !== null) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    frame(currentTime) {
        if (!this.running) return;

        const deltaTime = Math.min(
            (currentTime - this.lastTime) / 1000,
            GAME_CONFIG.MAX_DELTA
        );

        this.lastTime = currentTime;

        this.update(deltaTime);
        this.render();

        this.animationId = requestAnimationFrame(this.frame);
    }
}
