
export default class StateManager {
    constructor(initialState) {
        this.currentState = initialState;
        this.previousState = null;
    }

    changeState(newState) {
        if (this.currentState === newState) return;

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
