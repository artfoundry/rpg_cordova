/**
 * Created by David on 2/3/17.
 */

class PlayerActions {
    constructor(dungeon, ui, players, monsters, audio) {
        this.players = players;
        this.dungeon = dungeon;
        this.grid = dungeon.grid;
        this.ui = ui;
        this.monsters = monsters;
        this.audio = audio;
    }

    /**
     * function movePlayer
     * Moves player character to newTile or displays jiggle animation if tile is impassable.
     * Then runs a function tied to the tile if one is present.
     * Parameters:
     * - params: Object sent by TurnController containing player object and callback
     * - newTile: DOM element of tile to which player is moving
     */
    movePlayer(params, newTile) {
        let player = this.players[params.player],
            currentPos = player.pos,
            newTilePos = newTile.id,
            func = $(newTile).attr('data-function') || null,
            message = $(newTile).attr('data-message') || null,
            levelDirection,
            impassableAnimParams = {
                'position' : currentPos,
                'tileLayer' : '.character',
                'type' : 'impassable'
            },
            callback = params.callback,
            panelStairsParams = [
                {
                    'container' : '.panel-body-container',
                    'content' : '<div class="dynamic">Do you want to take the stairs or just move to them?</div>',
                    'disabled' : false
                },
                {
                    'container' : '.panel-footer',
                    'content' : '<span class="button-container dynamic"><button class="panel-button">Cancel</button></span>',
                    'buttonContainer' : '.panel-button',
                    'disabled' : false,
                    'callback' : this.ui.dynamicPanelClose.bind(this),
                    'runCallbackOnOpen' : false
                },
                {
                    'id' : '#panel-stairs-move',
                    'container' : '.panel-footer',
                    'content' : '<span class="button-container dynamic"><button id="panel-stairs-move" class="panel-button">Move</button></span>',
                    'buttonContainer' : '.panel-button',
                    'disabled' : false,
                    'callback' : player.setPlayer.bind(player),
                    'cbParams' : {'currentPos' : currentPos, 'newPos' : newTilePos, 'callback' : callback},
                    'runCallbackOnOpen' : false
                },
                {
                    'id' : '#panel-stairs-climb',
                    'container' : '.panel-footer',
                    'content' : '<span class="button-container dynamic"><button id="panel-stairs-climb" class="panel-button">Stairs</button></span>',
                    'buttonContainer' : '.panel-button',
                    'disabled' : false,
                    'callback' : player.changeMapLevel.bind(player),
                    'cbParams' : {'currentPos' : currentPos, 'newPos' : newTilePos, 'callback' : callback},
                    'runCallbackOnOpen' : false
                }
            ];

        if ($(newTile).hasClass('pc-adjacent')) {
            if ($(newTile).hasClass('impassable')) {
                this.grid.animateTile(impassableAnimParams);
            } else if (func) {
                if (func === 'nextLevel') {
                    if ($(newTile).hasClass('stairsDown'))
                        levelDirection = 1;
                    else if ($(newTile).hasClass('stairsUp'))
                        levelDirection = -1;
                    panelStairsParams[3].cbParams.levelDirection = levelDirection;
                    this.ui.dynamicPanelOpen(panelStairsParams);
                } else if (func === 'displayStatus') {
                    this.ui.displayStatus(message);
                    this.grid.animateTile(impassableAnimParams);
                }
            } else {
                player.setPlayer({'currentPos' : currentPos, 'newPos' : newTilePos, 'callback' : callback});
            }
        }
    }

    /**
     * function pickUpItem
     * @param params: object containing player object
     * @param targetTile: string of tile ID
     */
    pickUpItem(params, targetTile) {
        let player = this.players[params.player],
            $targetTile = $(targetTile),
            itemType = $targetTile.attr('data-item-type'),
            itemName = $targetTile.attr('data-item-name'),
            itemImage = Game.items[itemName].internalOnly.image,
            questName = $targetTile.attr('data-quest-name');

        if ($targetTile.hasClass('pc-adjacent') && Game.items[itemName].internalOnly.canBeAcquired) {
            if (Game.items[itemName].internalOnly.audioPickup)
                this.audio.playSoundEffect([Game.items[itemName].internalOnly.audioPickup]);
            player.inventory.Items.push(itemName);

            if (itemType === 'questItems' && this._checkCurrentQuest(player, questName, itemName))
                this.handleQuest(itemName);
            this.grid.setTileWalkable(targetTile.id, itemName, 'item', itemType);
            this.grid.changeTileImg(targetTile.id, '.content', '', 'content-' + itemImage);
        }
    }

