import { GAME_CONFIG } from "../utils/Constants.js";

export default class Camera {
    constructor(worldWidth = GAME_CONFIG.WIDTH, worldHeight = GAME_CONFIG.HEIGHT) {
        this.x = 0;
        this.y = 0;
        this.width = GAME_CONFIG.WIDTH;
        this.height = GAME_CONFIG.HEIGHT;
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
        this.smoothing = 8;
    }

    follow(target, deltaTime) {
        const targetX = target.x + target.width / 2 - this.width / 2;
        const targetY = target.y + target.height / 2 - this.height / 2;

        const interpolation = Math.min(this.smoothing * deltaTime, 1);

        this.x += (targetX - this.x) * interpolation;
        this.y += (targetY - this.y) * interpolation;

        this.x = Math.max(0, Math.min(this.x, this.worldWidth - this.width));
        this.y = Math.max(0, Math.min(this.y, this.worldHeight - this.height));
    }

    apply(ctx) {
        ctx.save();
        ctx.translate(-Math.floor(this.x), -Math.floor(this.y));
    }

    reset(ctx) {
        ctx.restore();
    }

    setWorldSize(width, height) {
        this.worldWidth = width;
        this.worldHeight = height;
    }
}