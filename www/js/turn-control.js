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

    constructor(grid, ui, players, playerActions, monsterActions, monsters, events) {
        this.grid = grid;
        this.ui = ui;
        this.players = players;
        this.playerActions = playerActions;
        this.monsterActions = monsterActions;
        this.monsters = monsters;
        this.events = events;
        this.isPlayerTurn = true;
        this.tileListenerTarget = '.tile';
        this.isGameOver = false;
    }

    initialize() {
        this.grid.drawGrid();

        // for testing
        // $('.light-img').remove();

        this.players.player1.initialize();
        this.monsters.monster1.initialize();
        this.startGame();
    }

    startGame() {
        let startingMessages = [
                {"class" : "modal-header", "text" : "dialogHeader"},
                {"class" : "modal-body", "text" : "gameIntro", "hidden" : false},
                {"class" : "modal-body", "text" : "instructions", "hidden" : false},
                {"class" : "modal-tips", "text" : "tips", "hidden" : true}
            ],
            buttons = [
                {"label" : "Tips", "action" : this.ui.visibilityToggle, "params" : ".modal-tips", "hidden" : false},
                {"label" : "Start!", "action" : this.ui.modalClose, "params" : {"callback" : this.ui.runTurnCycle.bind(this)}, "hidden" : false},
            ];

        this.ui.updateValue({id: ".kills", value: 0});
        this.ui.updateValue({id: ".pc-health", value: this.players.player1.health});
        this.ui.modalOpen(startingMessages, buttons);
    }

    runTurnCycle() {
        if (this.getIsPlayerTurn() === true) {
            this._setupPlayerClickHandlers();
        } else {
            this._tearDownListeners();
            this.monsterActions.moveMonsters(this.getIsGameOver.bind(this), this.setIsGameOver.bind(this));
            this.endTurn();
        }
    }

    getIsPlayerTurn() {
        return this.isPlayerTurn;
    }

    setIsPlayerTurn(playerTurnSetting) {
        this.isPlayerTurn = playerTurnSetting;
    }

    getIsGameOver() {
        return this.isGameOver;
    }

    setIsGameOver() {
        this.isGameOver = true;
    }

    endTurn() {
        if (this.getIsPlayerTurn() === true) {
            this._tearDownListeners();
            if (Object.keys(this.monsters).length > 0) {
                this.setIsPlayerTurn(false);
                this.runTurnCycle();
            } else {
                this._endGame("win");
            }
        } else {
            if (this.getIsGameOver() === true) {
                this._tearDownListeners();
                this._endGame("lose");
            } else {
                this.setIsPlayerTurn(true);
                this.runTurnCycle();
            }
        }
    }

    /*****************************
     *
     * Private Functions
     *
     *****************************/


    /*****************************
     * function _setupPlayerClickHandlers
     *
     * Sets up click handlers through events class with these parameters:
     *
     * -target class
     * -function to take action
     * -function to take alternate action if click target is invalid
     * -player object
     * -callback function to run after player move action is finished
     ****************************/
    _setupPlayerClickHandlers() {
        let targetActions = {},
            params = {};

        for (let player in this.players) {
            if (Object.prototype.hasOwnProperty.call(this.players, player)) {
                targetActions = {
                    "walkable": this.playerActions.movePlayer.bind(this.playerActions),
                    "impassable": this.grid.animateTile.bind(this),
                    "monster": this.playerActions.playerAttack.bind(this.playerActions)
                };
                params = {
                    "walkable": {
                        "player": player,
                        "callback": this.endTurn.bind(this)
                    },
                    "impassable": {
                        "targetObject": this.players[player],
                        "type": "impassable"
                    },
                    "monster": {
                        "player": player,
                        "callback" : this.endTurn.bind(this)
                    }
                };
                this.events.setUpClickListener(this.tileListenerTarget, targetActions, params);
            }
        }
    }

    _tearDownListeners() {
        this.events.removeClickListener(this.tileListenerTarget);
    }

    _endGame(message) {
        let controller = this,
            gameEndMessage = message === "lose" ? "gameOverDead" : "gameOverWin",
            restartCallback = function() {
                controller.grid.clearGrid();
                game.initialize();
            },
            endingMessages = [
                {"class" : "modal-header", "text" : "dialogHeader"},
                {"class" : "modal-body", "text" : gameEndMessage, "hidden" : false},
            ],
            buttons = [
                {"label" : "Restart", "action" : this.ui.modalClose, "params" : {"callback" : restartCallback}, "hidden" : false}
            ];

        this.ui.modalOpen(endingMessages, buttons);
    }
}
