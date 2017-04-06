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
        if ($('#testing').length === 0) {
            $('#app').prepend('<button id="testing"></button>');
        }
        $('#testing').click(function() {
            $('#canvas-lighting').toggle();
        });
        // end test code

        this.players.player1.initialize();
        this.monsters.monster1.initialize();
        this.startGame();
    }

    startGame() {
        let startingMessages = [
                {"class" : "modal-header", "text" : "dialogHeader"},
                {"class" : "modal-body left-content subheader creepy-text", "text" : "gameIntro", "hidden" : false},
                {"class" : "modal-body left-content", "text" : "instructions", "hidden" : false},
                {"class" : "modal-tips", "text" : "tips", "hidden" : true}
            ],
            buttons = [
                {
                    "label" : "Tips",
                    "id" : "modal-button-tips",
                    "action" : this.ui.slideWindow,
                    "params" : {"container" : ".modal-body-container", "button" : "#modal-button-tips"},
                    "hidden" : false
                },
                {
                    "label" : "Start!",
                    "id" : "modal-button-start",
                    "action" : this.ui.updateUIAtStart,
                    "params" : {"callback" : this.ui.runTurnCycle.bind(this)},
                    "hidden" : false
                },
            ];

        this.ui.updateStatusValue({id: ".kills", value: 0});
        this.ui.updateStatusValue({id: ".pc-health", value: this.players.player1.health});
        this.ui.modalOpen(startingMessages, buttons);
    }

    runTurnCycle() {
        if (this.getIsPlayerTurn() === true) {
            this._setupPlayerTurnInteractionHandlers();
        } else {
            this._setupMonsterTurnInteractionHandlers();
            this.monsterActions.moveMonsters(this.getIsGameOver.bind(this), this.setIsGameOver.bind(this));
            this._waitForAnimationsToFinish();
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
        this._tearDownListeners();
        // just played Player's turn
        if (this.getIsPlayerTurn() === true) {
            if (Object.keys(this.monsters).length > 0) {
                this.setIsPlayerTurn(false);
                this.runTurnCycle();
            } else {
                this._endGame("gameOverWin");
            }
        // just played monsters' turn
        } else {
            if (this.getIsGameOver() === true) {
                this._tearDownListeners();
                this._endGame("gameOverDead");
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

    _waitForAnimationsToFinish() {
        let turnCycle = this;

        $('.grid').find(':animated').promise().done(function() {
            turnCycle.endTurn();
        });
    }

    /*****************************
     * function _setupMonsterTurnInteractionHandlers
     *
     * Sets up player click and key handlers for monster turn using events class (in order to send status message)
     *
     * parameters:
     * -target (class ".tile")
     * -targetActions: keys are tile classes, values are actions to take
     ****************************/
    _setupMonsterTurnInteractionHandlers() {
        let turnCycle = this,
            targetAction = function() {
                if (turnCycle.getIsPlayerTurn() === false) {
                    turnCycle.ui.displayStatus('wait');
                    setTimeout(function() {
                        turnCycle.ui.hideStatus();
                    }, 1000);
                }
            },
            params = {
                "keys" : [97, 98, 99, 100, 101, 102, 103, 104, 105]
            };
        this.events.setUpGeneralInteractionListeners(this.tileListenerTarget, targetAction, params);
    }

    /*****************************
     * function _setupPlayerTurnInteractionHandlers
     *
     * Sets up click and key handlers for player turn using events class
     *
     * parameters:
     * -target (class ".tile")
     * -targetActions: keys are tile classes, values are actions to take
     * -params: parameters to send to each target action
     ****************************/
    _setupPlayerTurnInteractionHandlers() {
        let targetActions = {
                "walkable": this.playerActions.movePlayer.bind(this.playerActions),
                "impassable": this.grid.animateTile.bind(this),
                "monster": this.playerActions.playerAttack.bind(this.playerActions)
            },
            params = {
                "walkable": {
                    "player": "player1",
                    "callback": this.endTurn.bind(this)
                },
                "impassable": {
                    "position": this.players.player1.pos,
                    "type": "impassable"
                },
                "monster": {
                    "player": "player1",
                    "callback" : this.endTurn.bind(this)
                }
            };
            this.events.setUpClickListener(this.tileListenerTarget, targetActions, params);
            this.events.setUpArrowKeysListener(targetActions, params, this.players.player1.pos);
    }

    _tearDownListeners() {
        this.events.removeClickListener(this.tileListenerTarget);
        this.events.removeArrowKeysListener();
    }

    _endGame(message) {
        let controller = this,
            restartCallback = function() {
                controller.grid.clearGrid();
                controller.events.removeAllListeners();
                Game.initialize();
            },
            scoreValues = {
                "kills" : this.players.player1.kills,
                "health" : this.players.player1.health
            },
            endingMessages = [
                {"class" : "modal-header", "text" : "dialogHeader"},
                {"class" : "modal-body left-content", "text" : message, "hidden" : false},
                {"class" : "modal-body left-content", "text" : "score", "scoreValues" : scoreValues, "hidden" : false},
            ],
            buttons = [
                {"label" : "Restart", "action" : this.ui.modalClose, "params" : {"callback" : restartCallback}, "hidden" : false}
            ];

        this.ui.modalOpen(endingMessages, buttons);
    }
}
