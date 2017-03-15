/**
 * Created by dsmarkowitz on 11/22/16.
 *
 * Creates player characters and includes functions for:
 * - setting character position
 * - drawing lighting around characters
 */

class PlayerCharacter {
    constructor(playerOptions, grid, helpers) {
        this.grid = grid;
        this.helpers = helpers;
        this.pos = playerOptions.startPos;
        this.name = playerOptions.name;
        this.type = playerOptions.type;
        this.health = playerOptions.health;
        this.row = 0;
        this.col = 0;
        this.lightRadius = 2; // not needed unless we implement changeable light radii
        this.kills = 0;
        // radius x = 2x + 1 sqs
        // 0 = 1x1 sqs
        // 1 = 3x3 sqs
        // 2 = 5x5 sqs
        // 3 = 7x7 sqs
    }

    initialize() {
        this.setPlayer(this.pos);
        this.setLighting(this.pos);
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
                    player.grid.changeTileImg(newPosId, player.type);
                    player.grid.changeTileImg(currentPos, "trans");
                    player.setLighting(newPosId, currentPos);
                    if (callback)
                        callback();
                }
            };

        if (currentPos !== newPosId) {
            player.grid.setTileWalkable(currentPos, player.name, player.type);
            player.grid.changeTileSetting(newPosId, player.name, player.type);
            player.grid.animateTile(animateMoveParams);
            player.pos = newPosId;
        } else {
            player.grid.changeTileImg(newPosId, player.type);
            player.grid.changeTileSetting(newPosId, player.name, player.type);
        }

        player.row = this.helpers.getRowCol(newPosId).row;
        player.col = this.helpers.getRowCol(newPosId).col;
    }

    setLighting(centerTile, oldPos) {
        let $oldCenterTile = $('#' + oldPos) || $('#' + this.pos),
            $newCenterTile = $('#' + centerTile);

        this._removeLighting($oldCenterTile, 'light light-ctr', 'light-img-radius');
        this._addLighting($oldCenterTile, '', 'light-img-trans');
        this._removeLighting($newCenterTile, '', 'light-img-trans');
        this._addLighting($newCenterTile, 'light light-ctr', 'light-img-radius');
    }

    _addLighting($tile, lightClass, lightImgClass) {
        $tile.addClass(lightClass);
        $tile.children('.light-img').addClass(lightImgClass);
    }

    _removeLighting($tile, lightClass, lightImgClass) {
        $tile.removeClass(lightClass);
        $tile.children('.light-img').removeClass(lightImgClass);
    }
}
