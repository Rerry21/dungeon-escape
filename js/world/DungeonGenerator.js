export default class DungeonGenerator {
    constructor(columns, rows) {
        this.columns = columns;
        this.rows = rows;
        this.rooms = [];
    }

    generate() {
        const tiles = Array.from(
            { length: this.rows },
            () => Array(this.columns).fill(1)
        );

        this.rooms = [];

        const roomCount = 12;
        const minRoomWidth = 6;
        const maxRoomWidth = 11;
        const minRoomHeight = 5;
        const maxRoomHeight = 8;

        let attempts = 0;

        while (
            this.rooms.length < roomCount &&
            attempts < 300
        ) {
            attempts++;

            const width = this.randomInt(
                minRoomWidth,
                maxRoomWidth
            );

            const height = this.randomInt(
                minRoomHeight,
                maxRoomHeight
            );

            const x = this.randomInt(
                2,
                this.columns - width - 2
            );

            const y = this.randomInt(
                2,
                this.rows - height - 2
            );

            const room = {
                x,
                y,
                width,
                height,
                centerX: x + Math.floor(width / 2),
                centerY: y + Math.floor(height / 2)
            };

            if (this.overlapsExistingRoom(room)) {
                continue;
            }

            this.rooms.push(room);
            this.carveRoom(tiles, room);
        }

        this.rooms.sort((a, b) => {
            if (a.y === b.y) {
                return a.x - b.x;
            }

            return a.y - b.y;
        });

        if (this.rooms.length > 0) {
            this.rooms[0].type = "start";
            this.rooms[this.rooms.length - 1].type = "exit";
        }

        this.connectRooms(tiles);

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
        for (let i = 1; i < this.rooms.length; i++) {
            const previous = this.rooms[i - 1];
            const current = this.rooms[i];

            if (Math.random() < 0.5) {
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
        const direction = startX < endX ? 1 : -1;

        for (
            let x = startX;
            x !== endX + direction;
            x += direction
        ) {
            for (let offset = -1; offset <= 1; offset++) {
                const row = y + offset;

                if (
                    row >= 0 &&
                    row < this.rows &&
                    x >= 0 &&
                    x < this.columns
                ) {
                    tiles[row][x] = 0;
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
        const direction = startY < endY ? 1 : -1;

        for (
            let y = startY;
            y !== endY + direction;
            y += direction
        ) {
            for (let offset = -1; offset <= 1; offset++) {
                const column = x + offset;

                if (
                    y >= 0 &&
                    y < this.rows &&
                    column >= 0 &&
                    column < this.columns
                ) {
                    tiles[y][column] = 0;
                }
            }
        }
    }

    overlapsExistingRoom(room) {
        const padding = 2;

        return this.rooms.some(existing =>
            room.x - padding < existing.x + existing.width &&
            room.x + room.width + padding > existing.x &&
            room.y - padding < existing.y + existing.height &&
            room.y + room.height + padding > existing.y
        );
    }

    randomInt(min, max) {
        return Math.floor(
            Math.random() * (max - min + 1)
        ) + min;
    }
}