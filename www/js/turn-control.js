/*****************************
 * Created by David on 11/29/16.
 *
 * Controller sets up turn loop that:
 * 1) sets up click and grid listeners
 * 2) waits for player move
 * 3) if player attacks, checks monster's health
 * 4) tears down click listeners
 * 5) moves monsters
 * 6) if monster attacks, checks player's health
 * 7) if players dead, ends game, else runs cycle again
 *****************************/

class TurnController {
    /*****************************
     *
     * Public Functions
     *
     *****************************/

    constructor(grid, ui, players, monsters, helpers, events) {
        this.helpers = helpers;
        this.grid = grid;
        this.ui = ui;
        this.players = players;
        this.playerCount = this._checkNumCharactersAlive(this.players);
        this.monsters = monsters;
        this.monsterCount = Object.keys(this.monsters).length;
        this.events = events;
        this.isPlayerTurn = true;
        this.tileListenerTarget = '.tile';
    }

    initialize() {
        this.grid.drawGrid();
        this.events.setUpTileChangeListener(this.tileListenerTarget, this.grid.updateTileImage);
        this.events.setUpLightChangeListener(this.tileListenerTarget, this.grid.updateLightingImage);
        this.players.player1.initialize();
        this.monsters.monster1.initialize();
        this.startGame();
    }

    startGame() {
        let messages = [
                {"class" : "modal-header", "text" : "dialogHeader"},
                {"class" : "modal-body", "text" : "gameIntro", "hidden" : false},
                {"class" : "modal-body", "text" : "instructions", "hidden" : false},
                {"class" : "modal-tips", "text" : "tips", "hidden" : true}
            ],
            buttons = [
                {"label" : "Tips", "action" : this.ui.visibilityToggle, "params" : ".modal-tips", "hidden" : false},
                {"label" : "Start!", "action" : this.ui.modalClose, "params" : {"callback" : this.ui.runTurnCycle.bind(this)}, "hidden" : false},
            ];

        this.ui.updateValue({id: "#pc-health", value: this.players.player1.health});
        this.ui.modalOpen(messages, buttons);
    }

    runTurnCycle() {
        let controller = this;

        if (controller.isPlayerTurn) {
            controller._movePlayers();
        } else {
            controller._tearDownListeners();
            controller._moveMonsters();
            this.endTurn();
        }
    }

    endTurn() {
        if (this.isPlayerTurn) {
            if (this.monsterCount > 0) {
                this.isPlayerTurn = false;
            } else {
                this._endGameWon();
            }
        } else {
            this.isPlayerTurn = true;
        }
        this.runTurnCycle();
    }

    /*****************************
     *
     * Private Functions
     *
     *****************************/


    /*****************************
     * function _setupListeners
     *
     * Sets up click handlers through events class with these parameters:
     *
     * -target class
     * -function to take action
     * -function to take alternate action if click target is invalid
     * -player object
     * -callback function to run after player move action is finished
     ****************************/
    _setupListeners(player) {
        let targetActions = {
                "walkable" : player.movePlayer.bind(this),
                "impassable" : this.grid.animateHighlight.bind(this),
                "monster" : this._attack.bind(this)
            },
            params = {
                "walkable" : {
                    "player" : player,
                    "callback" : this.endTurn.bind(this)
                },
                "impassable" : {
                    "targetObject": player,
                    "type" : "impassable"
                },
                "monster" : {
                    "targets" : this.monsters,
                    "player" : player
                }
            };
        this.events.setUpClickListener(this.tileListenerTarget, targetActions, params);

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
        this.events.removeClickListener(this.tileListenerTarget);
    }

    _moveMonsters() {
        let newMinion = null,
            newMinionNum = "",
            attackParams = {};

        for (let monster in this.monsters) {
            let minionAttacked = false;
            if (Object.prototype.hasOwnProperty.call(this.monsters, monster)) {
                if (this.monsters[monster].name === "Queen") {
                    this.monsters[monster].saveCurrentPos();
                } else {
                    let nearbyPlayerTiles = this._checkForNearbyCharacters(this.monsters[monster], 'player');
                    if (nearbyPlayerTiles) {
                        attackParams = { "targets" : this.players };
                        this._attack(nearbyPlayerTiles[0], attackParams);
                        minionAttacked = true;
                    }
                }
                if (!minionAttacked) {
                    this.grid.clearImg(this.monsters[monster]);
                    this.monsters[monster].randomMove();
                    if (this.monsters[monster].name === "Queen" && $('#' + this.monsters[monster].oldPos).hasClass('walkable')) {
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
                this._setupListeners(this.players[player]);
            }
        }
    }

    _checkForNearbyCharacters(character, charSearchType) {
        let characterLoc = character.pos,
            colIndex = characterLoc.indexOf('col'),
            characterRow = characterLoc.slice(3, colIndex),
            characterCol = characterLoc.slice(colIndex + 3),
            $nearbyCharLoc = null,
            $surroundingTiles = this.helpers.findSurroundingTiles(characterRow, characterCol, 1);

        if ($surroundingTiles.hasClass(charSearchType)) {
            $nearbyCharLoc = $.grep($surroundingTiles, function(tile){
                return $(tile).hasClass(charSearchType);
            });
        }
        return $nearbyCharLoc;
    }

    /**
     * function _attack
     * For registering an attack by a monster on a player or vice versa
     * @param targetTile - jquery element target of attack
     * @param params - object in which targets key contains list of game characters, either players or monsters
     * @private
     */
    _attack(targetTile, params) {
        let characterList = params.targets,
            characterNum,
            nearbyMonsterList,
            targetLoc,
            targetObject = {},
            controller = this,
            animateParams;

        for (characterNum in characterList) {
            if (Object.prototype.hasOwnProperty.call(characterList, characterNum)) {
                if (characterList[characterNum].pos === targetTile.id) {
                    targetLoc = $('#' + characterList[characterNum].pos)[0];
                    // if player is attacking, check if there are actually monsters nearby
                    if (params.player) {
                        nearbyMonsterList = this._checkForNearbyCharacters(params.player, 'monster');
                    }
                    // if monster is attacking or if player is attacking and attack target matches monster in list of nearby monsters, then we have our target
                    if (!params.player || (nearbyMonsterList.indexOf(targetLoc) !== -1)) {
                        targetObject = characterList[characterNum];
                        break;
                    }
                }
            }
        }

        animateParams = {
            "targetObject" : targetObject,
            "type" : "attack",
            "callback" : function() {
                controller._updateHealth(targetObject, {objects: characterList, index: characterNum});
                if (controller.isPlayerTurn) {
                    controller.endTurn();
                }
            }
        };
        this.grid.animateHighlight(null, animateParams);
    }

    _updateHealth(targetObject, listParams) {
        targetObject.health -= 1;
        if (targetObject instanceof PlayerCharacter)
            this.ui.updateValue({id: "#pc-health", value: targetObject.health});
        if (targetObject.health < 1) {
            this.helpers.killObject(listParams.objects, listParams.index);
            if (targetObject instanceof Monster) {
                this.ui.kills += 1;
                this.ui.updateValue({id: "#kills", value: this.ui.kills});
            }
            this.monsterCount = this._checkNumCharactersAlive(this.monsters);
            this.playerCount = this._checkNumCharactersAlive(this.players);
            if (this.playerCount === 0) {
                this._endGameLost();
            }
        }
    }

    _checkNumCharactersAlive(objectsList) {
        return Object.keys(objectsList).length;
    }

    _endGameLost() {
        alert("You're dead! Game over!");
    }

    _endGameWon() {
        alert("You've killed every monster! You win!");
    }
}
