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

    constructor(dungeon, ui, players, playerActions, monsterActions, monsters, events) {
        this.dungeon = dungeon;
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
        this.players.player1.initialize();
        for(let monster in this.monsters) {
            if (this.monsters.hasOwnProperty(monster)) {
                this.monsters[monster].initialize();
            }
        }
        this.startGame();
    }

    startGame() {
        let startingMessages = [
                {'class' : 'modal-header', 'text' : 'dialogHeader'},
                {'class' : 'modal-body left-content subheader creepy-text', 'text' : 'gameIntro', 'hidden' : false},
                {'class' : 'modal-body left-content', 'text' : 'instructions', 'hidden' : false},
                {'class' : 'modal-body left-content', 'text' : 'online', 'hidden' : false},
                {'class' : 'modal-tips', 'text' : 'tips', 'hidden' : true}
            ],
            buttons = [
                {
                    'label' : 'Tips',
                    'id' : 'modal-button-tips',
                    'action' : this.ui.slideWindow,
                    'params' : {'container' : '.modal .body-container', 'button' : '#modal-button-tips'},
                    'hidden' : false
                },
                {
                    'label' : 'Start!',
                    'id' : 'modal-button-start',
                    'action' : this.ui.updateUIAtStart,
                    'params' : {'player' : this.players.player1, 'callback' : this.runTurnCycle.bind(this)},
                    'hidden' : false
                },
            ];

        this.ui.updateStatusValue({id: '.kills', value: 0});
        this.ui.updateStatusValue({id: '.pc-health', value: this.players.player1.health});
        this.ui.updateStatusValue({id: '.pc-sanity', value: Math.round((this.players.player1.sanity / this.players.player1.maxSanity) * 100)});
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
        let stairsPos,
            player = this.players.player1;

        this._tearDownListeners();
        // just played Player's turn
        if (this.getIsPlayerTurn() === true) {
            if (player.quests.completedQuests.includes('killElder') && this._getTotalNumMonsters() === 0) {
                this._endGame('gameOverWin');
            } else {
                if (player.levelChanged !== null) {
                    this.dungeon.saveLevel(this.monsters);
                    this.dungeon.nextLevel(player.currentLevel, this._updateMonstersForLevel.bind(this));

                    stairsPos = player.levelChanged === 1 ? $('.stairsUp').attr('id') : $('.stairsDown').attr('id');
                    player.pos = stairsPos;
                    player.setPlayer({'currentPos' : stairsPos});
                    player.levelChanged = null;
                    this._scrollScreenToPlayer($('#' + player.pos));
                }
                this.setIsPlayerTurn(false);
                this.runTurnCycle();
            }
        // just played monsters' turn
        } else {
            if (this.getIsGameOver() === true) {
                if (player.health <= 0)
                    this._endGame('gameOverDead');
                else if (player.sanity <= 0)
                    this._endGame('gameOverInsane');
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

    _scrollScreenToPlayer($playerTile) {
        let playerPos = Game.helpers.isOffScreen($playerTile),
            x = 0,
            y = 0,
            $win = $(window),
            verticalCenter = $win.height() / 2,
            horizontalCenter = $win.width() / 2;

        // if player is at bottom of screen, we want to scroll positive amount
        if (playerPos.top < verticalCenter) {
            y = playerPos.bottom - verticalCenter;
        // if player is at top of screen, we want to scroll negative amount
        } else if (playerPos.bottom < verticalCenter) {
            y = verticalCenter - playerPos.top;
        }
        // if player is on right side of screen, we want to scroll positive amount
        if (playerPos.left < horizontalCenter) {
            x = playerPos.right - horizontalCenter;
        // if player is on left side of screen, we want to scroll negative amount
        } else if (playerPos.right < horizontalCenter) {
            x = horizontalCenter - playerPos.left;
        }
        this.ui.scrollWindow(x, y);
    }

    _updateMonstersForLevel(newMonsters) {
        this.monsters = newMonsters;
        this.playerActions.monsters = this.monsters;
        this.monsterActions.monsters = this.monsters;
    }

    _getTotalNumMonsters() {
        let total = 0;

        for (let n=0; n < this.dungeon.monstersPerLevel.length; n++) {
            total += this.dungeon.monstersPerLevel[n];
        }
        return total;
    }

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
     * parameters sent to event handler:
     * -tileListenerTarget (class '.tile')
     * -targetAction: callback that displays the message
     * -params: values are keys to react to (display message) if user types them
     ****************************/
    _setupMonsterTurnInteractionHandlers() {
        let turnCycle = this,
            targetAction = function() {
                if (turnCycle.getIsPlayerTurn() === false) {
                    turnCycle.ui.displayStatus('wait');
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
     * parameters to send to event handler:
     * -tileListenerTarget (class ".tile")
     * -targetActions: keys are tile classes, values are actions to take
     * -params: parameters to send to each target action
     * -this.players.player1.pos: player's current position
     ****************************/
    _setupPlayerTurnInteractionHandlers() {
        let targetActions = {
                'walkable': this.playerActions.movePlayer.bind(this.playerActions),
                'impassable': this.playerActions.movePlayer.bind(this.playerActions),
                'monster': this.playerActions.playerAttack.bind(this.playerActions),
                'item': this.playerActions.pickUpItem.bind(this.playerActions)
            },
            params = {
                'walkable': {
                    'player': 'player1',
                    'callback': this.endTurn.bind(this)
                },
                'impassable': {
                    'player': 'player1'
                },
                'monster': {
                    'player': 'player1',
                    'callback' : this.endTurn.bind(this)
                },
                'item': {
                    'player': 'player1'
                }
            };
            this.events.setUpClickListener(this.tileListenerTarget, targetActions, params);
            this.events.setUpArrowKeysListener(this.players.player1.pos, targetActions, params);
    }

    _tearDownListeners() {
        this.events.removeClickListener(this.tileListenerTarget);
        this.events.removeArrowKeysListener();
    }

    _endGame(message) {
        let scoreValues = {
                'kills' : this.players.player1.kills,
                'health' : this.players.player1.health,
                'sanity' : this.players.player1.sanity,
                'elderSign' : this.players.player1.quests.completedQuests.includes('elderSign'),
                'elderKilled' : this.players.player1.quests.completedQuests.includes('killElder'),
                'gameWon' : message === 'gameOverWin'
            },
            endingMessages = [
                {'class' : 'modal-header', 'text' : 'dialogHeader'},
                {'class' : 'modal-body left-content', 'text' : message, 'hidden' : false},
                {'class' : 'modal-body left-content', 'text' : 'score', 'scoreValues' : scoreValues, 'hidden' : false},
            ],
            buttons = [
                {'label' : 'Restart', 'action' : this.ui.modalClose, 'params' : {'callback' : this.ui.restartGame.bind(this)}, 'hidden' : false}
            ];

        this.ui.modalOpen(endingMessages, buttons);
    }
}
