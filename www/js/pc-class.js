/**
 * Created by dsmarkowitz on 11/22/16.
 *
 * Creates player characters and includes functions for:
 * private
 * - setting character position
 * - determining values of tiles surrounding character
 * - drawing fog around characters
 *
 * public
 * - moving
 */

class PlayerCharacter {
    constructor(gridOptions) {
        this.gridWidth = gridOptions.width;
        this.gridHeight = gridOptions.height;
        this.playerPos = gridOptions.playerStart;
        this.playerRow = 0;
        this.playerCol = 0;
        this.playerTileIdColIndex = 0;
        this.lightRadius = 2;
        // radius x = 2x + 1 sqs
        // 0 = 1x1 sqs
        // 1 = 3x3 sqs
        // 2 = 5x5 sqs
        // 3 = 7x7 sqs
    }

    initialize() {
        this._setPlayerTileIdColIndex(this.playerPos)
        this._setPlayer(this.playerPos);
        this._setFog(this.playerPos);
    }

    topTile(row, col) { return 'row' + (row - 1) + 'col' + col; }
    bottomTile(row, col) { return 'row' + (row + 1) + 'col' + col; }
    leftTile(row, col) { return 'row' + row + 'col' + (col - 1); }
    rightTile(row, col) { return 'row' + row + 'col' + (col + 1); }
    tlTile(row, col) { return 'row' + (row - 1) + 'col' + (col - 1); }
    trTile(row, col) { return 'row' + (row - 1) + 'col' + (col + 1); }
    blTile(row, col) { return 'row' + (row + 1) + 'col' + (col - 1); }
    brTile(row, col) { return 'row' + (row + 1) + 'col' + (col + 1); }

    /*
     * _findSurroundingTiles()
     * Finds all tiles in a given radius from the player tile, no farther, no closer, but ignores tiles that are out of the grid
     */

    _findSurroundingTiles(centerRow, centerCol, searchRadius) {
        var firstRow = centerRow - searchRadius,
            firstCol = centerCol - searchRadius,
            lastRow = centerRow + searchRadius,
            lastCol = centerCol + searchRadius,
            tiles = $(),
            tileToAdd = '';

        for(let r = firstRow; r <= lastRow; r++) {
            // if on the first or last row, and that row is inside the grid...
            if ((r === firstRow && firstRow >= 1) || (r === lastRow && lastRow <= this.gridHeight)){
                // ...then add all tiles for that row (as long as the tile is inside the grid as well
                for(let c = firstCol; c <= lastCol; c++) {
                    if (c >= 1 && c <= this.gridWidth) {
                        tileToAdd = 'row' + r + 'col' + c;
                        tiles = tiles.add($('#' + tileToAdd));
                    }
                }
            } else {
                // add the left and right tiles for the middle rows as long as their inside the grid
                if (r >= 1 && r <= this.gridHeight) {
                    if (firstCol >= 1) {
                        tileToAdd = 'row' + r + 'col' + firstCol;
                        tiles = tiles.add($('#' + tileToAdd));
                    }
                    if (lastCol <= this.gridWidth) {
                        tileToAdd = 'row' + r + 'col' + lastCol;
                        tiles = tiles.add($('#' + tileToAdd));
                    }
                }
            }

        }
        return tiles;
    }

    _setPlayer(tileId) {
        $('#' + tileId).addClass('player').trigger('classChange', ['player', '<img src="img/character-color.png">']);
        this._setPlayerRowCol();
    }

    _setPlayerTileIdColIndex(tileId) {
        this.playerTileIdColIndex = tileId.indexOf('col');
    }

    _setPlayerRowCol() {
        this.playerRow = +this.playerPos.slice(3,this.playerTileIdColIndex);
        this.playerCol = +this.playerPos.slice(this.playerTileIdColIndex + 3);
    }

    _setFog(centerTile) {
        var newRow = +centerTile.slice(3,this.playerTileIdColIndex),
            newCol = +centerTile.slice(this.playerTileIdColIndex + 3),
            lightRadiusTiles,
            lightBrightness = '';

        for (let i = this.lightRadius; i >= 1; i--) {
            lightRadiusTiles = this._findSurroundingTiles(newRow, newCol, i);
            if (this.lightRadius < 3) {
                if (i === 1)
                    lightBrightness = 'light-med';
                else
                    lightBrightness = 'light-drk';
            } else {
                if (i === 1)
                    lightBrightness = 'light-brt';
                else if (i === 2)
                    lightBrightness = 'light-med';
                else
                    lightBrightness = 'light-drk';
            }
            // when moving, set previous outer light circle to darkness
            if (centerTile !== this.playerPos && i === this.lightRadius) {
                let lastLightRadius = this._findSurroundingTiles(this.playerRow, this.playerCol, i);
                lastLightRadius.removeClass(lightBrightness).addClass('light-non').trigger('classChange', ['light-non', '<img src="img/light-non.png">']);
            }
            // remove previous light class
            lightRadiusTiles.removeClass(function(index) {
                let classIndex = $(this).attr('class').indexOf('light');
                return $(this).attr('class').slice(classIndex, classIndex+9);
            });
            lightRadiusTiles.addClass(lightBrightness).trigger('classChange', [lightBrightness, '<img src="img/' + lightBrightness + '.png">']);
        }
    };

    movePlayer(newTile, player) {
        let newTilePos = newTile.id;

        if ((newTilePos === (player.rightTile(player.playerRow, player.playerCol))) ||
            (newTilePos === (player.leftTile(player.playerRow, player.playerCol))) ||
            (newTilePos === (player.bottomTile(player.playerRow, player.playerCol))) ||
            (newTilePos === (player.topTile(player.playerRow, player.playerCol))) ||
            (newTilePos === (player.trTile(player.playerRow, player.playerCol))) ||
            (newTilePos === (player.tlTile(player.playerRow, player.playerCol))) ||
            (newTilePos === (player.brTile(player.playerRow, player.playerCol))) ||
            (newTilePos === (player.blTile(player.playerRow, player.playerCol)))
        ) {
            player._setPlayerTileIdColIndex(newTilePos);
            player._setFog(newTilePos);
            $('#' + player.playerPos).removeClass('player');
            player.playerPos = newTilePos;
            player._setPlayer(newTilePos);
        }
    };
}