    /**
     * function playerAttack
     * For registering an attack by a monster on a player or vice versa
     * @param targetTile - jquery element target of attack
     * @param params - object containing player and callback
     * @private
     */
    playerAttack(params, targetTile) {
        let playerActions = this,
            monsterNum,
            targetMonster,
            currentPlayer = playerActions.players[params.player],
            callback = params.callback,
            animateAttackParams,
            animateDeathParams,
            animateFearParams;

        if ($(targetTile).hasClass('pc-adjacent')) {
            for (monsterNum in this.monsters) {
                if (this.monsters.hasOwnProperty(monsterNum)) {
                    targetMonster = this.monsters[monsterNum];
                    if (targetMonster.pos === targetTile.id) {
                        if (targetMonster.name === 'Elder' && !currentPlayer.inventory.Items.includes('elderSign')) {
                            this.ui.displayStatus('fear');
                            this.ui.showFearEffect(.5);
                            animateFearParams = {
                                'position' : currentPlayer.pos,
                                'type' : 'impassable'
                            };
                            this.grid.animateTile(animateFearParams);
                            break;
                        } else {
                            targetMonster.health -= 1;
                            animateAttackParams = {
                                "position" : targetMonster.pos,
                                "type" : "attack",
                                "attacker" : currentPlayer.type
                            };
                            animateDeathParams = {
                                "position" : targetMonster.pos,
                                "tileLayer" : ".character",
                                "type" : "image-swap",
                                "delay" : "death",
                                "addClasses" : "",
                                "removeClasses" : "character-" + targetMonster.subtype,
                                "callback" : function() {
                                    playerActions.ui.updateStatusValue({id: ".kills", value: currentPlayer.getKills()});
                                    playerActions.grid.setTileWalkable(targetMonster.pos, targetMonster.name, targetMonster.type, targetMonster.subtype);
                                    callback();
                                }
                            };
                            if (targetMonster.health < 1) {
                                if (targetMonster.subtype === 'elder') {
                                    playerActions.audio.playSoundEffect(['death-elder']);
                                }
                                if (targetMonster.questGoal && this._checkCurrentQuest(currentPlayer, targetMonster.questName, targetMonster.name)) {
                                    playerActions.handleQuest(targetMonster.name);
                                }
                                Game.helpers.killObject(this.monsters, monsterNum);
                                playerActions.dungeon.updateMonsterNumForLevel(currentPlayer.currentLevel);
                                currentPlayer.updateKills();
                                animateAttackParams.callback = function() {
                                    playerActions.grid.animateTile(animateDeathParams);
                                };
                            } else {
                                animateAttackParams.callback = callback;
                            }
                            this.grid.animateTile(animateAttackParams);
                            break;
                        }
                    }
                }
            }
        }
    }

    _checkCurrentQuest(player, questName, targetToCheck) {
        let result = false;

        if (player.quests.currentQuest === questName && Game.quests[questName].goals.target === targetToCheck)
            result = true;
        return result;
    }

    /**
     * function handleQuest
     * Called when an item is acquired or monster killed or some other condition met that matches a current quest goal,
     * and then determines what goal has been met and if quest is complete.
     * Called by: player-actions-class.pickupItem, player-actions-class.playerAttack
     * @param questGoal : string
     */

    handleQuest(questGoal) {
        let player = this.players.player1,
            currentQuest = player.quests.currentQuest,
            updatedQuestInfo = {};

        if ((Game.quests[currentQuest].goals.action === 'Acquire' && Game.quests[currentQuest].goals.target === questGoal && player.inventory.Items.includes(questGoal)) ||
            (Game.quests[currentQuest].goals.action === 'Kill' && Game.quests[currentQuest].goals.target === questGoal))
        {
            player.quests.completedQuests.push(currentQuest);
            player.quests.currentQuest = Game.quests[currentQuest].nextQuest || null;
            updatedQuestInfo = {
                'currentQuest' : player.quests.currentQuest,
                'completedQuests' : player.quests.completedQuests
            };
            this.ui.updateQuestPanelInfo(updatedQuestInfo);
            this.ui.highlightButton('#pc-button-quests');
        }
    }
}