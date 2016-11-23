/**
 * Created by dsmarkowitz on 11/22/16.
 *
 * Creates and updates the game grid of tiles
 */

class Grid {
    constructor(gridOptions) {
        this.gridHeight = gridOptions.height;
        this.gridWidth = gridOptions.width;
    }

    _insertString(baseString, toInsert, position) {
        return baseString.slice(0, position) + toInsert + baseString.slice(position);
    }

    drawGrid() {
        var self = this,
            markup = '',
            cellNum = 0,
            blackTile = '<figure id="tile-" class="tile darkestFog"><img src="img/black.png"></figure>';

        $('.grid').prepend(function(){
            for(var r=1; r <= self.gridHeight; r++) {
                markup += '<div id="row-' + r + '" class="row">';
                for(var c=1; c <= self.gridWidth; c++) {
                    cellNum = ((r - 1) * self.gridWidth) + c;
                    markup += self._insertString(blackTile, cellNum, blackTile.indexOf('" class'));
                }
                markup += '</div>';
            }
            return markup;
        });
    }

    updateTileImage(e, tileClass, image) {
        $(tileClass + '>img').replaceWith(image);
    }
}
