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
        let self = this,
            markup = '',
            id = '',
            blackTile = '<figure id="" class="tile light-non"><img class="light-img" src="img/light-non.png"><img class="content" src="img/trans.png"></figure>';

        $('.grid').prepend(() => {
            for(let rowNum=1; rowNum <= self.gridHeight; rowNum++) {
                markup += '<div class="row">';
                for(let colNum=1; colNum <= self.gridWidth; colNum++) {
                    id = "row" + rowNum + "col" + colNum;
                    markup += self._insertString(blackTile, id, blackTile.indexOf('" class'));
                }
                markup += '</div>';
            }
            return markup;
        });
    }

    updateTileImage(e, tileClass, image) {
        $('.' + tileClass + '>img.content').replaceWith(image);
    }

    updateLightingImage(e, tileClass, image) {
        $('.' + tileClass + '>img.light-img').replaceWith(image);
    }
}
