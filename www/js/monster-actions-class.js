/**
 * Created by David on 2/3/17.
 */

class MonsterActions {
    constructor(grid, ui, players, monsters, helpers, audio) {
        this.grid = grid;
        this.ui = ui;
        this.players = players;
        this.monsters = monsters;
        this.helpers = helpers;
        this.audio = audio;
        this.monsterCount = Object.keys(this.monsters).length;
    }

    moveMonsters(isGameOver, setIsGameOver) {
        let currentMonster,
            minionAttacked,
            nearbyPlayerTiles = [],
            monsterActions = this,
            elderSpawnCallback = function() {
                if ($('#' + this.oldPos).hasClass('walkable')) {
                    monsterActions.addNewMinion(this);
                }
            };

        for (let monster in this.monsters) {
            minionAttacked = false;

            if (isGameOver())
                return;
            else if (Object.prototype.hasOwnProperty.call(this.monsters, monster)) {
                currentMonster = this.monsters[monster];
                nearbyPlayerTiles = this.helpers.checkForNearbyCharacters(currentMonster, 'player', 1);
                if (currentMonster.name === 'Elder') {
                    currentMonster.saveCurrentPos();
                } else if (nearbyPlayerTiles) {
                    this._monsterAttack(nearbyPlayerTiles[0], setIsGameOver);
                    minionAttacked = true;
                }
                if (!minionAttacked) {
                    if (currentMonster.name === 'Elder') {
                        if (nearbyPlayerTiles && Game.gameSettings.difficulty === 'hard')
                            currentMonster.avoidPlayer(nearbyPlayerTiles[0], elderSpawnCallback.bind(currentMonster));
                        else {
                            currentMonster.randomMove(elderSpawnCallback.bind(currentMonster));
                        }
                    } else if (Game.gameSettings.difficulty === 'easy') {
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
                    this.ui.updateStatusValue({id: ".pc-health", value: targetPlayer.health});
                    animateParams = {
                        "position" : targetPlayer.pos,
                        "type" : "attack",
                        "callback" : function() {
                            if (targetPlayer.health < 1) {
                                monsterActions.audio.playSoundEffect(['death-human']);
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
