
export default class Input {
    constructor() {
        this.keys = new Set();
        this.pressedKeys = new Set();

        window.addEventListener("keydown", (event) => {
            if (!this.keys.has(event.code)) {
                this.pressedKeys.add(event.code);
            }

            this.keys.add(event.code);

            if (
                [
                    "ArrowUp",
                    "ArrowDown",
                    "ArrowLeft",
                    "ArrowRight",
                    "Space"
                ].includes(event.code)
            ) {
                event.preventDefault();
            }
        });

        window.addEventListener("keyup", (event) => {
            this.keys.delete(event.code);
        });

        window.addEventListener("blur", () => {
            this.keys.clear();
            this.pressedKeys.clear();
        });
    }

    isDown(key) {
        return this.keys.has(key);
    }

    isPressed(key) {
        return this.pressedKeys.has(key);
    }

    isAnyDown(keys) {
        return keys.some(key => this.isDown(key));
    }

    endFrame() {
        this.pressedKeys.clear();
    }
}
