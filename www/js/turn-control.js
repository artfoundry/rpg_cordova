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

    constructor(grid, ui, players, playerActions, commonActions, monsters, events) {
        this.grid = grid;
        this.ui = ui;
        this.players = players;
        this.playerActions = playerActions;
        this.commonActions = commonActions;
        this.monsters = monsters;
        this.events = events;
        this.isPlayerTurn = true;
        this.tileListenerTarget = '.tile';
        this.deferredCBs = $.Deferred();
        this.gameOver = false;
    }

    initialize() {
        this.grid.drawGrid();

        // for testing
        // $('.light-img').remove();

        this.events.setUpTileChangeListener(this.tileListenerTarget, this.grid.updateTileImage);
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
            controller.deferredCBs.progress(function() {
               controller.endTurn();
            });
            controller._setupPlayerClickHandlers();
        } else {
            controller._tearDownListeners();
            controller.commonActions.moveMonsters(this.deferredCBs, this.isPlayerTurn, this.gameOver);
            controller.endTurn();
        }
    }

    endTurn() {
        if (this.isPlayerTurn) {
            if (this.commonActions.monsterCount > 0) {
                this.isPlayerTurn = false;
                this.deferredCBs = $.Deferred();
                this.runTurnCycle();
            } else {
                this._tearDownListeners();
                this._endGame("win");
            }
        } else {
            if (this.gameOver) {
                this._tearDownListeners();
                this._endGame("lose");
            } else {
                this.isPlayerTurn = true;
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
                    "monster": this.commonActions.attack.bind(this.commonActions)
                };
                params = {
                    "walkable": {
                        "player": player,
                        "callback": this.deferredCBs.notify.bind(this)
                    },
                    "impassable": {
                        "targetObject": player,
                        "type": "impassable"
                    },
                    "monster": {
                        "targets": this.monsters,
                        "player": player,
                        "isPlayerTurn": this.isPlayerTurn,
                        "gameOver": this.gameOver,
                        "callbacks": this.deferredCBs
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
            endMessage = message === "lose" ? "gameOverDead" : "gameOverWin",
            restartCallback = function() {
                controller.grid.clearGrid();
                app.initialize();
            },
            messages = [
                {"class" : "modal-header", "text" : "dialogHeader"},
                {"class" : "modal-body", "text" : endMessage, "hidden" : false},
            ],
            buttons = [
                {"label" : "Restart", "action" : this.ui.modalClose, "params" : {"callback" : restartCallback}, "hidden" : false}
            ];

        this.ui.modalOpen(messages, buttons);
    }
}
