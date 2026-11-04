import { GAME_CONFIG } from "../utils/Constants.js";

export default class DungeonGenerator {
    constructor(columns, rows) {
        this.columns = columns;
        this.rows = rows;
        this.rooms = [];
        this.seed = Math.floor(Math.random() * 999999);
    }

    generate() {
        const tiles = Array.from(
            { length: this.rows },
            () => Array(this.columns).fill(1)
        );

        this.rooms = [];

        const roomCount = 12;
        const minRoomWidth = 6;
        const maxRoomWidth = 12;
        const minRoomHeight = 5;
        const maxRoomHeight = 9;

        let attempts = 0;

        while (
            this.rooms.length < roomCount &&
            attempts < 200
        ) {
            attempts++;

            const width =
                this.randomInt(
                    minRoomWidth,
                    maxRoomWidth
                );

            const height =
                this.randomInt(
                    minRoomHeight,
                    maxRoomHeight
                );

            const x =
                this.randomInt(
                    1,
                    this.columns - width - 1
                );

            const y =
                this.randomInt(
                    1,
                    this.rows - height - 1
                );

            const room = {
                x,
                y,
                width,
                height,
                centerX:
                    x + Math.floor(width / 2),
                centerY:
                    y + Math.floor(height / 2)
            };

            if (this.overlapsExistingRoom(room)) {
                continue;
            }

            this.rooms.push(room);

            this.carveRoom(
                tiles,
                room
            );
        }

        this.connectRooms(
            tiles
        );

        return {
            tiles,
            rooms: this.rooms
        };
    }

    carveRoom(tiles, room) {
        for (
            let y = room.y;
            y < room.y + room.height;
            y++
        ) {
            for (
                let x = room.x;
                x < room.x + room.width;
                x++
            ) {
                tiles[y][x] = 0;
            }
        }
    }

    connectRooms(tiles) {
        for (
            let i = 1;
            i < this.rooms.length;
            i++
        ) {
            const previous =
                this.rooms[i - 1];

            const current =
                this.rooms[i];

            if (
                Math.random() < 0.5
            ) {
                this.carveHorizontalCorridor(
                    tiles,
                    previous.centerX,
                    current.centerX,
                    previous.centerY
                );

                this.carveVerticalCorridor(
                    tiles,
                    previous.centerY,
                    current.centerY,
                    current.centerX
                );
            } else {
                this.carveVerticalCorridor(
                    tiles,
                    previous.centerY,
                    current.centerY,
                    previous.centerX
                );

                this.carveHorizontalCorridor(
                    tiles,
                    previous.centerX,
                    current.centerX,
                    current.centerY
                );
            }
        }
    }

    carveHorizontalCorridor(
        tiles,
        startX,
        endX,
        y
    ) {
        const direction =
            startX < endX ? 1 : -1;

        for (
            let x = startX;
            x !== endX + direction;
            x += direction
        ) {
            for (
                let offset = -1;
                offset <= 1;
                offset++
            ) {
                if (
                    tiles[y + offset] &&
                    tiles[y + offset][x] !== undefined
                ) {
                    tiles[y + offset][x] = 0;
                }
            }
        }
    }

    carveVerticalCorridor(
        tiles,
        startY,
        endY,
        x
    ) {
        const direction =
            startY < endY ? 1 : -1;

        for (
            let y = startY;
            y !== endY + direction;
            y += direction
        ) {
            for (
                let offset = -1;
                offset <= 1;
                offset++
            ) {
                if (
                    tiles[y] &&
                    tiles[y][x + offset] !== undefined
                ) {
                    tiles[y][x + offset] = 0;
                }
            }
        }
    }

    overlapsExistingRoom(room) {
        const padding = 1;

        return this.rooms.some(
            (existing) =>
                room.x - padding <
                    existing.x +
                    existing.width &&
                room.x +
                    room.width +
                    padding >
                    existing.x &&
                room.y - padding <
                    existing.y +
                    existing.height &&
                room.y +
                    room.height +
                    padding >
                    existing.y
        );
    }

    randomInt(min, max) {
        return Math.floor(
            Math.random() *
                (max - min + 1)
        ) + min;
    }
}