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
        this.monsterCount = Object.keys(this.monsters).length;
        this.events = new Events();
        this.gameIsActive = true;
        this.isMonsterTurn = false;
    }

    initialize() {
        this.events.setUpTileChangeListener('.tile', this.grid.updateTileImage);
        this.events.setUpLightChangeListener('.tile', this.grid.updateLightingImage);
    }

    runTurnCycle() {
        let controller = this;
        if(controller.gameIsActive) {
            if (controller.isMonsterTurn) {
                controller._tearDownListeners();
                controller._moveMonsters();
                controller.isMonsterTurn = false;
            }
            controller._movePlayers();
        }
    }

    endPlayerTurn() {
        let playersAlive = 0;
        for (let player in this.players) {
            if (Object.prototype.hasOwnProperty.call(this.players, player)) {
                if (this.players[player].health > 0)
                    playersAlive += 1;
            }
        }
        if (playersAlive > 0 && this.monsterCount > 0) {
            this.isMonsterTurn = true;
            this.runTurnCycle();
        } else {
            this.endGame();
        }
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
                "walkable" : player.movePlayer.bind(this),
                "impassable" : this.grid.jiggle.bind(this),
                "monster" : this._attack.bind(this)
            },
            params = {
                "walkable" : {
                    "player" : player,
                    "callback" : this.endPlayerTurn.bind(this)
                },
                "impassable" : player,
                "monster" : {
                    "targets" : this.monsters,
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
        player.clearLighting();
        player._setLighting(player.pos);
        //end temp
    }

    _tearDownListeners() {
        this.events.removeClickListener('.tile');
    }

    _moveMonsters() {
        let newMinion = null,
            newMinionNum = "";

        for (let monster in this.monsters) {
            let minionAttacked = false;
            if (Object.prototype.hasOwnProperty.call(this.monsters, monster)) {
                if (this.monsters[monster].name === "Queen") {
                    this.monsters[monster].saveCurrentPos();
                } else {
                    let nearbyPlayerTiles = this._checkForNearbyPlayers(this.monsters[monster]);
                    if (nearbyPlayerTiles) {
                        this._attack(nearbyPlayerTiles[0], {"targets" : this.players});
                        minionAttacked = true;
                    }
                }
                if (!minionAttacked) {
                    this.grid.clearImg(this.monsters[monster]);
                    this.monsters[monster].randomMove();
                    if (this.monsters[monster].name === "Queen") {
                        newMinion = this.monsters[monster].spawn();
                    }
                }
            }
        }
        if (newMinion) {
            this.monsterCount += 1;
            newMinionNum = "monster" + this.monsterCount;
            this.monsters[newMinionNum] = newMinion;
            this.monsters[newMinionNum].name = "Minion" + this.monsterCount;
            this.monsters[newMinionNum].initialize();
        }
    }

    _movePlayers() {
        for (let player in this.players) {
            if (Object.prototype.hasOwnProperty.call(this.players, player)) {
                if (this.players[player].health > 0)
                    this._setupListeners(this.players[player]);
                else {
                    this.helpers.killObject(this.players, player);
                }
            }
        }
    }

    _checkForNearbyPlayers(monster) {
        let monsterLoc = monster.pos,
            colIndex = monsterLoc.indexOf('col'),
            monsterRow = monsterLoc.slice(3, colIndex),
            monsterCol = monsterLoc.slice(colIndex + 3),
            $playerLoc,
            $surroundingTiles = this.helpers.findSurroundingTiles(monsterRow, monsterCol, 1);

        if ($surroundingTiles.hasClass('player')) {
            $playerLoc = $.grep($surroundingTiles, function(tile){
                return $(tile).hasClass('player');
            });
        }
        return $playerLoc;
    }

    _attack(targetTile, params) {
        let objectList = params.targets,
            targetObject = {},
            targetNum,
            callback = params ? params.callback : null,
            controller = this;

        for (targetNum in objectList) {
            if (Object.prototype.hasOwnProperty.call(objectList, targetNum)) {
                if (objectList[targetNum].pos === targetTile.id) {
                    targetObject = objectList[targetNum];
                    break;
                }
            }
        }

        $('#' + targetObject.pos + '> .light-img').css("background-color", "red");
        targetObject.health -= 1;
        // window.setTimeout(function() {
        //     $('#' + targetObject.pos + '> .light-img').css("background-color", "unset");
        // }, 400);
        if (targetObject.health < 1)
            this.helpers.killObject(objectList, targetNum);
        if (!controller.isMonsterTurn) {
            callback();
        }
    }

    endGame() {
        alert("Game Over!");
    }
}