import { GAME_CONFIG, GAME_STATES, COLORS } from "../utils/Constants.js";
import StateManager from "./StateManager.js";
import Input from "./Input.js";
import GameLoop from "./GameLoop.js";
import Camera from "./Camera.js";

export default class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.canvas.width = GAME_CONFIG.WIDTH;
        this.canvas.height = GAME_CONFIG.HEIGHT;

        this.ctx.imageSmoothingEnabled = false;

        this.stateManager = new StateManager(GAME_STATES.MENU);
        this.input = new Input();
        this.camera = new Camera();

        this.loop = new GameLoop(
            (deltaTime) => this.update(deltaTime),
            () => this.render()
        );
    }

    start() {
        this.loop.start();
    }

    update(deltaTime) {
        const state = this.stateManager.getState();

        if (this.input.isPressed("Escape")) {
            if (state === GAME_STATES.PLAYING) {
                this.stateManager.changeState(GAME_STATES.PAUSED);
            } else if (state === GAME_STATES.PAUSED) {
                this.stateManager.changeState(GAME_STATES.PLAYING);
            }
        }

        if (this.input.isPressed("Enter")) {
            if (state === GAME_STATES.MENU) {
                this.stateManager.changeState(GAME_STATES.PLAYING);
            } else if (state === GAME_STATES.PAUSED) {
                this.stateManager.changeState(GAME_STATES.MENU);
            }
        }

        if (this.stateManager.is(GAME_STATES.PLAYING)) {
            this.updateGame(deltaTime);
        }

        this.input.endFrame();
    }

    updateGame(deltaTime) {
    }

    render() {
        const ctx = this.ctx;

        ctx.fillStyle = COLORS.BACKGROUND;
        ctx.fillRect(0, 0, GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT);

        this.drawBackground();

        const state = this.stateManager.getState();

        if (state === GAME_STATES.MENU) {
            this.drawMenu();
        } else if (state === GAME_STATES.PLAYING) {
            this.drawPlaying();
        } else if (state === GAME_STATES.PAUSED) {
            this.drawPlaying();
            this.drawPauseMenu();
        }
    }

    drawBackground() {
        const ctx = this.ctx;

        ctx.fillStyle = "#1d1d25";
        ctx.fillRect(0, 0, GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT);

        ctx.fillStyle = "#292933";

        for (let x = 0; x < GAME_CONFIG.WIDTH; x += 48) {
            ctx.fillRect(x, 0, 1, GAME_CONFIG.HEIGHT);
        }

        for (let y = 0; y < GAME_CONFIG.HEIGHT; y += 48) {
            ctx.fillRect(0, y, GAME_CONFIG.WIDTH, 1);
        }
    }

    drawMenu() {
        const ctx = this.ctx;

        ctx.textAlign = "center";

        ctx.fillStyle = COLORS.PRIMARY;
        ctx.font = "bold 54px Georgia";
        ctx.fillText("DUNGEON ESCAPE", 480, 210);

        ctx.fillStyle = COLORS.TEXT;
        ctx.font = "20px Arial";
        ctx.fillText("A journey into the unknown", 480, 255);

        ctx.fillStyle = COLORS.PRIMARY;
        ctx.font = "bold 22px Arial";
        ctx.fillText("PRESS ENTER TO START", 480, 355);

        ctx.fillStyle = COLORS.SECONDARY;
        ctx.font = "15px Arial";
        ctx.fillText("WASD / ARROW KEYS TO MOVE", 480, 420);
        ctx.fillText("ESC TO PAUSE", 480, 445);
    }

    drawPlaying() {
        const ctx = this.ctx;

        ctx.textAlign = "center";
        ctx.fillStyle = COLORS.PRIMARY;
        ctx.font = "bold 32px Georgia";
        ctx.fillText("DUNGEON INITIALIZED", 480, 245);

        ctx.fillStyle = COLORS.TEXT;
        ctx.font = "18px Arial";
        ctx.fillText("Your adventure is about to begin.", 480, 290);

        ctx.fillStyle = COLORS.SECONDARY;
        ctx.font = "15px Arial";
        ctx.fillText("Dungeon environment coming in Phase 2", 480, 340);
    }

    drawPauseMenu() {
        const ctx = this.ctx;

        ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
        ctx.fillRect(0, 0, GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT);

        ctx.textAlign = "center";

        ctx.fillStyle = COLORS.PRIMARY;
        ctx.font = "bold 48px Georgia";
        ctx.fillText("PAUSED", 480, 245);

        ctx.fillStyle = COLORS.TEXT;
        ctx.font = "18px Arial";
        ctx.fillText("ESC - Resume", 480, 310);
        ctx.fillText("ENTER - Main Menu", 480, 345);
    }
}