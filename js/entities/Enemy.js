import Entity from "./Entity.js";
import { GAME_CONFIG } from "../utils/Constants.js";

export default class Enemy extends Entity {
    constructor(x, y, type = "chaser") {
        super(x, y, 22, 22);

        this.type = type;

        this.speed = 70;
        this.maxHealth = 3;
        this.damage = 1;
        this.preferredDistance = 30;
        this.separationStrength = 45;

        if (type === "fast") {
            this.speed = 110;
            this.maxHealth = 2;
            this.damage = 1;
            this.preferredDistance = 36;
            this.separationStrength = 65;
        }

        if (type === "tank") {
            this.speed = 45;
            this.maxHealth = 6;
            this.damage = 2;
            this.preferredDistance = 42;
            this.separationStrength = 30;
            this.width = 28;
            this.height = 28;
        }

        this.health = this.maxHealth;

        this.hitCooldown = 0;
        this.hitFlashTimer = 0;

        this.knockbackTimer = 0;
        this.knockbackX = 0;
        this.knockbackY = 0;

        this.deathTimer = 0;
        this.deathDuration = 0.25;
        this.dead = false;
    }

    update(deltaTime, player, tileMap, enemies = []) {
        if (this.dead) {
            this.deathTimer -= deltaTime;
            return;
        }

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

        let directionX = 0;
        let directionY = 0;

        if (distance > this.preferredDistance) {
            directionX =
                horizontal /
                distance;

            directionY =
                vertical /
                distance;
        }

        const separation =
            this.getSeparation(
                enemies
            );

        directionX += separation.x;
        directionY += separation.y;

        const directionLength =
            Math.sqrt(
                directionX * directionX +
                directionY * directionY
            );

        if (directionLength > 0) {
            directionX /=
                directionLength;

            directionY /=
                directionLength;
        }

        if (
            distance <=
            this.preferredDistance &&
            Math.abs(separation.x) < 0.01 &&
            Math.abs(separation.y) < 0.01
        ) {
            this.velocityX = 0;
            this.velocityY = 0;
            return;
        }

        this.velocityX =
            directionX *
            this.speed;

        this.velocityY =
            directionY *
            this.speed;

        this.moveHorizontal(
            deltaTime,
            tileMap
        );

        this.moveVertical(
            deltaTime,
            tileMap
        );
    }

    getSeparation(enemies) {
        let forceX = 0;
        let forceY = 0;

        for (const other of enemies) {
            if (
                other === this ||
                other.dead
            ) {
                continue;
            }

            const thisCenterX =
                this.x +
                this.width / 2;

            const thisCenterY =
                this.y +
                this.height / 2;

            const otherCenterX =
                other.x +
                other.width / 2;

            const otherCenterY =
                other.y +
                other.height / 2;

            let distanceX =
                thisCenterX -
                otherCenterX;

            let distanceY =
                thisCenterY -
                otherCenterY;

            const distance = Math.sqrt(
                distanceX * distanceX +
                distanceY * distanceY
            );

            const minimumDistance =
                (this.width +
                other.width) / 2 +
                8;

            if (
                distance === 0 ||
                distance >= minimumDistance
            ) {
                continue;
            }

            distanceX /= distance;
            distanceY /= distance;

            const strength =
                1 -
                distance /
                minimumDistance;

            forceX +=
                distanceX *
                strength *
                this.separationStrength /
                100;

            forceY +=
                distanceY *
                strength *
                this.separationStrength /
                100;
        }

        return {
            x: forceX,
            y: forceY
        };
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
        if (
            this.hitCooldown > 0 ||
            this.dead
        ) {
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

        if (this.health <= 0) {
            this.startDeath();
        }
    }

    startDeath() {
        this.dead = true;
        this.deathTimer = this.deathDuration;
        this.knockbackTimer = 0;
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

        let force = 180;

        if (this.type === "tank") {
            force = 120;
        }

        if (this.type === "fast") {
            force = 210;
        }

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
        return this.dead &&
            this.deathTimer <= 0;
    }

    isDying() {
        return this.dead;
    }

    getDeathProgress() {
        if (!this.dead) {
            return 0;
        }

        return Math.max(
            0,
            this.deathTimer /
            this.deathDuration
        );
    }
}
