/**
 * Created by David on 2/3/17.
 */

class MonsterActions {
    constructor(grid, ui, players, monsters, helpers) {
        this.grid = grid;
        this.ui = ui;
        this.players = players;
        this.monsters = monsters;
        this.helpers = helpers;
        this.monsterCount = Object.keys(this.monsters).length;
    }

    moveMonsters(getIsGameOver, setIsGameOver) {
        let newMinion = null,
            newMinionNum = "";

        for (let monster in this.monsters) {
            let minionAttacked = false;
            if (!getIsGameOver() && Object.prototype.hasOwnProperty.call(this.monsters, monster)) {
                if (this.monsters[monster].name === "Elder") {
                    this.monsters[monster].saveCurrentPos();
                } else {
                    let nearbyPlayerTiles = this.helpers.checkForNearbyCharacters(this.monsters[monster], 'player');
                    if (nearbyPlayerTiles) {
                        this._monsterAttack(nearbyPlayerTiles[0], setIsGameOver);
                        minionAttacked = true;
                    }
                }
                if (!minionAttacked) {
                    this.grid.clearImg(this.monsters[monster]);
                    this.monsters[monster].randomMove();
                    if (this.monsters[monster].name === "Elder" && $('#' + this.monsters[monster].oldPos).hasClass('walkable')) {
                        newMinion = this.monsters[monster].spawn();
                    }
                }
            }
        }
        if (newMinion) {
            this.monsterCount += 1;
            newMinionNum = "monster" + this.monsterCount;
            this.monsters[newMinionNum] = newMinion;
            this.monsters[newMinionNum].name = newMinion.name + this.monsterCount;
            this.monsters[newMinionNum].initialize();
        }
    }

    /*********************
     * function monsterAttack
     * For registering an attack by a monster on a player
     * @param targetTile - jquery element target of attack
     * @param setIsGameOver - turnControl function for setting isGameOver flag
     ********************/
    _monsterAttack(targetTile, setIsGameOver) {
        let playerNum,
            targetLoc,
            targetPlayer,
            animateParams,
            monsterActions = this;

        for (playerNum in this.players) {
            if (Object.prototype.hasOwnProperty.call(this.players, playerNum)) {
                targetPlayer = this.players[playerNum];
                if (targetPlayer.pos === targetTile.id) {
                    targetLoc = $('#' + targetPlayer.pos)[0];
                    targetPlayer.health -= 1;
                    this.ui.updateValue({id: ".pc-health", value: targetPlayer.health});
                    animateParams = {
                        "targetObject" : targetPlayer,
                        "type" : "attack",
                        "callback" : function() {
                            if (targetPlayer.health < 1) {
                                monsterActions.grid.clearImg(targetPlayer);
                                monsterActions.helpers.killObject(monsterActions.players, playerNum);
                                setIsGameOver();
                            }
                        }
                    };
                    this.grid.animateTile(null, animateParams);
                    break;
                }
            }
        }
    }
}
