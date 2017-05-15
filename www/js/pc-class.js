/**
 * Created by dsmarkowitz on 11/22/16.
 *
 * Creates player characters and includes functions for:
 * - setting character position
 * - drawing lighting around characters
 */

class PlayerCharacter {
    constructor(playerOptions, dungeon) {
        this.grid = dungeon.levels[0];
        this.pos = playerOptions.startPos;
        this.name = playerOptions.name;
        this.type = playerOptions.type;
        this.subtype = playerOptions.subtype;
        this.health = playerOptions.health;
        this.row = 0;
        this.col = 0;
        this.kills = 0;
        this.elderKilled = false;
        this.quests = {
            'currentQuests'      : Quests.elderSign,
            'completedQuests'    : null
        };
        this.inventory = {
            'armor'     : {},
            'items'     : {},
            'weapons'   : {}
        };
    }

    initialize() {
        this.setPlayer(this.pos);
        this.grid.setLighting(this.pos);
        this.resetKills();
    }

    resetKills() {
        this.kills = 0;
    }

    updateKills() {
        this.kills += 1;
    }

    getKills() {
        return this.kills;
    }

    setPlayer(currentPos, newPos, callback) {
        let player = this,
            newPosId = newPos || currentPos,
            animateMoveParams = {
                "position" : currentPos,
                "destinationId" : newPosId,
                "type" : "move",
                "callback" : function() {
                    player.grid.changeTileImg(newPosId, 'content-' + player.type, 'content-trans');
                    player.grid.changeTileImg(currentPos, 'content-trans', 'content-' + player.type);
                    if (callback)
                        callback();
                }
            };

        if (currentPos !== newPosId) {
            player.grid.setTileWalkable(currentPos, player.name, player.type, player.subtype);
            player.grid.changeTileSetting(newPosId, player.name, player.type, player.subtype);
            player.grid.animateTile(animateMoveParams);
            player.grid.setLighting(newPosId, currentPos);
            player.pos = newPosId;
        } else {
            player.grid.changeTileImg(newPosId, 'content-' + player.type, 'content-trans');
            player.grid.changeTileSetting(newPosId, player.name, player.type, player.subtype);
        }

        player.row = Game.helpers.getRowCol(newPosId).row;
        player.col = Game.helpers.getRowCol(newPosId).col;
    }
}
