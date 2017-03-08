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
    movePlayer(newTile, params) {
        let player = this.players[params.player],
            currentPos = player.pos,
            currentRow = player.row,
            currentCol = player.col,
            newTilePos = newTile.id,
            callback = params.callback;

        if ((newTilePos === (PlayerActions._rightTile(currentRow, currentCol))) ||
            (newTilePos === (PlayerActions._leftTile(currentRow, currentCol))) ||
            (newTilePos === (PlayerActions._bottomTile(currentRow, currentCol))) ||
            (newTilePos === (PlayerActions._topTile(currentRow, currentCol))) ||
            (newTilePos === (PlayerActions._trTile(currentRow, currentCol))) ||
            (newTilePos === (PlayerActions._tlTile(currentRow, currentCol))) ||
            (newTilePos === (PlayerActions._brTile(currentRow, currentCol))) ||
            (newTilePos === (PlayerActions._blTile(currentRow, currentCol)))
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
    playerAttack(targetTile, params) {
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
                    nearbyMonsterList = this.helpers.checkForNearbyCharacters(currentPlayer, 'monster');
                    // if attack target matches monster in list of nearby monsters, then we have our target
                    if (nearbyMonsterList.indexOf(targetLoc) !== -1) {
                        targetMonster.health -= 1;
                        animateAttackParams = {
                            "position" : targetMonster.pos,
                            "type" : "attack"
                        };
                        animateDeathParams = {
                            "position" : targetMonster.pos,
                            "type" : "fadeOut",
                            "callback" : function() {
                                playerActions.ui.updateValue({id: ".kills", value: currentPlayer.getKills()});
                                playerActions.grid.setTileWalkable(targetMonster.pos, targetMonster.name, targetMonster.type);
                                playerActions.grid.changeTileImg(targetMonster.pos, 'trans');
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

    static _topTile(row, col) { return 'row' + (row - 1) + 'col' + col; }
    static _bottomTile(row, col) { return 'row' + (row + 1) + 'col' + col; }
    static _leftTile(row, col) { return 'row' + row + 'col' + (col - 1); }
    static _rightTile(row, col) { return 'row' + row + 'col' + (col + 1); }
    static _tlTile(row, col) { return 'row' + (row - 1) + 'col' + (col - 1); }
    static _trTile(row, col) { return 'row' + (row - 1) + 'col' + (col + 1); }
    static _blTile(row, col) { return 'row' + (row + 1) + 'col' + (col - 1); }
    static _brTile(row, col) { return 'row' + (row + 1) + 'col' + (col + 1); }
}