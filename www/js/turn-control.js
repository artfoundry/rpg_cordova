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
    constructor(grid, players, monsters, helpers) {
        this.helpers = helpers;
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
                "impassable" : this.grid.jiggle.bind(this),
                "monster" : this.attack.bind(this)
            },
            params = {
                "walkable" : {
                    "player" : player,
                    "callback" : this.endPlayerTurn.bind(this)
                },
                "impassable" : player,
                "monster" : {
                    "monsters" : this.monsters,
                    "callback" : this.endPlayerTurn.bind(this)
                }
            };
        this.events.setUpClickListener('.tile', actions, params);
    }

    _tearDownListeners() {
        this.events.removeClickListener('.tile');
    }

    _moveMonsters() {
        for (let monster in this.monsters) {
            if (Object.prototype.hasOwnProperty.call(this.monsters, monster)) {
                if (this.monsters[monster].health > 0) {
                    let playerNearby = this._checkForNearbyPlayers(monsters[monster]);
                    if (playerNearby) {
                        this.attack();
                    }
                    else {
                        this.grid.clearImg(this.monsters[monster]);
                        this.monsters[monster].randomMove();
                    }
                }
                else {
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
                    this._killObject(this.players, player);
                }
            }
        }
    }

    _checkForNearbyPlayers(monster) {
        let monsterLoc = monster.pos,
            playerLoc = '';


        return playerLoc;
    }

    attack(params, target) {
        let monsters = params.monsters,
            targetMonster = {},
            monsterNum,
            callback = params.callback;

        for (monsterNum in monsters) {
            if (Object.prototype.hasOwnProperty.call(monsters, monsterNum)) {
                if (monsters[monsterNum].pos === target.id)
                    targetMonster = monsters[monsterNum];
            }
        }

        $('#' + targetMonster.pos + '> .content').css("background-color", "red");
        targetMonster.health -= 1;
        window.setTimeout(function() {
            $('#' + targetMonster.pos + '> .content').css("background-color", "unset");
            callback();
        }, 200);
    }

    _killObject(group, item) {
        this.grid.clearImg(group[item]);
        delete group[item];
    }
}