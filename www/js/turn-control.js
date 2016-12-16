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
        this.gameIsActive = true;
        this.isMonsterTurn = false;
    }

    initialize() {
        this.events.setUpTileChangeListener('.tile', this.grid.updateTileImage);
        this.events.setUpLightChangeListener('.tile', this.grid.updateLightingImage);
    }

    runTurnCycle() {
        if(this.gameIsActive) {
            if (this.isMonsterTurn) {
                this._tearDownListeners();
                this.moveMonsters();
                this.isMonsterTurn = false;
            }
            for (let player in this.players) {
                if (Object.prototype.hasOwnProperty.call(this.players, player))
                    this._setupListeners(this.players[player]);
            }
        }
    }

    endPlayerTurn() {
        this.isMonsterTurn = true;
        this.runTurnCycle();
    }


    /*
     * function _setupListeners
     *
     * Sets up click handlers through events class with these parameters:
     *
     * -target class
     * -function to take action
     * -function to take alternate action if click target is invalid
     * -player object
     * -callback function to run after player move action is finished
     */
    _setupListeners(player) {
        let actions = {
                "walkable" : player.movePlayer,
                "impassable" : player.jiggle,
                "monster" : player.attack
            },
            params = {
                "walkable" : {
                    "player" : player,
                    "callback" : this.endPlayerTurn.bind(this)
                },
                "impassable" : {
                    "player" : player
                },
                "monster" : {
                    "monsters" : this.monsters
                }
            };
        this.events.setUpClickListener('.tile', actions, params);
    }

    _tearDownListeners() {
        this.events.removeClickListener('.tile');
    }

    moveMonsters() {
        for (let monster in this.monsters) {
            if (Object.prototype.hasOwnProperty.call(this.monsters, monster))
                this.monsters[monster].randomMove();
        }
    }
}