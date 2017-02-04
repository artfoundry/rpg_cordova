/**
 * Created by David on 2/3/17.
 */

class CommonActions {
    constructor(helpers) {
        this.helpers = helpers;
    }

    moveMonsters() {
        let newMinion = null,
            newMinionNum = "",
            attackParams = {};

        for (let monster in this.monsters) {
            let minionAttacked = false;
            if (Object.prototype.hasOwnProperty.call(this.monsters, monster)) {
                if (this.monsters[monster].name === "Queen") {
                    this.monsters[monster].saveCurrentPos();
                } else {
                    let nearbyPlayerTiles = this._checkForNearbyCharacters(this.monsters[monster], 'player');
                    if (nearbyPlayerTiles) {
                        attackParams = { "targets" : this.players };
                        this.attack(nearbyPlayerTiles[0], attackParams);
                        minionAttacked = true;
                    }
                }
                if (!minionAttacked) {
                    this.grid.clearImg(this.monsters[monster]);
                    this.monsters[monster].randomMove();
                    if (this.monsters[monster].name === "Queen" && $('#' + this.monsters[monster].oldPos).hasClass('walkable')) {
                        newMinion = this.monsters[monster].spawn();
                    }
                }
            }
        }
        if (newMinion) {
            this.monsterCount += 1;
            newMinionNum = "monster" + this.monsterCount;
            this.monsters[newMinionNum] = newMinion;
            this.monsters[newMinionNum].name = "Minion" + this.monsterCount;
            this.monsters[newMinionNum].initialize();
        }
    }

    /**
     * function attack
     * For registering an attack by a monster on a player or vice versa
     * @param targetTile - jquery element target of attack
     * @param params - object in which targets key contains list of game characters, either players or monsters
     * @private
     */
    attack(targetTile, params) {
        let characterList = params.targets,
            characterNum,
            nearbyMonsterList,
            targetLoc,
            controller = this,
            animateParams;

        for (characterNum in characterList) {
            if (Object.prototype.hasOwnProperty.call(characterList, characterNum)) {
                if (characterList[characterNum].pos === targetTile.id) {
                    targetLoc = $('#' + characterList[characterNum].pos)[0];
                    // if player is attacking, check if there are actually monsters nearby
                    if (params.player) {
                        nearbyMonsterList = this._checkForNearbyCharacters(params.player, 'monster');
                    }
                    // if monster is attacking or if player is attacking and attack target matches monster in list of nearby monsters, then we have our target
                    if (!params.player || (nearbyMonsterList.indexOf(targetLoc) !== -1)) {
                        this.targetCharacterObj = characterList[characterNum];
                        break;
                    }
                }
            }
        }

        this._updateHealth();
        if (this.targetCharacterObj.health < 1) {
            this._removeCharacter({objects: characterList, index: characterNum});
        }

        animateParams = {
            "targetObject" : this.targetCharacterObj,
            "type" : "attack"
        };
        if (controller.isPlayerTurn) {
            animateParams.callback = function() {
                controller._checkNclearImg(controller.targetCharacterObj);
                controller.deferredCBs.notify(); //call the progress callback to end the turn
            };
        } else {
            if (controller.gameOver) {
                animateParams.callback = function () {
                    controller._checkNclearImg(controller.targetCharacterObj);
                    controller.deferredCBs.resolve(); //bypass progress callback and call done callback which ends game
                };
            }
        }
        this.grid.animateTile(null, animateParams);
    }


    _checkForNearbyCharacters(character, charSearchType) {
        let characterLoc = character.pos,
            colIndex = characterLoc.indexOf('col'),
            characterRow = characterLoc.slice(3, colIndex),
            characterCol = characterLoc.slice(colIndex + 3),
            $nearbyCharLoc = null,
            $surroundingTiles = this.helpers.findSurroundingTiles(characterRow, characterCol, 1);

        if ($surroundingTiles.hasClass(charSearchType)) {
            $nearbyCharLoc = $.grep($surroundingTiles, function(tile){
                return $(tile).hasClass(charSearchType);
            });
        }
        return $nearbyCharLoc;
    }

    _checkNclearImg(target) {
        if (target.health < 1) {
            this.grid.clearImg(target);
        }
    }

    _updateHealth() {
        this.targetCharacterObj.health -= 1;
        if (this.targetCharacterObj instanceof PlayerCharacter) {
            this.ui.updateValue({id: "#pc-health", value: this.targetCharacterObj.health});
        }
    }

    _removeCharacter(listParams) {
        let controller = this;

        this.helpers.killObject(listParams.objects, listParams.index);
        if (this.targetCharacterObj instanceof Monster) {
            this.ui.kills += 1;
            this.ui.updateValue({id: "#kills", value: this.ui.kills});
        }
        this.monsterCount = this.helpers.checkNumCharactersAlive(this.monsters);
        this.playerCount = this.helpers.checkNumCharactersAlive(this.players);
        if (this.playerCount === 0) {
            this.gameOver = true;
            this.deferredCBs.done(function() {
                controller._tearDownListeners();
                controller._endGame("lose");
            });
        }
    }
}