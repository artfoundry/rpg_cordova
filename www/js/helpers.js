/**
 * Created by dsmarkowitz on 12/19/16.
 *
 * Helper functions used by player and turn-control classes.
 */

/*
 * _findSurroundingTiles()
 * Finds all tiles in a given radius from the passed in center tile, no farther, no closer, but ignores tiles that are out of the grid
 */

class Helpers {
    constructor(grid) {
        this.grid = grid;
    }

    findSurroundingTiles(centerRow, centerCol, searchRadius) {
        let firstRow = centerRow - searchRadius,
            firstCol = centerCol - searchRadius,
            lastRow = centerRow + searchRadius,
            lastCol = centerCol + searchRadius,
            tiles = $(),
            tileToAdd = '';

        for(let r = firstRow; r <= lastRow; r++) {
            // if on the first or last row, and that row is inside the grid...
            if ((r === firstRow && firstRow >= 1) || (r === lastRow && lastRow <= this.grid.gridHeight)){
                // ...then add all tiles for that row (as long as the tile is inside the grid as well
                for(let c = firstCol; c <= lastCol; c++) {
                    if (c >= 1 && c <= this.grid.gridWidth) {
                        tileToAdd = 'row' + r + 'col' + c;
                        tiles = tiles.add($('#' + tileToAdd));
                    }
                }
            } else {
                // add the left and right tiles for the middle rows as long as their inside the grid
                if (r >= 1 && r <= this.grid.gridHeight) {
                    if (firstCol >= 1) {
                        tileToAdd = 'row' + r + 'col' + firstCol;
                        tiles = tiles.add($('#' + tileToAdd));
                    }
                    if (lastCol <= this.grid.gridWidth) {
                        tileToAdd = 'row' + r + 'col' + lastCol;
                        tiles = tiles.add($('#' + tileToAdd));
                    }
                }
            }
        }
        return tiles;
    }

    killObject(objectList, object) {
        let helpers = this;
        window.setTimeout(function() {
            helpers.grid.clearImg(objectList[object]);
            if (objectList[object].constructor === PlayerCharacter)
                objectList[object].clearLighting();
            delete objectList[object];
        }, 400);
    }
}
