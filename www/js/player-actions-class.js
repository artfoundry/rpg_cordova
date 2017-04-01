/**
 * Created by David on 2/3/17.
 */

class PlayerActions {
    constructor(grid, ui, players, monsters, helpers) {
        this.grid = grid;
        this.ui = ui;
        this.players = players;
        this.monsters = monsters;
        this.helpers = helpers;
    }

    /**
     * function movePlayer
     * Moves player character to newTile
     * Parameters:
     * - params: Object sent by TurnController containing player object and callback under "walkable" key
     * - newTile: String of tile's id in the format "row#col#"
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
                    nearbyMonsterList = this.helpers.checkForNearbyCharacters(currentPlayer, 'monster', 1);
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
                            "removeClasses" : "content-" + targetMonster.type,
                            "callback" : function() {
                                playerActions.ui.updateStatusValue({id: ".kills", value: currentPlayer.getKills()});
                                playerActions.grid.setTileWalkable(targetMonster.pos, targetMonster.name, targetMonster.type, targetMonster.subtype);
                                callback();
                            }
                        };
                        if (targetMonster.health < 1) {
                            this.helpers.killObject(this.monsters, monsterNum);
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

    static _getTopTileId(row, col) { return 'row' + (row - 1) + 'col' + col; }
    static _getBottomTileId(row, col) { return 'row' + (row + 1) + 'col' + col; }
    static _getLeftTileId(row, col) { return 'row' + row + 'col' + (col - 1); }
    static _getRightTileId(row, col) { return 'row' + row + 'col' + (col + 1); }
    static _getTopLeftTileId(row, col) { return 'row' + (row - 1) + 'col' + (col - 1); }
    static _getTopRightTileId(row, col) { return 'row' + (row - 1) + 'col' + (col + 1); }
    static _getBottomLeftTileId(row, col) { return 'row' + (row + 1) + 'col' + (col - 1); }
    static _getBottomRightTileId(row, col) { return 'row' + (row + 1) + 'col' + (col + 1); }
}