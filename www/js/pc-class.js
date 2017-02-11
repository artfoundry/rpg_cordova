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
        this.health = playerOptions.health;
        this.row = 0;
        this.col = 0;
        this.lightRadius = 2;
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

    setPlayer(newTileId, oldTileId) {
        let player = this,
            animatefadeOutParams = {
                "targetObject" : player,
                "type" : "fadeOut",
                "callback" : function() {
                    $('#' + oldTileId + ' .content').attr('class', 'content content-trans');
                    $('#' + newTileId + ' .content').attr('class', 'content content-player');
                    player.grid.animateTile(null, animatefadeInParams);
                }
            },
            animatefadeInParams = {
                "targetObject" : player,
                "type" : "fadeIn"
            };

        if (oldTileId) {
            $('#' + oldTileId).addClass('walkable').removeClass(this.name + ' player impassable');
            this.grid.animateTile(null, animatefadeOutParams);
        } else {
            $('#' + newTileId).addClass(this.name + ' player impassable').removeClass('walkable');
            $('#' + newTileId + ' .content').attr('class', 'content content-player');
            this.grid.animateTile(null, animatefadeInParams);
        }

        this.row = this.helpers.setRowCol(newTileId).row;
        this.col = this.helpers.setRowCol(newTileId).col;
    }

    setLighting(centerTile) {
        let playerTileIdColIndex = centerTile.indexOf('col'),
            newRow = +centerTile.slice(3, playerTileIdColIndex),
            newCol = +centerTile.slice(playerTileIdColIndex + 3),
            $lightRadiusTiles,
            $lastLightRadius,
            $oldCenterTile = $('#' + this.pos),
            $newCenterTile = $('#' + centerTile);

        this._removeLighting($oldCenterTile, 'light-ctr', 'light-img-radius');

        for (let i = this.lightRadius; i >= 1; i--) {
            $lightRadiusTiles = this.helpers.findSurroundingTiles(newRow, newCol, i);

            // when moving, set previous outer light circle to darkness
            if (centerTile !== this.pos && i === this.lightRadius) {
                $lastLightRadius = this.helpers.findSurroundingTiles(this.row, this.col, i);
                this._removeLighting($lastLightRadius, 'light', 'light-img-trans');
                this._addLighting($lastLightRadius, 'light-non', 'light-img-non');
            }
            this._removeLighting($lightRadiusTiles, 'light-non', 'light-img-non');
            this._addLighting($lightRadiusTiles, 'light', 'light-img-trans');
        }

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
