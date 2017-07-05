/**
 * Created by David on 2/3/17.
 */

class MonsterActions {
    constructor(dungeon, ui, players, monsters, audio) {
        this.grid = dungeon.grid;
        this.ui = ui;
        this.players = players;
        this.monsters = monsters;
        this.audio = audio;
        this.monsterCount = Object.keys(this.monsters).length;
    }

    moveMonsters(getIsGameOverCallback, setIsGameOverCallback) {
        let currentMonster,
            minionAttacked,
            nearbyPlayerTiles = [],
            monsterActions = this,
            newMinion,
            elderSpawnCallback = function() {
                if ($('#' + this.oldPos).hasClass('walkable')) {
                    newMinion = monsterActions.addNewMinion(this);
                    monsterActions._affectPlayerSanity(newMinion, setIsGameOverCallback);
                }
            };

        for (let monster in this.monsters) {
            minionAttacked = false;

            if (getIsGameOverCallback())
                return;
            else if (this.monsters.hasOwnProperty(monster)) {
                currentMonster = this.monsters[monster];
                nearbyPlayerTiles = Game.helpers.checkForNearbyCharacters(currentMonster, 'player', 1, this.grid.gridWidth, this.grid.gridHeight);
                if (currentMonster.name === 'Elder') {
                    currentMonster.saveCurrentPos();
                } else if (nearbyPlayerTiles) {
                    this._monsterAttack(nearbyPlayerTiles[0], setIsGameOverCallback);
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
                this._affectPlayerSanity(currentMonster, setIsGameOverCallback);
            }
        }
    }

    addNewMinion(currentElderMonster) {
        let newMinion = currentElderMonster.spawn(),
            newMinionNum;

        this.monsterCount += 1;
        newMinionNum = newMinion.subtype + this.monsterCount;
        this.monsters[newMinionNum] = newMinion;
        this.monsters[newMinionNum].initialize();
        return this.monsters[newMinionNum];
    }

    _affectPlayerSanity(currentMonster, setIsGameOverCallback) {
        let nearbyPlayers = Game.helpers.checkForNearbyCharacters(currentMonster, 'player', 1, this.grid.gridWidth, this.grid.gridHeight),
            fearValue = 0,
            sanityPercentage = 0;

        if (nearbyPlayers) {
            for (let playerTile in nearbyPlayers) {
                if (nearbyPlayers.hasOwnProperty(playerTile)) {
                    for (let player in this.players) {
                        if (this.players.hasOwnProperty(player) && $(nearbyPlayers[playerTile]).hasClass(this.players[player].name)) {
                            this.players[player].sanity -= 1;
                            fearValue = (this.players[player].maxSanity - this.players[player].sanity) / this.players[player].maxSanity;
                            this.ui.showFearEffect(fearValue);
                            if (this.players[player].sanity === 0) {
                                this.audio.playSoundEffect(['human-insane']);
                                setIsGameOverCallback();
                            }
                        }
                    }
                }
            }
            sanityPercentage = Math.round((this.players.player1.sanity / this.players.player1.maxSanity) * 100);
            this.ui.updateStatusValue({'id' : '.pc-sanity', 'value' : sanityPercentage});
        }
    }

    /*********************
     * function monsterAttack
     * For registering an attack by a monster on a player
     * @param targetTile - jquery element target of attack
     * @param setIsGameOverCallback - turnControl function for setting isGameOver flag
     ********************/
    _monsterAttack(targetTile, setIsGameOverCallback) {
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
                                monsterActions.grid.changeTileImg(targetPlayer.pos, '.character', '', 'character-player');
                                setIsGameOverCallback();
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
