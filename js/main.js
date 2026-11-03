
import Game from "./core/Game.js";

const canvas = document.getElementById("game-canvas");

if (!canvas) {
    throw new Error("Game canvas could not be found.");
}

const game = new Game(canvas);

game.start();
