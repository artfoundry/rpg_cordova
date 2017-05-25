/**
 * Created by David on 2/3/17.
 */

class PlayerActions {
    constructor(dungeon, ui, players, monsters, audio) {
        this.grid = dungeon.levels[0];
        this.ui = ui;
        this.players = players;
        this.monsters = monsters;
        this.audio = audio;
    }

    /**
     * function movePlayer
     * Moves player character to newTile
     * Parameters:
     * - params: Object sent by TurnController containing player object and callback under "walkable" key
     * - newTile: jQuery object of tile to which player is moving
     */
    movePlayer(params, newTile) {
        let player = this.players[params.player],
            currentPos = player.pos,
            currentRow = player.row,
            currentCol = player.col,
            newTilePos = newTile.id,
            callback = params.callback;

        if ((newTilePos === (PlayerActions._getRightTileId(currentRow, currentCol))) ||
            (newTilePos === (PlayerActions._getLeftTileId(currentRow, currentCol))) ||
            (newTilePos === (PlayerActions._getBottomTileId(currentRow, currentCol))) ||
            (newTilePos === (PlayerActions._getTopTileId(currentRow, currentCol))) ||
            (newTilePos === (PlayerActions._getTopRightTileId(currentRow, currentCol))) ||
            (newTilePos === (PlayerActions._getTopLeftTileId(currentRow, currentCol))) ||
            (newTilePos === (PlayerActions._getBottomRightTileId(currentRow, currentCol))) ||
            (newTilePos === (PlayerActions._getBottomLeftTileId(currentRow, currentCol)))
        ) {
            player.setPlayer(currentPos, newTilePos, callback);
        }
    }

    pickUpItem(params, targetTile) {
        let player = this.players[params.player],
            $targetTile = $(targetTile),
            itemType = $targetTile.data('itemType'),
            itemName = $targetTile.data('itemName'),
            questName = $targetTile.data('questName');

        player.inventory.Items.push(itemName);
        this.ui.updateInventoryInfo(player.inventory);

        if (itemType === 'questItems' && this._checkCurrentQuest(player, questName, itemName))
            this.handleQuest(itemName);
        this.grid.setTileWalkable(targetTile.id, itemName, 'item', itemType);
        this.grid.changeTileImg(targetTile.id, 'content-trans', 'content-' + itemName);
    }

    /**
     * function playerAttack
     * For registering an attack by a monster on a player or vice versa
     * @param targetTile - jquery element target of attack
     * @param params - object in which targets key contains list of game characters, either players or monsters
     * @private
     */
    playerAttack(params, targetTile) {
        let playerActions = this,
            monsterNum,
            nearbyMonsterList,
            targetLoc,
            targetMonster,
            currentPlayer = playerActions.players[params.player],
            callback = params.callback,
            animateAttackParams,
            animateDeathParams;

        for (monsterNum in this.monsters) {
            if (Object.prototype.hasOwnProperty.call(this.monsters, monsterNum)) {
                targetMonster = this.monsters[monsterNum];
                if (targetMonster.pos === targetTile.id) {
                    targetLoc = $('#' + targetMonster.pos)[0];
                    // check if there are actually monsters nearby
                    nearbyMonsterList = Game.helpers.checkForNearbyCharacters(currentPlayer, 'monster', 1);
                    // if attack target matches monster in list of nearby monsters, then we have our target
                    if (nearbyMonsterList.indexOf(targetLoc) !== -1) {
                        targetMonster.health -= 1;
                        animateAttackParams = {
                            "position" : targetMonster.pos,
                            "type" : "attack",
                            "attacker" : currentPlayer.type
                        };
                        animateDeathParams = {
                            "position" : targetMonster.pos,
                            "type" : "image-swap",
                            "delay" : "death",
                            "addClasses" : "content-trans",
                            "removeClasses" : "content-" + targetMonster.subtype,
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

    _checkCurrentQuest(player, questName, targetToCheck) {
        let result = false;

        if (player.quests.currentQuest === questName && QUESTS[questName].goals.target === targetToCheck)
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

        if ((Quests[currentQuest].goals.action === 'Acquire' && QUESTS[currentQuest].goals.target === questGoal && player.inventory.Items.includes(questGoal)) ||
            (Quests[currentQuest].goals.action === 'Kill' && QUESTS[currentQuest].goals.target === questGoal))
        {
            player.quests.completedQuests.push(currentQuest);
            player.quests.currentQuest = QUESTS[currentQuest].nextQuest || null;
            updatedQuestInfo = {
                'currentQuest' : player.quests.currentQuest,
                'completedQuests' : player.quests.completedQuests
            };
            this.ui.updateQuestPanelInfo(updatedQuestInfo);
        }
    }

    static _getTopTileId(row, col) { return 'row' + (row - 1) + 'col' + col; }
    static _getBottomTileId(row, col) { return 'row' + (row + 1) + 'col' + col; }
    static _getLeftTileId(row, col) { return 'row' + row + 'col' + (col - 1); }
    static _getRightTileId(row, col) { return 'row' + row + 'col' + (col + 1); }
    static _getTopLeftTileId(row, col) { return 'row' + (row - 1) + 'col' + (col - 1); }
    static _getTopRightTileId(row, col) { return 'row' + (row - 1) + 'col' + (col + 1); }
    static _getBottomLeftTileId(row, col) { return 'row' + (row + 1) + 'col' + (col - 1); }
    static _getBottomRightTileId(row, col) { return 'row' + (row + 1) + 'col' + (col + 1); }
}