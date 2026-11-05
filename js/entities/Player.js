import Entity from "./Entity.js";
import { GAME_CONFIG } from "../utils/Constants.js";

export default class Player extends Entity {
    constructor(x, y) {
        super(x, y, 24, 24);

        this.speed = 180;
        this.color = "#d6a84f";
        this.direction = "down";

        this.attackDuration = 0.12;
        this.attackCooldown = 0.25;
        this.attackTimer = 0;
        this.cooldownTimer = 0;
        this.attackRange = 18;
        this.attackWidth = 18;
    }

    update(deltaTime, input, tileMap) {
        this.updateAttackTimers(deltaTime);

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

        if (
            input.isPressed("Space") &&
            this.cooldownTimer <= 0
        ) {
            this.attack();
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

    updateAttackTimers(deltaTime) {
        if (this.attackTimer > 0) {
            this.attackTimer -= deltaTime;
        }

        if (this.cooldownTimer > 0) {
            this.cooldownTimer -= deltaTime;
        }
    }

    attack() {
        this.attackTimer = this.attackDuration;
        this.cooldownTimer =
            this.attackDuration +
            this.attackCooldown;
    }

    isAttacking() {
        return this.attackTimer > 0;
    }

    getAttackHitbox() {
        const centerX =
            this.x +
            this.width / 2;

        const centerY =
            this.y +
            this.height / 2;

        if (this.direction === "up") {
            return {
                x: centerX - this.attackWidth / 2,
                y: this.y - this.attackRange,
                width: this.attackWidth,
                height: this.attackRange
            };
        }

        if (this.direction === "down") {
            return {
                x: centerX - this.attackWidth / 2,
                y: this.y + this.height,
                width: this.attackWidth,
                height: this.attackRange
            };
        }

        if (this.direction === "left") {
            return {
                x: this.x - this.attackRange,
                y: centerY - this.attackWidth / 2,
                width: this.attackRange,
                height: this.attackWidth
            };
        }

        return {
            x: this.x + this.width,
            y: centerY - this.attackWidth / 2,
            width: this.attackRange,
            height: this.attackWidth
        };
    }

    moveHorizontal(deltaTime, tileMap) {
        this.x += this.velocityX * deltaTime;

        if (tileMap.collides(this)) {
            if (this.velocityX > 0) {
                const column = Math.floor(
                    (this.x + this.width) /
                    GAME_CONFIG.TILE_SIZE
                );

                this.x =
                    column * GAME_CONFIG.TILE_SIZE -
                    this.width;
            } else if (this.velocityX < 0) {
                const column = Math.floor(
                    this.x /
                    GAME_CONFIG.TILE_SIZE
                );

                this.x =
                    (column + 1) *
                    GAME_CONFIG.TILE_SIZE;
            }
        }

        this.x = Math.max(
            0,
            Math.min(
                this.x,
                GAME_CONFIG.WORLD_WIDTH -
                this.width
            )
        );
    }

    moveVertical(deltaTime, tileMap) {
        this.y += this.velocityY * deltaTime;

        if (tileMap.collides(this)) {
            if (this.velocityY > 0) {
                const row = Math.floor(
                    (this.y + this.height) /
                    GAME_CONFIG.TILE_SIZE
                );

                this.y =
                    row * GAME_CONFIG.TILE_SIZE -
                    this.height;
            } else if (this.velocityY < 0) {
                const row = Math.floor(
                    this.y /
                    GAME_CONFIG.TILE_SIZE
                );

                this.y =
                    (row + 1) *
                    GAME_CONFIG.TILE_SIZE;
            }
        }

        this.y = Math.max(
            0,
            Math.min(
                this.y,
                GAME_CONFIG.WORLD_HEIGHT -
                this.height
            )
        );
    }

    reset(x, y) {
        this.x = x;
        this.y = y;
        this.velocityX = 0;
        this.velocityY = 0;
        this.direction = "down";
        this.attackTimer = 0;
        this.cooldownTimer = 0;
    }
}