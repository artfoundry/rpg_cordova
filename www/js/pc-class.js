/**
 * Created by dsmarkowitz on 11/22/16.
 *
 * Creates player characters and includes functions for:
 * private
 * - setting character position
 * - determining ids of tiles surrounding character
 * - drawing lighting around characters
 *
 * public
 * - moving
 */

class PlayerCharacter {
    constructor(gridOptions, playerOptions, helpers) {
        this.helpers = helpers;
        this.gridWidth = gridOptions.width;
        this.gridHeight = gridOptions.height;
        this.pos = playerOptions.startPos;
        this.name = playerOptions.name;
        this.image = playerOptions.image;
        this.health = playerOptions.health;
        this.row = 0;
        this.col = 0;
        this.playerTileIdColIndex = helpers.getTileIdColIndex(this.pos);
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

    _topTile(row, col) { return 'row' + (row - 1) + 'col' + col; }
    _bottomTile(row, col) { return 'row' + (row + 1) + 'col' + col; }
    _leftTile(row, col) { return 'row' + row + 'col' + (col - 1); }
    _rightTile(row, col) { return 'row' + row + 'col' + (col + 1); }
    _tlTile(row, col) { return 'row' + (row - 1) + 'col' + (col - 1); }
    _trTile(row, col) { return 'row' + (row - 1) + 'col' + (col + 1); }
    _blTile(row, col) { return 'row' + (row + 1) + 'col' + (col - 1); }
    _brTile(row, col) { return 'row' + (row + 1) + 'col' + (col + 1); }

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
        let newRow = +centerTile.slice(3,this.playerTileIdColIndex),
            newCol = +centerTile.slice(this.playerTileIdColIndex + 3),
            $lightRadiusTiles,
            $oldCenterTile = $('#' + this.pos),
            $newCenterTile = $('#' + centerTile);

        this.removeLighting($oldCenterTile, 'light-ctr', 'light-img-radius');

        for (let i = this.lightRadius; i >= 1; i--) {
            $lightRadiusTiles = this.helpers.findSurroundingTiles(newRow, newCol, i);

            // when moving, set previous outer light circle to darkness
            if (centerTile !== this.pos && i === this.lightRadius) {
                let $lastLightRadius = this.helpers.findSurroundingTiles(this.row, this.col, i);
                this.removeLighting($lastLightRadius, 'light', 'light-img-trans');
                this.addLighting($lastLightRadius, 'light-non', 'light-img-non');
            }
            this.removeLighting($lightRadiusTiles, 'light-non', 'light-img-non');
            this.addLighting($lightRadiusTiles, 'light', 'light-img-trans');
        }

        this.removeLighting($newCenterTile, '', 'light-img-trans');
        this.addLighting($newCenterTile, 'light light-ctr', 'light-img-radius');
    }

    addLighting($tile, lightClass, lightImgClass) {
        $tile.addClass(lightClass);
        $tile.children('.light-img').addClass(lightImgClass);
    }

    removeLighting($tile, lightClass, lightImgClass) {
        $tile.removeClass(lightClass);
        $tile.children('.light-img').removeClass(lightImgClass);
    }

    /*
     * function movePlayer
     * Moves player character to newTile
     * Parameters:
     * - params: Object sent by TurnController containing player object and callback under "walkable" key
     * - newTile: String of tile's id in the format "row#col#"
     */
    movePlayer(newTile, params) {
        let player = params.player,
            currentPos = player.pos,
            currentRow = player.row,
            currentCol = player.col,
            newTilePos = newTile.id,
            callback = params.callback;

        if ((newTilePos === (player._rightTile(currentRow, currentCol))) ||
            (newTilePos === (player._leftTile(currentRow, currentCol))) ||
            (newTilePos === (player._bottomTile(currentRow, currentCol))) ||
            (newTilePos === (player._topTile(currentRow, currentCol))) ||
            (newTilePos === (player._trTile(currentRow, currentCol))) ||
            (newTilePos === (player._tlTile(currentRow, currentCol))) ||
            (newTilePos === (player._brTile(currentRow, currentCol))) ||
            (newTilePos === (player._blTile(currentRow, currentCol)))
        ) {
            player.playerTileIdColIndex = this.helpers.getTileIdColIndex(newTilePos);
            player._setLighting(newTilePos);
            player.pos = newTilePos;
            player._setPlayer(newTilePos, currentPos);
            callback();
        }
    }
}
