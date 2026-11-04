
import { GAME_STATES } from "../utils/Constants.js";

export default class StateManager {
    constructor(initialState = GAME_STATES.MENU) {
        this.currentState = initialState;
        this.previousState = null;
    }

    setState(newState) {
        if (this.currentState === newState) {
            return;
        }

        this.previousState = this.currentState;
        this.currentState = newState;
    }

    getState() {
        return this.currentState;
    }

    is(state) {
        return this.currentState === state;
    }
}
