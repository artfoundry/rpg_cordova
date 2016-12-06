/**
 * Created by David on 11/29/16.
 *
 * Controller should set up turn loop that:
 * 1) sets up player listeners
 * 2) waits for player move
 * 3) tears down player listeners
 * 4) moves monsters
 * 5) returns to beginning
 */

class TurnController {
    constructor(grid, players, monsters) {
        this.grid = grid;
        this.players = players;
        this.monsters = monsters;
        this.events = new Events();
    }

    initalize() {
        this.events.setUpTileChangeListener('.tile', this.grid.updateTileImage);
        this.events.setUpLightChangeListener('.tile', this.grid.updateLightingImage);
        this.events.setUpClickListener('.tile', this.players.player1.movePlayer, this.players.player1, isMonsterTurn);
    }

    turnCycle() {

    }

    moveMonsters() {
        for (let monster in this.monsters) {
            if (Object.prototype.hasOwnProperty.call(this.monsters, monster))
                this.monsters[monster]._randomMove();
        }
    }
}