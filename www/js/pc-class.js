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
        this.health = playerOptions.health;
        this.row = 0;
        this.col = 0;
        this.playerTileIdColIndex = 0;
        this.lightRadius = 2;
        // radius x = 2x + 1 sqs
        // 0 = 1x1 sqs
        // 1 = 3x3 sqs
        // 2 = 5x5 sqs
        // 3 = 7x7 sqs
    }

    initialize() {
        this._setPlayerTileIdColIndex(this.pos);
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
        if (oldTileId)
            $('#' + oldTileId).removeClass('player impassable');

        $('#' + newTileId)
            .addClass(this.name + ' player impassable')
            .trigger('tileChange', ['player', '<img class="content" src="img/character-color.png">']);

        this._setPlayerRowCol();
    }

    _setPlayerTileIdColIndex(tileId) {
        this.playerTileIdColIndex = tileId.indexOf('col');
    }

    _setPlayerRowCol() {
        this.row = +this.pos.slice(3,this.playerTileIdColIndex);
        this.col = +this.pos.slice(this.playerTileIdColIndex + 3);
    }

    _setLighting(centerTile) {
        let newRow = +centerTile.slice(3,this.playerTileIdColIndex),
            newCol = +centerTile.slice(this.playerTileIdColIndex + 3),
            $lightRadiusTiles,
            lightBrightness = '',
            $centerTile = $('#' + centerTile),
            classIndex = $centerTile.attr('class').indexOf('light'),
            centerLighting = $centerTile.attr('class').slice(classIndex, classIndex + 10);

        $centerTile
            .removeClass(centerLighting)
            .addClass('light-wht')
            .trigger('lightChange', ['light-wht', '<img class="light-img" src="img/light-wht.png">']);

        for (let i = this.lightRadius; i >= 1; i--) {
            $lightRadiusTiles = this.helpers.findSurroundingTiles(newRow, newCol, i);
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
            if (centerTile !== this.pos && i === this.lightRadius) {
                let $lastLightRadius = this.helpers.findSurroundingTiles(this.row, this.col, i);
                $lastLightRadius
                    .removeClass(lightBrightness)
                    .addClass('light-non')
                    .trigger('lightChange', ['light-non', '<img class="light-img" src="img/light-non.png">']);
            }
            // remove previous light class
            $lightRadiusTiles.removeClass(function(index) {
                let classIndex = $(this).attr('class').indexOf('light');
                return $(this).attr('class').slice(classIndex, classIndex+9);
            });
            $lightRadiusTiles
                .addClass(lightBrightness)
                .trigger('lightChange', [lightBrightness, '<img class="light-img" src="img/' + lightBrightness + '.png">']);
        }
    }

    clearLighting() {
        $('.light-drk, .light-med, .light-brt, .light-wht')
            .removeClass('light-drk')
            .removeClass('light-med')
            .removeClass('light-brt')
            .removeClass('light-wht')
            .addClass('light-non')
            .trigger('lightChange', ['light-non', '<img class="light-img" src="img/light-non.png">']);
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
            player._setPlayerTileIdColIndex(newTilePos);
            $('#' + currentPos).trigger('tileChange', ['player', '<img class="content" src="img/trans.png">']);
            player._setLighting(newTilePos);
            player.pos = newTilePos;
            player._setPlayer(newTilePos, currentPos);
            callback();
        }
    }
}
