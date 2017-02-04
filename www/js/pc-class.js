/**
 * Created by dsmarkowitz on 11/22/16.
 *
 * Creates player characters and includes functions for:
 * - setting character position
 * - drawing lighting around characters
 */

class PlayerCharacter {
    constructor(playerOptions, helpers) {
        this.helpers = helpers;
        this.pos = playerOptions.startPos;
        this.name = playerOptions.name;
        this.image = playerOptions.image;
        this.health = playerOptions.health;
        this.row = 0;
        this.col = 0;
        this.lightRadius = 2;
        // radius x = 2x + 1 sqs
        // 0 = 1x1 sqs
        // 1 = 3x3 sqs
        // 2 = 5x5 sqs
        // 3 = 7x7 sqs
    }

    initialize() {
        this._setPlayer(this.pos);
        this._setLighting(this.pos);
    }

    _setPlayer(newTileId, oldTileId) {
        if (oldTileId) {
            $('#' + oldTileId)
                .addClass('walkable')
                .trigger('tileChange', ['player', '<img class="content" src="img/trans.png">'])
                .removeClass(this.name + ' player impassable');
        }

        $('#' + newTileId)
            .addClass(this.name + ' player impassable')
            .trigger('tileChange', ['player', '<img class="content" src="img/' + this.image + '">'])
            .removeClass('walkable');

        this.row = this.helpers.setRowCol(this.pos).row;
        this.col = this.helpers.setRowCol(this.pos).col;
    }

    _setLighting(centerTile) {
        let playerTileIdColIndex = this.pos.indexOf('col'),
            newRow = +centerTile.slice(3, playerTileIdColIndex),
            newCol = +centerTile.slice(playerTileIdColIndex + 3),
            $lightRadiusTiles,
            $oldCenterTile = $('#' + this.pos),
            $newCenterTile = $('#' + centerTile);



        this._removeLighting($oldCenterTile, 'light-ctr', 'light-img-radius');

        for (let i = this.lightRadius; i >= 1; i--) {
            $lightRadiusTiles = this.helpers.findSurroundingTiles(newRow, newCol, i);

            // when moving, set previous outer light circle to darkness
            if (centerTile !== this.pos && i === this.lightRadius) {
                let $lastLightRadius = this.helpers.findSurroundingTiles(this.row, this.col, i);
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
