
import StateManager from "./StateManager.js";
import Input from "./Input.js";
import GameLoop from "./GameLoop.js";
import Camera from "./Camera.js";
import Renderer from "../rendering/Renderer.js";
import Player from "../entities/Player.js";
import TileMap from "../world/TileMap.js";
import { GAME_CONFIG, GAME_STATES } from "../utils/Constants.js";

export default class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.canvas.width = GAME_CONFIG.WIDTH;
        this.canvas.height = GAME_CONFIG.HEIGHT;

        this.stateManager = new StateManager();
        this.input = new Input();
        this.renderer = new Renderer(this.ctx);

        this.tileMap = new TileMap(
            GAME_CONFIG.WORLD_WIDTH,
            GAME_CONFIG.WORLD_HEIGHT
        );

        const spawn = this.tileMap.getSpawnPoint();

        this.player = new Player(
            spawn.x,
            spawn.y
        );

        this.camera = new Camera(
            GAME_CONFIG.WIDTH,
            GAME_CONFIG.HEIGHT,
            GAME_CONFIG.WORLD_WIDTH,
            GAME_CONFIG.WORLD_HEIGHT
        );

        this.camera.snapTo(this.player);

        this.loop = new GameLoop(
            deltaTime => {
                this.update(deltaTime);
                this.input.endFrame();
            },
            () => this.draw()
        );
    }

    start() {
        this.loop.start();
    }

    startGame() {
        this.tileMap.generate();

        const spawn = this.tileMap.getSpawnPoint();

        this.player.reset(
            spawn.x,
            spawn.y
        );

        this.camera.snapTo(this.player);

        this.stateManager.setState(
            GAME_STATES.PLAYING
        );
    }

    update(deltaTime) {
        const state = this.stateManager.getState();

        if (state === GAME_STATES.MENU) {
            if (this.input.isPressed("Enter")) {
                this.startGame();
            }

            return;
        }

        if (state === GAME_STATES.PLAYING) {
            this.player.update(
                deltaTime,
                this.input,
                this.tileMap
            );

            this.camera.follow(
                this.player,
                deltaTime
            );

            if (this.tileMap.isPlayerAtExit(this.player)) {
                this.stateManager.setState(
                    GAME_STATES.VICTORY
                );
            }

            return;
        }

        if (state === GAME_STATES.VICTORY) {
            if (this.input.isPressed("Enter")) {
                this.startGame();
            }

            return;
        }

        if (state === GAME_STATES.PAUSED) {
            if (this.input.isPressed("Escape")) {
                this.stateManager.setState(
                    GAME_STATES.PLAYING
                );
            }

            return;
        }

        if (state === GAME_STATES.GAME_OVER) {
            if (this.input.isPressed("Enter")) {
                this.startGame();
            }
        }
    }

    draw() {
        this.renderer.clear();

        const state = this.stateManager.getState();

        if (state === GAME_STATES.MENU) {
            this.renderer.drawMenu();
            return;
        }

        if (state === GAME_STATES.PLAYING) {
            this.drawPlaying();
            return;
        }

        if (state === GAME_STATES.VICTORY) {
            this.drawPlaying();
            this.renderer.drawVictory();
            return;
        }

        if (state === GAME_STATES.PAUSED) {
            this.drawPlaying();
            this.renderer.drawPause();
            return;
        }

        if (state === GAME_STATES.GAME_OVER) {
            this.renderer.drawGameOver();
        }
    }

    drawPlaying() {
        this.camera.apply(this.ctx);

        this.tileMap.draw(this.ctx);

        this.renderer.drawPlayer(this.player);

        this.renderer.drawLighting(this.player);

        this.camera.reset(this.ctx);

        this.renderer.drawHUD(this.player);
    }
}
