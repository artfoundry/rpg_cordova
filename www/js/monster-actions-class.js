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

    moveMonsters(isGameOver, setIsGameOver) {
        let currentMonster,
            minionAttacked,
            nearbyPlayerTiles = [],
            monsterActions = this;

        for (let monster in this.monsters) {
            minionAttacked = false;

            if (isGameOver())
                return;
            else if (Object.prototype.hasOwnProperty.call(this.monsters, monster)) {
                currentMonster = this.monsters[monster];
                if (currentMonster.name === 'Elder') {
                    currentMonster.saveCurrentPos();
                } else {
                    nearbyPlayerTiles = this.helpers.checkForNearbyCharacters(currentMonster, 'player', 1);
                    if (nearbyPlayerTiles) {
                        this._monsterAttack(nearbyPlayerTiles[0], setIsGameOver);
                        minionAttacked = true;
                    }
                }
                if (!minionAttacked) {
                    if (currentMonster.name === 'Elder') {
                        currentMonster.randomMove(function() {
                            if ($('#' + this.oldPos).hasClass('walkable')) {
                                monsterActions.addNewMinion(this);
                            }
                        }.bind(currentMonster));
                    } else if (this.grid.difficulty === 'easy') {
                        currentMonster.randomMove();
                    } else {
                        currentMonster.searchForPrey(2);
                    }
                }
            }
        }
    }

    addNewMinion(currentElderMonster) {
        let newMinion = currentElderMonster.spawn(),
            newMinionNum;

        this.monsterCount += 1;
        newMinionNum = "monster" + this.monsterCount;
        this.monsters[newMinionNum] = newMinion;
        this.monsters[newMinionNum].name = newMinion.name + this.monsterCount;
        this.monsters[newMinionNum].initialize();
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
                        "position" : targetPlayer.pos,
                        "type" : "attack",
                        "callback" : function() {
                            if (targetPlayer.health < 1) {
                                monsterActions.grid.changeTileImg(targetPlayer.pos, 'content-trans', 'content-player');
                                setIsGameOver();
                            }
                        }
                    };
                    this.grid.animateTile(animateParams);
                    break;
                }
            }
        }
    }
}
