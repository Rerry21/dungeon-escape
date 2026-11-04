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
    }

    drawLighting(player, radius = 190) {
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
                20,
                centerX,
                centerY,
                radius
            );

        gradient.addColorStop(
            0,
            "rgba(0, 0, 0, 0)"
        );

        gradient.addColorStop(
            0.55,
            "rgba(0, 0, 0, 0.15)"
        );

        gradient.addColorStop(
            1,
            "rgba(0, 0, 0, 0.75)"
        );

        ctx.fillStyle = gradient;

        ctx.fillRect(
            player.x - radius,
            player.y - radius,
            radius * 2,
            radius * 2
        );
    }

    drawHUD(player) {
        const ctx = this.ctx;

        ctx.fillStyle =
            "rgba(16, 16, 20, 0.85)";

        ctx.fillRect(
            20,
            20,
            180,
            60
        );

        ctx.fillStyle = "#d6a84f";

        ctx.font =
            "bold 18px monospace";

        ctx.fillText(
            "DUNGEON ESCAPE",
            32,
            45
        );

        ctx.fillStyle = "#f1eee6";

        ctx.font =
            "14px monospace";

        ctx.fillText(
            "FLOOR 01",
            32,
            66
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

    drawVictory() {
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

        ctx.fillStyle = "#d6a84f";

        ctx.font =
            "bold 40px monospace";

        ctx.fillText(
            "DUNGEON CLEARED",
            ctx.canvas.width / 2,
            230
        );

        ctx.fillStyle = "#f1eee6";

        ctx.font =
            "18px monospace";

        ctx.fillText(
            "PRESS ENTER TO PLAY AGAIN",
            ctx.canvas.width / 2,
            280
        );

        ctx.textAlign = "left";
    }

    drawGameOver() {
        const ctx = this.ctx;

        ctx.fillStyle = "#101014";

        ctx.fillRect(
            0,
            0,
            ctx.canvas.width,
            ctx.canvas.height
        );

        ctx.textAlign = "center";

        ctx.fillStyle = "#f1eee6";

        ctx.font =
            "bold 40px monospace";

        ctx.fillText(
            "GAME OVER",
            ctx.canvas.width / 2,
            230
        );

        ctx.font =
            "18px monospace";

        ctx.fillText(
            "PRESS ENTER TO TRY AGAIN",
            ctx.canvas.width / 2,
            280
        );

        ctx.textAlign = "left";
    }
}