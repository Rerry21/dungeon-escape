import { GAME_CONFIG, COLORS } from "../utils/Constants.js";

export default class Renderer {
    constructor(ctx) {
        this.ctx = ctx;
    }

    clear() {
        this.ctx.fillStyle = COLORS.BACKGROUND;
        this.ctx.fillRect(
            0,
            0,
            GAME_CONFIG.WIDTH,
            GAME_CONFIG.HEIGHT
        );
    }

    drawPlayer(player) {
        const ctx = this.ctx;

        const x = Math.floor(player.x);
        const y = Math.floor(player.y);

        ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
        ctx.fillRect(
            x + 3,
            y + 21,
            18,
            5
        );

        ctx.fillStyle = "#8f6338";
        ctx.fillRect(
            x + 4,
            y + 3,
            16,
            8
        );

        ctx.fillStyle = "#c58a4a";
        ctx.fillRect(
            x + 3,
            y + 10,
            18,
            11
        );

        ctx.fillStyle = "#e0aa62";
        ctx.fillRect(
            x + 5,
            y + 11,
            14,
            8
        );

        ctx.fillStyle = "#15151a";

        if (player.direction === "left") {
            ctx.fillRect(
                x + 4,
                y + 13,
                3,
                3
            );
        } else if (player.direction === "right") {
            ctx.fillRect(
                x + 17,
                y + 13,
                3,
                3
            );
        } else if (player.direction === "up") {
            ctx.fillRect(
                x + 7,
                y + 6,
                3,
                3
            );

            ctx.fillRect(
                x + 14,
                y + 6,
                3,
                3
            );
        } else {
            ctx.fillRect(
                x + 7,
                y + 13,
                3,
                3
            );

            ctx.fillRect(
                x + 14,
                y + 13,
                3,
                3
            );
        }

        ctx.fillStyle = "#5d3d28";

        ctx.fillRect(
            x + 5,
            y + 21,
            5,
            3
        );

        ctx.fillRect(
            x + 14,
            y + 21,
            5,
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
                30,
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
            0.8,
            "rgba(0, 0, 0, 0.5)"
        );

        gradient.addColorStop(
            1,
            "rgba(0, 0, 0, 0.9)"
        );

        ctx.fillStyle = gradient;

        ctx.fillRect(
            centerX - radius,
            centerY - radius,
            radius * 2,
            radius * 2
        );
    }

    drawHUD(player) {
        const ctx = this.ctx;

        ctx.fillStyle =
            "rgba(12, 12, 16, 0.92)";

        ctx.fillRect(
            16,
            16,
            250,
            68
        );

        ctx.strokeStyle = "#4b4b56";
        ctx.lineWidth = 2;

        ctx.strokeRect(
            16,
            16,
            250,
            68
        );

        ctx.fillStyle = COLORS.PRIMARY;
        ctx.font = "bold 15px Arial";
        ctx.textAlign = "left";

        ctx.fillText(
            "DUNGEON ESCAPE",
            30,
            38
        );

        ctx.fillStyle = "#8d8d98";
        ctx.font = "12px Arial";

        ctx.fillText(
            "FLOOR 01",
            30,
            57
        );

        ctx.fillStyle = "#d6a84f";
        ctx.font = "bold 12px Arial";

        ctx.fillText(
            "HP",
            140,
            35
        );

        ctx.fillStyle = "#d64b4b";

        for (let i = 0; i < 3; i++) {
            const x = 140 + i * 28;

            ctx.beginPath();

            ctx.moveTo(x, 51);
            ctx.lineTo(x + 7, 44);
            ctx.lineTo(x + 14, 51);
            ctx.lineTo(x + 7, 63);

            ctx.closePath();
            ctx.fill();
        }
    }
}