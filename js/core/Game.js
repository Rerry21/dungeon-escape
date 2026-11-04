import {
    GAME_CONFIG,
    GAME_STATES,
    COLORS
} from "../utils/Constants.js";

import StateManager from "./StateManager.js";
import Input from "./Input.js";
import GameLoop from "./GameLoop.js";
import Camera from "./Camera.js";
import Player from "../entities/Player.js";
import Renderer from "../rendering/Renderer.js";
import TileMap from "../world/TileMap.js";

export default class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.canvas.width =
            GAME_CONFIG.WIDTH;

        this.canvas.height =
            GAME_CONFIG.HEIGHT;

        this.ctx.imageSmoothingEnabled =
            false;

        this.stateManager =
            new StateManager(
                GAME_STATES.MENU
            );

        this.input =
            new Input();

        this.camera =
            new Camera(
                GAME_CONFIG.WORLD_WIDTH,
                GAME_CONFIG.WORLD_HEIGHT
            );

        this.tileMap =
            new TileMap(
                GAME_CONFIG.WORLD_WIDTH,
                GAME_CONFIG.WORLD_HEIGHT
            );

        const spawn =
            this.tileMap.getSpawnPoint();

        this.player =
            new Player(
                spawn.x,
                spawn.y
            );

        this.renderer =
            new Renderer(
                this.ctx
            );

        this.loop =
            new GameLoop(
                (deltaTime) =>
                    this.update(
                        deltaTime
                    ),
                () =>
                    this.render()
            );
    }

    start() {
        this.loop.start();
    }

    startGame() {
        this.tileMap.generate();

        const spawn =
            this.tileMap.getSpawnPoint();

        this.player.reset(
            spawn.x,
            spawn.y
        );

        this.camera.snapTo(
            this.player
        );

        this.stateManager.changeState(
            GAME_STATES.PLAYING
        );
    }

    update(deltaTime) {
        const state =
            this.stateManager
                .getState();

        if (
            this.input.isPressed(
                "Escape"
            )
        ) {
            if (
                state ===
                GAME_STATES.PLAYING
            ) {
                this.stateManager
                    .changeState(
                        GAME_STATES.PAUSED
                    );
            } else if (
                state ===
                GAME_STATES.PAUSED
            ) {
                this.stateManager
                    .changeState(
                        GAME_STATES.PLAYING
                    );
            }
        }

        if (
            this.input.isPressed(
                "Enter"
            )
        ) {
            if (
                state ===
                GAME_STATES.MENU
            ) {
                this.startGame();
            } else if (
                state ===
                GAME_STATES.PAUSED
            ) {
                this.stateManager
                    .changeState(
                        GAME_STATES.MENU
                    );
            }
        }

        if (
            state ===
            GAME_STATES.PLAYING
        ) {
            this.updateGame(
                deltaTime
            );
        }

        this.input.endFrame();
    }

    updateGame(deltaTime) {
        this.player.update(
            deltaTime,
            this.input,
            this.tileMap
        );

        this.camera.follow(
            this.player,
            deltaTime
        );
    }

    render() {
        this.renderer.clear();

        const state =
            this.stateManager
                .getState();

        if (
            state ===
            GAME_STATES.MENU
        ) {
            this.drawMenu();
        } else if (
            state ===
            GAME_STATES.PLAYING
        ) {
            this.drawPlaying();
        } else if (
            state ===
            GAME_STATES.PAUSED
        ) {
            this.drawPlaying();
            this.drawPauseMenu();
        }
    }

    drawMenu() {
        const ctx =
            this.ctx;

        ctx.fillStyle =
            "#141419";

        ctx.fillRect(
            0,
            0,
            GAME_CONFIG.WIDTH,
            GAME_CONFIG.HEIGHT
        );

        ctx.textAlign =
            "center";

        ctx.fillStyle =
            COLORS.PRIMARY;

        ctx.font =
            "bold 54px Georgia";

        ctx.fillText(
            "DUNGEON ESCAPE",
            480,
            210
        );

        ctx.fillStyle =
            COLORS.TEXT;

        ctx.font =
            "20px Arial";

        ctx.fillText(
            "A journey into the unknown",
            480,
            255
        );

        ctx.fillStyle =
            COLORS.PRIMARY;

        ctx.font =
            "bold 22px Arial";

        ctx.fillText(
            "PRESS ENTER TO START",
            480,
            355
        );

        ctx.fillStyle =
            COLORS.SECONDARY;

        ctx.font =
            "15px Arial";

        ctx.fillText(
            "WASD / ARROW KEYS TO MOVE",
            480,
            420
        );

        ctx.fillText(
            "ESC TO PAUSE",
            480,
            445
        );
    }

    drawPlaying() {
        this.camera.apply(
            this.ctx
        );

        this.tileMap.draw(
            this.ctx
        );

        this.renderer.drawPlayer(
            this.player
        );

        this.renderer.drawLighting(
            this.player
        );

        this.camera.reset(
            this.ctx
        );

        this.renderer.drawHUD(
            this.player
        );
    }

    drawPauseMenu() {
        const ctx =
            this.ctx;

        ctx.fillStyle =
            "rgba(0, 0, 0, 0.78)";

        ctx.fillRect(
            0,
            0,
            GAME_CONFIG.WIDTH,
            GAME_CONFIG.HEIGHT
        );

        ctx.textAlign =
            "center";

        ctx.fillStyle =
            COLORS.PRIMARY;

        ctx.font =
            "bold 48px Georgia";

        ctx.fillText(
            "PAUSED",
            480,
            245
        );

        ctx.fillStyle =
            COLORS.TEXT;

        ctx.font =
            "18px Arial";

        ctx.fillText(
            "ESC - Resume",
            480,
            310
        );

        ctx.fillText(
            "ENTER - Main Menu",
            480,
            345
        );
    }
}