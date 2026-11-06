import StateManager from "./StateManager.js";
import Input from "./Input.js";
import GameLoop from "./GameLoop.js";
import Camera from "./Camera.js";
import Renderer from "../rendering/Renderer.js";
import Player from "../entities/Player.js";
import Enemy from "../entities/Enemy.js";
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

        this.enemies = [];
        this.exitUnlocked = false;

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

        const spawn =
            this.tileMap.getSpawnPoint();

        this.player.reset(
            spawn.x,
            spawn.y
        );

        this.spawnEnemies();

        this.exitUnlocked = false;

        this.camera.snapTo(
            this.player
        );

        this.stateManager.setState(
            GAME_STATES.PLAYING
        );
    }

    spawnEnemies() {
        this.enemies = [];

        const rooms = this.tileMap.rooms;

        for (
            let i = 1;
            i < rooms.length - 1;
            i++
        ) {
            if (this.enemies.length >= 6) {
                break;
            }

            const room = rooms[i];

            const x =
                room.centerX *
                GAME_CONFIG.TILE_SIZE +
                GAME_CONFIG.TILE_SIZE / 2 -
                11;

            const y =
                room.centerY *
                GAME_CONFIG.TILE_SIZE +
                GAME_CONFIG.TILE_SIZE / 2 -
                11;

            this.enemies.push(
                new Enemy(x, y)
            );
        }
    }

    update(deltaTime) {
        const state =
            this.stateManager.getState();

        if (state === GAME_STATES.MENU) {
            if (
                this.input.isPressed("Enter")
            ) {
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

            for (const enemy of this.enemies) {
                enemy.update(
                    deltaTime,
                    this.player,
                    this.tileMap
                );
            }

            this.handlePlayerAttacks();
            this.handleEnemyDamage();

            this.enemies =
                this.enemies.filter(
                    enemy => !enemy.isDead()
                );

            if (
                this.enemies.length === 0
            ) {
                this.exitUnlocked = true;
            }

            this.camera.follow(
                this.player,
                deltaTime
            );

            if (this.player.isDead()) {
                this.stateManager.setState(
                    GAME_STATES.GAME_OVER
                );

                return;
            }

            if (
                this.exitUnlocked &&
                this.tileMap.isPlayerAtExit(
                    this.player
                )
            ) {
                this.stateManager.setState(
                    GAME_STATES.VICTORY
                );
            }

            return;
        }

        if (state === GAME_STATES.VICTORY) {
            if (
                this.input.isPressed("Enter")
            ) {
                this.startGame();
            }

            return;
        }

        if (state === GAME_STATES.PAUSED) {
            if (
                this.input.isPressed("Escape")
            ) {
                this.stateManager.setState(
                    GAME_STATES.PLAYING
                );
            }

            return;
        }

        if (state === GAME_STATES.GAME_OVER) {
            if (
                this.input.isPressed("Enter")
            ) {
                this.startGame();
            }
        }
    }

    handlePlayerAttacks() {
        if (!this.player.isAttacking()) {
            return;
        }

        const hitbox =
            this.player.getAttackHitbox();

        for (const enemy of this.enemies) {
            if (
                this.intersects(
                    hitbox,
                    enemy
                )
            ) {
                enemy.takeDamage(
                    1,
                    this.player
                );
            }
        }
    }

    handleEnemyDamage() {
        if (this.player.isInvulnerable()) {
            return;
        }

        for (const enemy of this.enemies) {
            if (
                enemy.isDying()
            ) {
                continue;
            }

            if (
                this.intersects(
                    this.player,
                    enemy
                )
            ) {
                this.player.takeDamage(
                    enemy.damage
                );

                break;
            }
        }
    }

    intersects(a, b) {
        return (
            a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
        );
    }

    draw() {
        this.renderer.clear();

        const state =
            this.stateManager.getState();

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
            this.drawPlaying();
            this.renderer.drawGameOver();
        }
    }

    drawPlaying() {
        this.camera.apply(this.ctx);

        this.tileMap.draw(
            this.ctx,
            this.exitUnlocked
        );

        for (const enemy of this.enemies) {
            this.renderer.drawEnemy(
                enemy
            );
        }

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
            this.player,
            this.enemies.length,
            this.exitUnlocked
        );
    }
}