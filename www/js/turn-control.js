/**
 * Created by David on 11/29/16.
 *
 * Controller should set up turn loop that:
 * 1) sets up player listeners
 * 2) waits for player move
 * 3) checks monsters health
 * 4) tears down player listeners
 * 5) moves monsters
 * 6) checks players health
 * 7) returns to beginning
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
                this._moveMonsters();
                this.isMonsterTurn = false;
            }
            this._movePlayers();
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
                    "monsters" : this.monsters,
                    "callback" : this.endPlayerTurn.bind(this)
                }
            };
        this.events.setUpClickListener('.tile', actions, params);

        //temp listener for buttons
        $('.light-button').click(function(e) {
            if (e.currentTarget.id === "light-low")
                player.lightRadius = 1;
            else if (e.currentTarget.id === "light-med")
                player.lightRadius = 2;
            else if (e.currentTarget.id === "light-high")
                player.lightRadius = 3;
        });
        player._setLighting(player.playerPos);
        //end temp
    }

    _tearDownListeners() {
        this.events.removeClickListener('.tile');
    }

    _moveMonsters() {
        for (let monster in this.monsters) {
            if (Object.prototype.hasOwnProperty.call(this.monsters, monster)) {
                if (this.monsters[monster].health > 0)
                    this.monsters[monster].randomMove();
                else {
                    this.monsters[monster].clearMonsterImg(this.monsters[monster]);
                    this._killObject(this.monsters, monster);
                }
            }
        }
    }

    _movePlayers() {
        for (let player in this.players) {
            if (Object.prototype.hasOwnProperty.call(this.players, player)) {
                if (this.players[player].health > 0)
                    this._setupListeners(this.players[player]);
                else {
                    this.players[player].clearPlayerImg(this.players[player]);
                    this._killObject(this.players, player);
                }
            }
        }
    }

    _killObject(group, item) {
        delete group[item];
    }
}