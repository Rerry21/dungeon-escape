export default class Renderer {
    constructor(ctx) {
        this.ctx = ctx;
    }

    clear() {
        this.ctx.fillStyle = "#101014";

        this.ctx.fillRect(
            0,
            0,
            this.ctx.canvas.width,
            this.ctx.canvas.height
        );
    }

    drawPlayer(player) {
        const ctx = this.ctx;

        const x = Math.floor(player.x);
        const y = Math.floor(player.y);

        if (
            player.isInvulnerable() &&
            Math.floor(
                player.damageCooldown * 12
            ) % 2 === 0
        ) {
            ctx.globalAlpha = 0.45;
        }

        ctx.fillStyle = "rgba(0, 0, 0, 0.35)";

        ctx.fillRect(
            x + 3,
            y + player.height - 2,
            player.width - 6,
            5
        );

        ctx.fillStyle = "#d6a84f";

        ctx.fillRect(
            x + 4,
            y + 2,
            player.width - 8,
            player.height - 4
        );

        ctx.fillStyle = "#f1eee6";

        ctx.fillRect(
            x + 7,
            y + 6,
            4,
            4
        );

        ctx.fillRect(
            x + player.width - 11,
            y + 6,
            4,
            4
        );

        ctx.fillStyle = "#8d6728";

        ctx.fillRect(
            x + 7,
            y + player.height - 6,
            player.width - 14,
            3
        );

        if (player.isAttacking()) {
            this.drawAttack(player);
        }

        ctx.globalAlpha = 1;
    }

    drawAttack(player) {
        const ctx = this.ctx;
        const hitbox =
            player.getAttackHitbox();

        ctx.fillStyle = "#f1eee6";

        if (
            player.direction === "left" ||
            player.direction === "right"
        ) {
            ctx.fillRect(
                hitbox.x,
                hitbox.y,
                hitbox.width,
                5
            );

            ctx.fillStyle = "#d6a84f";

            ctx.fillRect(
                hitbox.x,
                hitbox.y + 5,
                hitbox.width,
                4
            );

            return;
        }

        ctx.fillRect(
            hitbox.x,
            hitbox.y,
            hitbox.width,
            hitbox.height
        );

        ctx.fillStyle = "#d6a84f";

        if (player.direction === "up") {
            ctx.fillRect(
                hitbox.x + 4,
                hitbox.y + 5,
                hitbox.width - 8,
                hitbox.height
            );
        } else {
            ctx.fillRect(
                hitbox.x + 4,
                hitbox.y,
                hitbox.width - 8,
                hitbox.height - 5
            );
        }
    }

    drawEnemy(enemy) {
    const ctx = this.ctx;

    const x = Math.floor(enemy.x);
    const y = Math.floor(enemy.y);

    if (enemy.isDying()) {
        const progress =
            enemy.getDeathProgress();

        ctx.globalAlpha =
            progress;

        const scale =
            0.5 +
            progress * 0.5;

        const width =
            enemy.width * scale;

        const height =
            enemy.height * scale;

        const offsetX =
            (enemy.width - width) / 2;

        const offsetY =
            (enemy.height - height) / 2;

        ctx.fillStyle =
            enemy.type === "tank"
                ? "#9b6b32"
                : enemy.type === "fast"
                    ? "#3f8f63"
                    : "#8f3f48";

        ctx.fillRect(
            x + offsetX,
            y + offsetY,
            width,
            height
        );

        ctx.globalAlpha = 1;

        return;
    }

    ctx.fillStyle =
        "rgba(0, 0, 0, 0.35)";

    ctx.fillRect(
        x + 2,
        y + enemy.height - 1,
        enemy.width - 4,
        4
    );

    if (enemy.isHitFlashing()) {
        ctx.fillStyle =
            "#f1eee6";
    } else if (enemy.type === "tank") {
        ctx.fillStyle =
            "#9b6b32";
    } else if (enemy.type === "fast") {
        ctx.fillStyle =
            "#3f8f63";
    } else {
        ctx.fillStyle =
            "#8f3f48";
    }

    ctx.fillRect(
        x + 3,
        y + 3,
        enemy.width - 6,
        enemy.height - 6
    );

    ctx.fillStyle =
        enemy.type === "tank"
            ? "#d6a84f"
            : enemy.type === "fast"
                ? "#78d49a"
                : "#c96a6a";

    ctx.fillRect(
        x + 6,
        y + 6,
        4,
        4
    );

    ctx.fillRect(
        x + enemy.width - 10,
        y + 6,
        4,
        4
    );

    this.drawEnemyHealth(enemy);
}

    drawEnemyHealth(enemy) {
        const ctx = this.ctx;

        const width = 24;
        const height = 3;

        const x =
            enemy.x +
            enemy.width / 2 -
            width / 2;

        const y =
            enemy.y - 7;

        ctx.fillStyle = "#111116";

        ctx.fillRect(
            x,
            y,
            width,
            height
        );

        ctx.fillStyle = "#d65a5a";

        ctx.fillRect(
            x,
            y,
            width *
            (enemy.health /
            enemy.maxHealth),
            height
        );
    }

    drawLighting(player, radius = 300) {
        const ctx = this.ctx;

        const centerX =
            player.x +
            player.width / 2;

        const centerY =
            player.y +
            player.height / 2;

        const gradient =
            ctx.createRadialGradient(
                centerX,
                centerY,
                55,
                centerX,
                centerY,
                radius
            );

        gradient.addColorStop(
            0,
            "rgba(0, 0, 0, 0)"
        );

        gradient.addColorStop(
            0.45,
            "rgba(0, 0, 0, 0.03)"
        );

        gradient.addColorStop(
            0.7,
            "rgba(0, 0, 0, 0.12)"
        );

        gradient.addColorStop(
            0.85,
            "rgba(0, 0, 0, 0.28)"
        );

        gradient.addColorStop(
            1,
            "rgba(0, 0, 0, 0.55)"
        );

        ctx.fillStyle = gradient;

        ctx.fillRect(
            player.x - radius,
            player.y - radius,
            radius * 2,
            radius * 2
        );
    }

    drawHUD(
        player,
        enemiesRemaining = 0,
        exitUnlocked = false,
        floor = 1
    ) {
        const ctx = this.ctx;

        ctx.fillStyle =
            "rgba(16, 16, 20, 0.9)";

        ctx.fillRect(
            20,
            20,
            260,
            100
        );

        ctx.fillStyle =
            "#d6a84f";

        ctx.font =
            "bold 18px monospace";

        ctx.fillText(
            "DUNGEON ESCAPE",
            32,
            45
        );

        ctx.fillStyle =
            "#f1eee6";

        ctx.font =
            "14px monospace";

        ctx.fillText(
            `FLOOR ${String(floor).padStart(2, "0")}`,
            32,
            66
        );

        const barX = 32;
        const barY = 77;
        const barWidth = 180;
        const barHeight = 8;

        ctx.fillStyle =
            "#111116";

        ctx.fillRect(
            barX,
            barY,
            barWidth,
            barHeight
        );

        ctx.fillStyle =
            "#d65a5a";

        ctx.fillRect(
            barX,
            barY,
            barWidth *
            (player.health /
            player.maxHealth),
            barHeight
        );

        ctx.fillStyle =
            exitUnlocked
                ? "#4caf50"
                : "#f1eee6";

        ctx.font =
            "12px monospace";

        ctx.fillText(
            exitUnlocked
                ? "EXIT UNLOCKED"
                : `ENEMIES: ${enemiesRemaining}`,
            32,
            105
        );
    }

    drawMenu() {
        const ctx = this.ctx;

        ctx.fillStyle = "#101014";

        ctx.fillRect(
            0,
            0,
            ctx.canvas.width,
            ctx.canvas.height
        );

        ctx.textAlign = "center";

        ctx.fillStyle = "#d6a84f";

        ctx.font =
            "bold 48px monospace";

        ctx.fillText(
            "DUNGEON ESCAPE",
            ctx.canvas.width / 2,
            210
        );

        ctx.fillStyle = "#f1eee6";

        ctx.font =
            "18px monospace";

        ctx.fillText(
            "PRESS ENTER TO START",
            ctx.canvas.width / 2,
            280
        );

        ctx.textAlign = "left";
    }

    drawPause() {
        const ctx = this.ctx;

        ctx.fillStyle =
            "rgba(0, 0, 0, 0.65)";

        ctx.fillRect(
            0,
            0,
            ctx.canvas.width,
            ctx.canvas.height
        );

        ctx.textAlign = "center";

        ctx.fillStyle = "#f1eee6";

        ctx.font =
            "bold 32px monospace";

        ctx.fillText(
            "PAUSED",
            ctx.canvas.width / 2,
            ctx.canvas.height / 2
        );

        ctx.textAlign = "left";
    }

    drawVictory(floor = 1) {
        const ctx = this.ctx;

        ctx.fillStyle =
            "rgba(0, 0, 0, 0.7)";

        ctx.fillRect(
            0,
            0,
            ctx.canvas.width,
            ctx.canvas.height
        );

        ctx.textAlign = "center";

        ctx.fillStyle =
            "#4caf50";

        ctx.font =
            "bold 40px monospace";

        ctx.fillText(
            `FLOOR ${String(floor).padStart(2, "0")} CLEARED`,
            ctx.canvas.width / 2,
            230
        );

        ctx.fillStyle =
            "#f1eee6";

        ctx.font =
            "18px monospace";

        ctx.fillText(
            "PRESS ENTER FOR NEXT FLOOR",
            ctx.canvas.width / 2,
            280
        );

        ctx.textAlign = "left";
    }

    drawGameOver(floor = 1) {
        const ctx = this.ctx;

        ctx.fillStyle =
            "rgba(16, 16, 20, 0.85)";

        ctx.fillRect(
            0,
            0,
            ctx.canvas.width,
            ctx.canvas.height
        );

        ctx.textAlign = "center";

        ctx.fillStyle =
            "#d65a5a";

        ctx.font =
            "bold 40px monospace";

        ctx.fillText(
            "GAME OVER",
            ctx.canvas.width / 2,
            230
        );

        ctx.fillStyle =
            "#f1eee6";

        ctx.font =
            "18px monospace";

        ctx.fillText(
            `FLOOR ${String(floor).padStart(2, "0")}`,
            ctx.canvas.width / 2,
            265
        );

        ctx.fillText(
            "PRESS ENTER TO RETRY",
            ctx.canvas.width / 2,
            300
        );

        ctx.textAlign = "left";
    }
}