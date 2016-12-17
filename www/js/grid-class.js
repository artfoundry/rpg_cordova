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
            blackGroundTile = '<figure id="" class="tile tile-ground-dungeon walkable light-non"><img class="light-img" src="img/light-non.png"><img class="content" src="img/trans.png"></figure>',
            borderTile = '<figure id="" class="tile tile-wall impassable"><img class="content" src="img/trans.png"></figure>';

        $('.grid').prepend(() => {
            for(let rowNum=0; rowNum <= self.gridHeight + 1; rowNum++) {
                markup += '<div class="row">';
                for(let colNum=0; colNum <= self.gridWidth + 1; colNum++) {
                    id = "row" + rowNum + "col" + colNum;
                    if (rowNum === 0 || rowNum === self.gridHeight + 1 || colNum === 0 || colNum === self.gridWidth + 1) {
                        markup += self._insertString(borderTile, id, borderTile.indexOf('id=') + 4);
                    } else {
                        markup += self._insertString(blackGroundTile, id, blackGroundTile.indexOf('id=') + 4);
                    }
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
