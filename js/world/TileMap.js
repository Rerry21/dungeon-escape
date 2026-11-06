import DungeonGenerator from "./DungeonGenerator.js";
import { GAME_CONFIG } from "../utils/Constants.js";

export default class TileMap {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.tileSize = GAME_CONFIG.TILE_SIZE;

        this.columns = Math.floor(
            width / this.tileSize
        );

        this.rows = Math.floor(
            height / this.tileSize
        );

        this.tiles = [];
        this.rooms = [];
        this.startRoom = null;
        this.exitRoom = null;
    }

    generate() {
        const generator = new DungeonGenerator(
            this.columns,
            this.rows
        );

        const dungeon =
            generator.generate();

        this.tiles = dungeon.tiles;
        this.rooms = dungeon.rooms;

        this.startRoom =
            this.rooms.find(
                room => room.type === "start"
            ) || null;

        this.exitRoom =
            this.rooms.find(
                room => room.type === "exit"
            ) || null;
    }

    getTile(column, row) {
        if (
            row < 0 ||
            row >= this.rows ||
            column < 0 ||
            column >= this.columns
        ) {
            return 1;
        }

        return this.tiles[row][column];
    }

    isSolid(column, row) {
        return this.getTile(
            column,
            row
        ) === 1;
    }

    getTileAtPosition(x, y) {
        const column = Math.floor(
            x / this.tileSize
        );

        const row = Math.floor(
            y / this.tileSize
        );

        return this.getTile(
            column,
            row
        );
    }

    collides(entity) {
        const left = Math.floor(
            entity.x / this.tileSize
        );

        const right = Math.floor(
            (entity.x + entity.width - 1) /
            this.tileSize
        );

        const top = Math.floor(
            entity.y / this.tileSize
        );

        const bottom = Math.floor(
            (entity.y + entity.height - 1) /
            this.tileSize
        );

        for (
            let row = top;
            row <= bottom;
            row++
        ) {
            for (
                let column = left;
                column <= right;
                column++
            ) {
                if (
                    this.isSolid(
                        column,
                        row
                    )
                ) {
                    return true;
                }
            }
        }

        return false;
    }

    getSpawnPoint() {
        if (!this.startRoom) {
            return {
                x: this.width / 2,
                y: this.height / 2
            };
        }

        return {
            x:
                this.startRoom.centerX *
                this.tileSize +
                this.tileSize / 2 -
                12,

            y:
                this.startRoom.centerY *
                this.tileSize +
                this.tileSize / 2 -
                12
        };
    }

    getExitPoint() {
        if (!this.exitRoom) {
            return {
                x: this.width / 2,
                y: this.height / 2
            };
        }

        return {
            x:
                this.exitRoom.centerX *
                this.tileSize +
                this.tileSize / 2,

            y:
                this.exitRoom.centerY *
                this.tileSize +
                this.tileSize / 2
        };
    }

    isPlayerAtExit(player) {
        const exit =
            this.getExitPoint();

        const playerCenterX =
            player.x +
            player.width / 2;

        const playerCenterY =
            player.y +
            player.height / 2;

        const distanceX =
            playerCenterX -
            exit.x;

        const distanceY =
            playerCenterY -
            exit.y;

        const distance =
            Math.sqrt(
                distanceX * distanceX +
                distanceY * distanceY
            );

        return distance <
            this.tileSize * 0.8;
    }

    draw(ctx, exitUnlocked = false) {
        for (
            let row = 0;
            row < this.rows;
            row++
        ) {
            for (
                let column = 0;
                column < this.columns;
                column++
            ) {
                const x =
                    column *
                    this.tileSize;

                const y =
                    row *
                    this.tileSize;

                if (
                    this.tiles[row][column] === 1
                ) {
                    this.drawWall(
                        ctx,
                        x,
                        y
                    );
                } else {
                    this.drawFloor(
                        ctx,
                        x,
                        y
                    );
                }
            }
        }

        this.drawExit(
            ctx,
            exitUnlocked
        );
    }

    drawExit(ctx, unlocked) {
        const exit =
            this.getExitPoint();

        const size =
            this.tileSize;

        const x =
            exit.x -
            size / 2;

        const y =
            exit.y -
            size / 2;

        ctx.fillStyle =
            "#181824";

        ctx.fillRect(
            x + 4,
            y + 4,
            size - 8,
            size - 8
        );

        ctx.fillStyle =
            unlocked
                ? "#4caf50"
                : "#7c4dff";

        ctx.fillRect(
            x + 8,
            y + 5,
            size - 16,
            size - 10
        );

        ctx.fillStyle =
            unlocked
                ? "#b7ffbd"
                : "#b99aff";

        ctx.fillRect(
            x + 11,
            y + 8,
            size - 22,
            size - 16
        );

        ctx.fillStyle =
            "#ffffff";

        ctx.fillRect(
            x + 14,
            y + 11,
            4,
            10
        );
    }

    drawFloor(ctx, x, y) {
        const size =
            this.tileSize;

        ctx.fillStyle =
            "#24242b";

        ctx.fillRect(
            x,
            y,
            size,
            size
        );

        ctx.fillStyle =
            "#292930";

        ctx.fillRect(
            x + 1,
            y + 1,
            size - 2,
            2
        );

        ctx.fillStyle =
            "#1e1e24";

        ctx.fillRect(
            x + 1,
            y + size - 3,
            size - 2,
            2
        );
    }

    drawWall(ctx, x, y) {
        const size =
            this.tileSize;

        ctx.fillStyle =
            "#111116";

        ctx.fillRect(
            x,
            y,
            size,
            size
        );

        ctx.fillStyle =
            "#3b3b44";

        ctx.fillRect(
            x + 1,
            y + 1,
            size - 2,
            5
        );

        ctx.fillStyle =
            "#292930";

        ctx.fillRect(
            x + 2,
            y + 7,
            size - 4,
            size - 9
        );

        ctx.fillStyle =
            "#17171c";

        ctx.fillRect(
            x + 2,
            y + size - 4,
            size - 4,
            3
        );
    }
}