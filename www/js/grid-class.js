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
            id = '',
            blackTile = '<figure id="" class="tile light-non"><img src="img/light-non.png"></figure>';

        $('.grid').prepend(function(){
            for(var rowNum=1; rowNum <= self.gridHeight; rowNum++) {
                markup += '<div class="row">';
                for(var colNum=1; colNum <= self.gridWidth; colNum++) {
                    id = "row" + rowNum + "col" + colNum;
                    markup += self._insertString(blackTile, id, blackTile.indexOf('" class'));
                }
                markup += '</div>';
            }
            return markup;
        });
    }

    updateTileImage(e, tileClass, image) {
        $('.' + tileClass + '>img').replaceWith(image);
    }
}
