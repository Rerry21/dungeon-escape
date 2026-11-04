import Entity from "./Entity.js";
import { GAME_CONFIG } from "../utils/Constants.js";

export default class Player extends Entity {
    constructor(x, y) {
        super(x, y, 24, 24);

        this.speed = 180;
        this.color = "#d6a84f";
        this.direction = "down";
    }

    update(deltaTime, input, tileMap) {
        let horizontal = 0;
        let vertical = 0;

        if (input.isDown("KeyA") || input.isDown("ArrowLeft")) {
            horizontal -= 1;
            this.direction = "left";
        }

        if (input.isDown("KeyD") || input.isDown("ArrowRight")) {
            horizontal += 1;
            this.direction = "right";
        }

        if (input.isDown("KeyW") || input.isDown("ArrowUp")) {
            vertical -= 1;
            this.direction = "up";
        }

        if (input.isDown("KeyS") || input.isDown("ArrowDown")) {
            vertical += 1;
            this.direction = "down";
        }

        if (horizontal !== 0 && vertical !== 0) {
            const length = Math.sqrt(
                horizontal * horizontal +
                vertical * vertical
            );

            horizontal /= length;
            vertical /= length;
        }

        this.velocityX = horizontal * this.speed;
        this.velocityY = vertical * this.speed;

        this.moveHorizontal(deltaTime, tileMap);
        this.moveVertical(deltaTime, tileMap);
    }

    moveHorizontal(deltaTime, tileMap) {
        this.x += this.velocityX * deltaTime;

        if (tileMap.collides(this)) {
            if (this.velocityX > 0) {
                const column = Math.floor(
                    (this.x + this.width) / GAME_CONFIG.TILE_SIZE
                );

                this.x =
                    column * GAME_CONFIG.TILE_SIZE -
                    this.width;
            } else if (this.velocityX < 0) {
                const column = Math.floor(
                    this.x / GAME_CONFIG.TILE_SIZE
                );

                this.x =
                    (column + 1) * GAME_CONFIG.TILE_SIZE;
            }
        }

        this.x = Math.max(
            0,
            Math.min(
                this.x,
                GAME_CONFIG.WORLD_WIDTH - this.width
            )
        );
    }

    moveVertical(deltaTime, tileMap) {
        this.y += this.velocityY * deltaTime;

        if (tileMap.collides(this)) {
            if (this.velocityY > 0) {
                const row = Math.floor(
                    (this.y + this.height) / GAME_CONFIG.TILE_SIZE
                );

                this.y =
                    row * GAME_CONFIG.TILE_SIZE -
                    this.height;
            } else if (this.velocityY < 0) {
                const row = Math.floor(
                    this.y / GAME_CONFIG.TILE_SIZE
                );

                this.y =
                    (row + 1) * GAME_CONFIG.TILE_SIZE;
            }
        }

        this.y = Math.max(
            0,
            Math.min(
                this.y,
                GAME_CONFIG.WORLD_HEIGHT - this.height
            )
        );
    }

    reset(x, y) {
        this.x = x;
        this.y = y;
        this.velocityX = 0;
        this.velocityY = 0;
        this.direction = "down";
    }
}