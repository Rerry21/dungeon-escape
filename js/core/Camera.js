import { GAME_CONFIG } from "../utils/Constants.js";

export default class Camera{
    constructor(
        width = GAME_CONFIG.WIDTH,
        height = GAME_CONFIG.HEIGHT,
        worldWidth = GAME_CONFIG.WIDTH,
        worldHeight = GAME_CONFIG.HEIGHT
    ){
        this.x = 0;
        this.y = 0;

        this.width = width;
        this.height = height;

        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;

        this.smoothing = 8;
    }

    follow(target, deltaTime){
        const targetX = target.x + target.width / 2 - this.width / 2;
        const targetY = target.y + target.height / 2 - this.height / 2;
        const interpolation = Math.min(
            this.smoothing * deltaTime,
            1
        );

        this.x += (targetX - this.x) * interpolation;
        this.y += (targetY - this.y) * interpolation;

        this.clamp();
    }

    snapTo(target){
        this.x = target.x + target.width / 2 - this.width / 2;
        this.y = target.y + target.height / 2 - this.height / 2;

        this.clamp();
    }

    clamp(){
        const maxX = Math.max(
            0,
            this.worldWidth - this.width
        );

        const maxY = Math.max(
            0,
            this.worldHeight - this.height
        );

        this.x = Math.max(0, Math.min(this.x, maxX));
        this.y = Math.max(0, Math.min(this.y, maxY));
    }

    apply(ctx){
        ctx.save();

        ctx.translate(
            -Math.floor(this.x),
            -Math.floor(this.y)
        );
    }

    reset(ctx){
        ctx.restore();
    }

    setWorldSize(width, height){
        this.worldWidth = width;
        this.worldHeight = height;

        this.clamp();
    }
}