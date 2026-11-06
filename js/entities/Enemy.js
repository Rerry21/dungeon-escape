import Entity from "./Entity.js";
import { GAME_CONFIG } from "../utils/Constants.js";

export default class Enemy extends Entity {
    constructor(x, y) {
        super(x, y, 22, 22);

        this.speed = 70;
        this.health = 3;
        this.maxHealth = 3;
        this.damage = 1;

        this.hitCooldown = 0;
        this.hitFlashTimer = 0;
        this.knockbackTimer = 0;
        this.knockbackX = 0;
        this.knockbackY = 0;
    }

    update(deltaTime, player, tileMap) {
        if (this.hitCooldown > 0) {
            this.hitCooldown -= deltaTime;
        }

        if (this.hitFlashTimer > 0) {
            this.hitFlashTimer -= deltaTime;
        }

        if (this.knockbackTimer > 0) {
            this.knockbackTimer -= deltaTime;

            this.x +=
                this.knockbackX *
                deltaTime;

            this.y +=
                this.knockbackY *
                deltaTime;

            this.resolveCollision(tileMap);

            return;
        }

        const playerCenterX =
            player.x +
            player.width / 2;

        const playerCenterY =
            player.y +
            player.height / 2;

        const enemyCenterX =
            this.x +
            this.width / 2;

        const enemyCenterY =
            this.y +
            this.height / 2;

        let horizontal =
            playerCenterX -
            enemyCenterX;

        let vertical =
            playerCenterY -
            enemyCenterY;

        const distance = Math.sqrt(
            horizontal * horizontal +
            vertical * vertical
        );

        if (distance > 28) {
            horizontal /= distance;
            vertical /= distance;

            this.velocityX =
                horizontal *
                this.speed;

            this.velocityY =
                vertical *
                this.speed;

            this.moveHorizontal(
                deltaTime,
                tileMap
            );

            this.moveVertical(
                deltaTime,
                tileMap
            );
        } else {
            this.velocityX = 0;
            this.velocityY = 0;
        }
    }

    moveHorizontal(deltaTime, tileMap) {
        this.x +=
            this.velocityX *
            deltaTime;

        if (tileMap.collides(this)) {
            if (this.velocityX > 0) {
                const column = Math.floor(
                    (this.x + this.width) /
                    GAME_CONFIG.TILE_SIZE
                );

                this.x =
                    column *
                    GAME_CONFIG.TILE_SIZE -
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
        this.y +=
            this.velocityY *
            deltaTime;

        if (tileMap.collides(this)) {
            if (this.velocityY > 0) {
                const row = Math.floor(
                    (this.y + this.height) /
                    GAME_CONFIG.TILE_SIZE
                );

                this.y =
                    row *
                    GAME_CONFIG.TILE_SIZE -
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

    resolveCollision(tileMap) {
        if (tileMap.collides(this)) {
            this.x -=
                this.knockbackX *
                0.03;

            this.y -=
                this.knockbackY *
                0.03;
        }

        this.x = Math.max(
            0,
            Math.min(
                this.x,
                GAME_CONFIG.WORLD_WIDTH -
                this.width
            )
        );

        this.y = Math.max(
            0,
            Math.min(
                this.y,
                GAME_CONFIG.WORLD_HEIGHT -
                this.height
            )
        );
    }

    takeDamage(amount, attacker = null) {
        if (this.hitCooldown > 0) {
            return;
        }

        this.health -= amount;
        this.health = Math.max(
            0,
            this.health
        );

        this.hitCooldown = 0.12;
        this.hitFlashTimer = 0.12;

        if (attacker) {
            this.applyKnockback(attacker);
        }
    }

    applyKnockback(attacker) {
        const attackerCenterX =
            attacker.x +
            attacker.width / 2;

        const attackerCenterY =
            attacker.y +
            attacker.height / 2;

        const enemyCenterX =
            this.x +
            this.width / 2;

        const enemyCenterY =
            this.y +
            this.height / 2;

        let directionX =
            enemyCenterX -
            attackerCenterX;

        let directionY =
            enemyCenterY -
            attackerCenterY;

        const distance = Math.sqrt(
            directionX * directionX +
            directionY * directionY
        );

        if (distance === 0) {
            return;
        }

        directionX /= distance;
        directionY /= distance;

        const force = 180;

        this.knockbackX =
            directionX * force;

        this.knockbackY =
            directionY * force;

        this.knockbackTimer = 0.12;
    }

    isHitFlashing() {
        return this.hitFlashTimer > 0;
    }

    isDead() {
        return this.health <= 0;
    }
}